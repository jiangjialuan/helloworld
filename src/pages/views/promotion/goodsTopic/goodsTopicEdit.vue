<template>
  <div id="goodsTopicEdit">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动名称" prop="name" :rules="[{ required: true, message: '请输入活动名称', trigger: 'change'}]">
        <div v-if="userinfo.edit_flag&&from_parent==0"><el-input class="per60" v-model="form.name" :maxlength="10"></el-input> {{form.name.length}} / 10</div>
        <div v-else>{{form.name}}</div>
      </el-form-item>

      <el-form-item label="活动商品" required="">
        <p v-if="userinfo.edit_flag&&from_parent==0">&nbsp;<el-button type="primary" size="mini" @click="open">选择商品</el-button></p>
      </el-form-item>
      <el-row class="rules" :style="userinfo.edit_flag&&from_parent==0?'':'margin-top: -45px;'">
        <table class="el-table el-table--border per60" style="wdith:480px;" cellspacing="0" cellpadding="0" border="0" >
          <tr>
            <th class="is-leaf" width="252"><div class="cell">商品</div></th>
            <th class="is-leaf" width="120"><div class="cell">排序<el-tooltip  :value="true"  content="排序值越大越排在前面" placement="top" effect="light"><i class="el-icon-question"></i></el-tooltip></div></th>
            <th class="is-leaf" width="80" v-if="userinfo.edit_flag&&from_parent==0"><div class="cell" >操作</div></th>
          </tr>
        </table>
        <div style="max-height: 300px;width:640px; overflow-y:auto; overflow-x: hidden">
          <table class="el-table el-table--border per60" cellspacing="0" cellpadding="0" border="0" >
            <tr v-for="(good,goodidx) in form.activity_goods">
              <td width="253">
                <div class="goods-content">
                  <div class="goods-img">
                    <img :src="good.image">
                    <span class="parentIcon" v-if="good.sell==1">下架</span>
                    <span class="parentIcon" v-else-if="good.is_custom==6">总店</span>
                  </div>
                  <div class="goods-info">
                    <p class="wname">{{good.goods_name}}</p>
                    <p class="wname">￥{{good.price}}</p>
                  </div>
                </div>
              </td>
              <td class="alignCenter" width="120"><el-input size="mini" style="width:100px;" v-model="good.sort" v-if="userinfo.edit_flag&&from_parent==0"></el-input><span v-else>{{good.sort}}</span></td>
              <td class="alignCenter" width="80" v-if="userinfo.edit_flag&&from_parent==0"><el-button type="text" @click="cancelGoods(goodidx)">取消参加</el-button></td>
            </tr>
            <tr v-if="form.activity_goods.length<=0">
              <td colspan="2" class="alignCenter">暂时没有商品参加活动~</td>
            </tr>
          </table>
        </div>
      </el-row>
      <el-form-item label="专题模式" required="" class="mode">
        <div v-if="userinfo.edit_flag&&from_parent==0">
          <span class="modebox"><el-radio v-model="form.model" label="1">纵向</el-radio></span>
          <span class="modebox"><el-radio v-model="form.model" label="2">横向</el-radio></span>
        </div>
        <div v-else>
          <span class="modebox">{{form.model==1?'纵向':'横向'}}</span>
        </div>
      </el-form-item>
      <el-row class="rules" >
        <div v-if="userinfo.edit_flag&&from_parent==0">
        <img src="../../../../img/mall/topicPortrait.jpg" style="margin-right:20px;"/>
        <img src="../../../../img/mall/topicTransverse.jpg"/>
        </div>
        <div v-else>
          <img v-if="form.model==1" src="../../../../img/mall/topicPortrait.jpg" style="margin-right:20px;"/>
          <img v-else src="../../../../img/mall/topicTransverse.jpg"/>
        </div>
      </el-row>
    </el-form>
    <selectGood :version="versionData" :requestOption="requestOption" ref="selectGoods" :propSelect="form.activity_goods" @comfirm="selectGoodsComfirm"></selectGood>
    <div class="footerSubmit">
      <el-button type="primary" @click="submitform" v-if="userinfo.edit_flag&&from_parent==0">立即发布</el-button>
      <el-button type="primary" @click="goBack" v-else>返回</el-button>
    </div>
  </div>
