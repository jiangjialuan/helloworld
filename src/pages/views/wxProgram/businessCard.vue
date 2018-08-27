<template>
  <div id="businessCard">
    <el-tabs v-model="activeName2" type="card" :tab-position="forms.length>7?'left':'top'"  @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <!--企业名片-->
        <div><!--这个div删了预览的背景下面也会变颜色-->
          <el-card class="businessCard" :style="'background:'+businessCardForm.background_color">
            <img :src="businessCardForm.front_color=='#ffffff'?businessCardHeadWhiteImg:businessCardHeadBlackImg" width="375px"/>
            <div class="scrollView" style="height: 600px;overflow-y: scroll">
              <div class="contentBg">
                <img :src="businessCardForm.head_img" class="businessCardLogo"/>
                <p class="businessCardTitle">{{businessCardForm.nick_name}}</p>
                <img src="../../../img/businessCard/hr.png" height="7px" width="305px"/>
                <div class="previewTextBody" v-show="businessCardForm.address">
                  <img src="../../../img/businessCard/logo-address.png" height="24px" width="24px"/>
                  <p class="previewTextContent">{{businessCardForm.address}}</p>
                  <img src="../../../img/businessCard/right.png" height="16px" width="16px"/>
                </div>
                <div class="previewTextBody" v-show="businessCardForm.work_time">
                  <img src="../../../img/businessCard/logo-time.png" height="24px" width="24px"/>
                  <p class="previewTextContent">{{businessCardForm.work_time}}</p>
                </div>
                <div class="previewTextBody" v-show="businessCardForm.mobile_phone">
                  <img src="../../../img/businessCard/logo-phone.png" height="24px" width="24px"/>
                  <p class="previewTextContent">{{businessCardForm.mobile_phone}}</p>
                  <img src="../../../img/businessCard/right.png" height="16px" width="16px"/>
                </div>
                <div class="previewTextBody" v-show="businessCardForm.company">
                  <img src="../../../img/businessCard/logo-name.png" height="24px" width="24px"/>
                  <p class="previewTextContent">{{businessCardForm.company}}</p>
                </div>
              </div>
              <!--<div style="width: 375px;background: #fff" v-html='businessCardForm.introduce'></div>-->
            </div>
          </el-card>
        </div>
        <!--帐户信息-->
        <el-form :model="businessCardForm" label-width="140px" style="width: 560px;margin-left: 100px">
          <!--<el-form-item label="是否开启企业名片:">
            <el-radio-group v-model="businessCardForm.is_on">
              <el-radio :label="'yes'">开启</el-radio>
              <el-radio :label="'no'">关闭</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="经营地址:">
            <el-input v-model="businessCardForm.address" placeholder="经营地址" clearable></el-input>
          </el-form-item>
          <el-form-item label="营业时间:">
            <el-input v-model="businessCardForm.work_time" placeholder="营业时间" clearable></el-input>
          </el-form-item>
          <el-form-item label="企业电话:" required>
            <el-input v-model="businessCardForm.mobile_phone" placeholder="企业电话" clearable></el-input>
          </el-form-item>
          <el-form-item label="企业名称:">
            <el-input v-model="businessCardForm.company" placeholder="企业名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="业务简介:">
            <el-input v-model="businessCardForm.introduce" placeholder="业务简介显示在小程序首页，建议填写" clearable></el-input>
          </el-form-item>
          <div class="footerSubmit">
            <el-button style="width: 100px" type="primary" @click="uploadBusinessCard">保存</el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="item.title==''?'无标题':item.title" v-for="(item,index) in forms" :key="'key'+index" :name="'tab'+index" >
        <el-form :ref="'enterpriseForm'+index" :model="forms[index]" label-width="140px">
          <el-form-item label="模块名称" prop="title" :rules="[{ required: true, message: '请输入模块名称', trigger: 'blur'},{max: 12, message: '最大长度12个字符', trigger: 'change'}]">
            <el-row>
              <el-col :span="12">
                <el-input v-model="item.title" :maxlength=12></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="内容简介" prop="abstract"  :rules="[{ required: true, message: '请输入内容简介', trigger: 'blur'},{max: 28, message: '最大长度28个字符', trigger: 'change'}]">
            <el-row>
              <el-col :span="12">
                <el-input type="textarea"  v-model="item.abstract" :maxlength=28></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="模块内容">
            <el-row>
              <el-col :span="12">
                <UE :defaultMsg='item.introduce' :config="config"  :id="'ue'+index" :ref="'ue'+index"></UE>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="footerSubmit">
          <el-button style="width: 100px" type="primary" @click="saveForm(item.id,index)">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import E from 'wangeditor'
  import businessCardHeadWhiteImg from '../../../img/businessCard/businessCardHeadWhite.png'
  import businessCardHeadBlackImg from '../../../img/businessCard/businessCardHeadBlack.png'
  import UE from '../../../components/ue.vue';
  var editData=[];
  export default {
    components: {E,UE},
    data() {
      return {
        businessCardForm: {
            is_on:'yes'
        },
        businessCardHeadWhiteImg: businessCardHeadWhiteImg,
        businessCardHeadBlackImg: businessCardHeadBlackImg,
        forms:[{title:'企业介绍',abstract:'企业成立多年，拥有丰富的从业经验',introduce:''},
          {title:'人才招聘',abstract:'公司快速发展中，欢迎优秀人才加入','introduce':''},
          {title:'案例简介',abstract:'众多优秀案例','introduce':''}],
        enterpriseForm:{},
        jobsForm:{},
        config: {
          toolbars:[['Source','Bold','italic', 'underline',  'forecolor','fontfamily', 'fontsize', 'justifyleft','justifycenter', 'justifyright', 'simpleupload' ]],
          initialFrameHeight: 500,
          enableAutoSave: false,
          enableContextMenu: false,
          elementPathEnabled: false,
          wordCountMsg: '{#count} / 10000',
          wordOverFlowMsg: '请不要超过10000个字符',
          autoHeightEnabled: false,
          scaleEnabled: false,
          zIndex: 1,
          autoFloatEnabled: true,
          initialFrameWidth : null,
          initialFrameHeight: 500
          //initialFrameHeight: 350
        },
        caseIntroductionForm:{},
        flag:true,
        activeName2:'first'
      }
    },
    created() {
      this.baseInfoInit().then((res)=>{
        for(var i=0;i<this.forms.length;i++){
            var editor=this.$refs['ue'+i][0];
          editor.setUEContent(this.forms[i].introduce);
        }
      });
    },
    methods: {
      handleClick(tab){
        //for(var i=0;i<this.forms.length;i++){
        /*var i=parseInt(tab.index-1);
          if(this.$refs['ue'+i]){
            var editor=this.$refs['ue'+i][0];
            var height=document.getElementById('ue'+i).getElementsByTagName('iframe')[1].contentWindow.document.documentElement.scrollHeight;
            console.log(height);
            console.log(editor.getUEContentLength());
            editor.setUEHeight(editor.getUEContentLength()>0?height:300);

          }*/

       // }
      },
      //基本信息保存
      uploadBusinessCard() {
          if (this.businessCardForm.mobile_phone == '') {
            this.$message.error("电话号码不能为空");
            return false;
          }
          this.api.request({
            url: this.api.save_enterprise_card,
            data: {
              act: 11,
              address: this.businessCardForm.address,
              work_time: this.businessCardForm.work_time,
              mobile_phone: this.businessCardForm.mobile_phone,
              company: this.businessCardForm.company,
              introduce:this.businessCardForm.introduce,
              is_on: this.businessCardForm.is_on
            },
            method: 'post'
          }).then(res => {
            if (res.data.state.code == 10200) {
              this.$message.success(res.data.state.msg);
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
      },
      //基本信息初始化
      baseInfoInit(){
        return new Promise((resolve,reject)=> {
          this.api.request({
            url: this.api.get_enterprise_card + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              this.businessCardForm = res.data.data;
              if (res.data.data.enterprise_detail.length > 0) {
                res.data.data.enterprise_detail.forEach((item,i)=>{
                  this.forms[i]=item;
                });
              }
              resolve(res);
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        });
      },
      //保存企业详情
      saveForm(id,index){
        this.$refs['enterpriseForm'+index][0].validate((valid)=>{
            if(valid){
                var smData=this.forms[index];
                smData.act=11;
              console.log(this.$refs['ue'+index][0].getUEContent());
              var ue=this.$refs['ue'+index][0].getUEContent();
                smData.introduce=this.$refs['ue'+index][0].getUEContent();;
              this.api.request({
                url:this.api.save_enterprise_detail,
                method:'post',
                data:smData
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.$message({
                    message:'保存成功！',
                    type:'success'
                  });
                  this.forms[index].id=res.data.data.id;
                }
              });
            }
        });
      },
    }
  }
</script>

<style lang="less">
  #businessCard {
    overflow-x: hidden;
    display: flex;
    padding-bottom:51px;
    .el-tabs--left.el-tabs--card .el-tabs__item.is-left,.el-tabs--card>.el-tabs__header .el-tabs__item{
      max-width:100px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    #pane-first{
      display: flex;
    }
    .edui-default .edui-toolbar{
      height:24px;
    }
    .edui-default .edui-toolbar .edui-combox .edui-combox-body{
      height:20px;
    }
    .businessCard { //1
      /*width: 375px;*/
      /*text-align: center;*/
      .el-card__body { //2
        padding: 0;
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
        .scrollView { //2.5
          .contentBg { //3
            background: rgba(255, 255, 255, 0.8);
            width: 340px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 28px;
            margin: 12px auto 20px;
            border-radius: 4px;
            color: #3D3D3D;
            .businessCardLogo { //4
              width: 54px;
              height: 54px;
              border-radius: 4px;
              margin: 26px auto 18px;
            }
            .businessCardTitle {
              font-size: 25px;
              margin-bottom: 18px;
            }
            .previewTextBody {
              display: flex;
              align-items: center;
              margin-top: 24px;
              width: 297px;
              .previewTextContent { //5
                width: 207px;
                font-size: 15px;
                margin: 0 27px 0 19px;
                text-align: left;
                word-wrap: break-word;
              }
            }
          }
        }
      }
    }
    .scrollView::-webkit-scrollbar { /*隐藏滚动条*/
      display: none;
    }
    .footerSubmit { //1
      background-color: rgba(0, 0, 0, .4);
      height: 56px;
      line-height: 56px;
      position: fixed;
      left: 260px;
      right: 0;
      bottom: 0;
      text-align: center;
      z-index: 10000;
    }
    .el-tabs{
      width:100%;
      .editMenu{
        border:1px solid #ddd;
      }
      .editCont{
        border-left:1px solid #ddd;
        border-right:1px solid #ddd;
        border-bottom:1px solid #ddd;
        &>div{
          min-height:500px;
        }
      }
    }
  }
</style>