</template>
<script>
  import selectGood from '../../../../components/selectgoods.vue'
  import qs from 'qs';
  export default {
    name: "limitdiscountEdit",
    data(){
      return {
        form:{
          id:this.$route.params.id?this.$route.params.id:'',
          name:'',
          activity_goods:[],
          model:'1'
        },
        from_parent:'',
        curuid:sessionStorage.getItem('curuid'),
        versionData:{
          hassocial:'',
          hasService:'',
          hasSubscribe:'',
          hasConsultation:'',
          hasfictitious:'',
          hasReal:''
        },
        requestOption:{
          is_self:true
        },
        permission:JSON.parse(sessionStorage.getItem('permission')),
        version:sessionStorage.getItem('version'),
        userinfo:JSON.parse(sessionStorage.getItem('userinfo'))
      }
    },
    components: {
      selectGood,
    },
    created(){
      if(this.form.id!=''){
        this.getDetail(this.form.id);
      }
      this.hassocial();
      this.hasService();
      this.hasSubscribe();
      this.hasConsultation();
      this.hasfictitious();
      this.hasReal();
    },
    methods:{
      //点击返回触发事件
      goBack(){
        this.$router.push('/promotion/goodsTopic');
      },
      hassocial(){
        if(this.version.indexOf('社保')>=0){
          this.versionData.hassocial=true;
        }else{
          this.versionData.hassocial=false;
        }
      },
      hasService(){
        //服务
        if(this.version.indexOf('美业')>=0){
          this.versionData.hasService=true;
        }else{
          this.versionData.hasService=false;
        }
      },
      hasSubscribe(){
        //预约
        if(this.version.indexOf('美业')>=0){
          this.versionData.hasSubscribe=true;
        }else{
          this.versionData.hasSubscribe=false;
        }
      },
      hasConsultation(){
        //咨询
        if(this.version.indexOf('标准')>=0){
          debugger;
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop)
          this.versionData.hasConsultation=false;
          else this.versionData.hasConsultation=true;
        }else if(this.version.indexOf('尊享')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop)
            this.versionData.hasConsultation=false;
          else this.versionData.hasConsultation=true;
        }else if(this.version.indexOf('美业')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop)
            this.versionData.hasConsultation=false;
          else this.versionData.hasConsultation=true;
        }else if(this.version.indexOf('社保')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop)
            this.versionData.hasConsultation=false;
          else this.versionData.hasConsultation=true;
        }else{
          this.versionData.hasConsultation=false;
        }
      },
      hasfictitious(){
        //虚拟
        if(this.version.indexOf('标准')>=0){
          this.versionData.hasfictitious=true;
        }else if(this.version.indexOf('尊享')>=0){
          this.versionData.hasfictitious=true;
        }else if(this.version.indexOf('美业')>=0){
          this.versionData.hasfictitious=true;
        }
        else if (this.version.indexOf('社保') >= 0){
          this.versionData.hasfictitious=true;
        }
        else{
          this.versionData.hasfictitious=false;
        }
      },
      hasReal(){
        //实物
        if(this.version.indexOf('标准')>=0){
          this.versionData.hasReal=true;
        }else if(this.version.indexOf('尊享')>=0){
          this.versionData.hasReal=true;
        }else if(this.version.indexOf('美业')>=0){
          this.versionData.hasReal=true;
        }else{
          this.versionData.hasReal=false;
        }
      },
      //打开选择商品弹框
      open(){
        this.$refs['selectGoods'].open();
      },
      //弹框确认事件
      selectGoodsComfirm(val){
        var arr=val;
        if(arr.length>0){
          this.form.activity_goods=[];
          for(var i=0;i<arr.length;i++){
            if(!arr[i].id){
              arr[i].id='';
            }
            var obj={
              id:arr[i].id,
              price:arr[i].price,
              image:arr[i].image,
              goods_name:arr[i].goods_name,
              goods_id:arr[i].goods_id,
              is_custom:arr[i].is_custom,
            };
            this.form.activity_goods.push(obj)
          }
        }

      },
      //表单验证
      valicateForm(){
        return new Promise((resolve,reject)=>{
          this.$refs['form'].validate((valid)=>{
            if(valid){
              if(this.form.activity_goods.length<=0){
                this.$message.error('请选择参加活动的商品！');
              }else{
                resolve();
              }
            }
          });
        });
      },
      //提交表单
      submitform(){
        this.valicateForm().then(()=>{
          var loading = this.$loading({
            lock: true,
            text: '正在发布，请稍候~~',
          });
          var activetyDetail=[];
          if(this.form.activity_goods.length>0){
            for(var i=0;i<this.form.activity_goods.length;i++){
              var obj={
                id:this.form.activity_goods[i].id,
                bid:parseInt(this.form.activity_goods[i].goods_id),
              };
              if(this.form.activity_goods[i].sort!=''&&this.form.activity_goods[i].sort!=null&&this.form.activity_goods[i].sort!=undefined)
                obj.sort=parseInt(this.form.activity_goods[i].sort);
              activetyDetail.push(obj);
            }
          }
          var smData={};
          smData.id=this.form.id;
          smData.buid=this.curuid;
          smData.name=this.form.name;
          smData.album_goods=JSON.stringify(activetyDetail);
          smData.model=this.form.model;
          this.api.request({
            url:this.api.goods_album_store,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({
                type:'success',
                message:'保存成功！'
              });
              loading.close();
              this.$router.push({path:'/promotion/goodsTopic'});
            }else{
              loading.close();
              this.$message.error(res.data.state.msg);
            }
          });
        });
      },
      //重置表单
      resetForm() {
        this.$refs['form'].resetFields();
      },
      //获取详情
      getDetail(id){
        var smData={
          buid:this.curuid,
          id:id
        };
        this.api.request({
          url:this.api.goods_album_detail_data,
          method:'post',
          headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          data:qs.stringify(smData)
        }).then((res)=>{
          if(res.data.state.code==10200){
            this.form.name=res.data.data.name;
            this.form.activity_goods=res.data.data.album_goods;
            this.form.id=res.data.data.id;
            this.form.model=res.data.data.model;
            this.from_parent=res.data.data.from_parent;
          }else{
            this.$message.error(res.data.state.msg);
          }
        });
      },
      //取消商品参加
      cancelGoods(index){
        this.form.activity_goods.splice(index,1);
      }
    }
  }
</script>

<style lang="less">
  #goodsTopicEdit{
    color:#606266;
    padding-bottom:50px;
    background: #fff;
    font-size:12px;
    td{
      word-break: break-all;
    }
    td .el-checkbox__label{
      display: none;
    }
    td .el-input{
      width:120px;
    }
    .mode {
      .modebox{
        display: inline-block;
        width:320px;
        margin-right:20px;
        text-align: center;
      }
    }
    .list-group{
      display: inline-block;
    }
    td .el-form-item{
      margin:0px;
    }
    td .el-form-item__error{
      text-align: center;
      width:100%;
      /*position: static;*/
    }
    .alignCenter{
      text-align: center;
    }
    .footerSubmit {
      background-color: rgba(0, 0, 0, 0.4);
      height: 50px;
      line-height: 50px;
      position: fixed;
      left: 260px;
      right: 0;
      bottom: 0;
      text-align: center;
      z-index: 1999;
      margin:0px;
    }
    .per60{
      width:640px;
    }
    .rules{
      padding-left:80px;
      margin:0px 0px 20px;
    }
    .price{
      color:#f60;
      font-size:16px;
    }
    .goods-content{
      width:240px;
      display: flex;
      .goods-img{
        width:60px;
        height:60px;
        margin-right:10px;
        display: inline-block;
        position: relative;
        img{
          width:60px;
          height:60px;
        }
        .parentIcon{
          display: inline-block;
          width:32px;
          height:18px;
          line-height: 18px;
          border-radius:1px;
          background: rgba(0,0,0,0.5);
          font-size:10px;
          position: absolute;
          bottom:3px;
          right:3px;
          color:#fff;
          text-align: center;
        }
      }

      .goods-info{
        width:160px;
        justify-content: center;
        display: flex;
        flex-direction: column;
        p{
          overflow : hidden;
          text-overflow: ellipsis;
          align-items: center;
          justify-content: center;
          line-height: 20px;
          &.wname{
            margin-bottom: 10px;
          }
        }
      }
    }
  }

</style>
