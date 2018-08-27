<template>
  <div id="employeeCard">
    <div class="add">
      <el-button type="primary" @click="addEmployeeCard">新增员工</el-button>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="formInline.contacts_phone" placeholder="手机"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">筛选</el-button>
      </el-form-item>
    </el-form>
    <div class="cardList">
      <el-card class="box-card" v-for="item in cardList" :key="item.id">
        <div class="cardItem">
          <div class="cardInfo">
            <h3 class="shopname">{{item.name}}</h3>
            <div>
              <h4 class="shopname">{{item.title}}</h4>
              <p class="shopname">{{item.duty}}</p>
            </div>
            <p>{{item.contacts_phone}}</p>
          </div>
          <div class="cardImg">
            <img :src="item.head_pic" width="90" height="90"/>
            <img v-if="item.qrcode!=''" :src="item.qrcode" width="40" height="40"/>
          </div>
        </div>
        <div class="triangleTopleft" v-if="item.overhead==1">
          <span>置顶</span>
        </div>
        <div class="cardHover">
          <el-button type="primary" circle @click="overhead(item.id)">置顶</el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="addEmployeeCard(item.id)"></el-button>
          <el-button type="primary" icon="el-icon-delete" circle @click="delCard(item.id)"></el-button>
        </div>
      </el-card>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="20"
        layout="total, prev, pager, next,jumper"
        :total="total_count">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle"  :top="screeHeight<=800?(screeHeight-660)/2+'px':'15vh'"  :visible.sync="dialogFormVisible">
      <el-form :model="form" class="empleform"  label-width="100px" :rules="rules" ref="employeeCardForm" :status-icon="true">
        <el-form-item label="头像" prop="head_pic" id="head_pic">
          <el-upload
            class="avatar-uploader"
            :action="uploadOptions.url"
            :data="uploadOptions.data"
            :show-file-list="false"
            name="headpic[]"
            accept="image/*"
            :on-change="handleAvatarSuccess"
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
            :on-progress="AvatarUploadProgress1">
            <img v-if="form.head_pic" :src="form.head_pic" class="avatar" width="60" height="60">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" auto-complete="off" :maxlength=10></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="contacts_phone">
          <el-input v-model="form.contacts_phone" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="duty">
          <el-input v-model="form.duty" auto-complete="off" :maxlength=15></el-input>
        </el-form-item>
        <el-form-item label="个人简介" prop="introduce">
          <el-input v-model="form.introduce" auto-complete="off" :maxlength=32></el-input>
        </el-form-item>
        <el-form-item label="二维码">
          <el-upload
            class="avatar-uploader"
            :action="uploadOptions.url"
            :data="uploadOptions.data"
            :show-file-list="false"
            name="headpic[]"
            accept="image/*"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload"
            :on-progress="AvatarUploadProgress2">
            <img v-if="form.qrcode" :src="form.qrcode" class="avatar" width="60" height="60">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="submitForm" :disabled="!submitFormFlag">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="头像截图" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'"  :visible.sync="headPhoneVisible"  ref="videoCover">
      <div class="dialog-body" style="height:400px;">
        <vueCropper
          ref="cropper"
          :img="cropper.img"
          :outputSize="cropper.size"
          :outputType="cropper.outputType"
          :info="cropper.info"
          :canScale="cropper.canScale"
          :autoCrop="cropper.autoCrop"
          :autoCropWidth="cropper.autoCropWidth"
          :autoCropHeight="cropper.autoCropHeight"
          :fixed="cropper.fixed"
          :fixedNumber="cropper.fixedNumber"
        ></vueCropper>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="headPhoneVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="getCoverScreenhot">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {isvalidPhone} from '../../../js/validate';
  import qs from 'qs'
  import VueCropper from 'vue-cropper'
    export default{
        components:{
          qs,
          VueCropper
        },
        data: function () {
          var _that=this;
          var goodsImgsNull=(rule, value, callback)=>{
            if(_that.form.head_pic==undefined){
              callback(new Error('请上传头像'))
            }else{
              callback()
            }
          };
          var phoneValidate=(rule,value,callback)=>{
            var re1=/^(1(3|4|5|6|7|8|9)[0-9]{9})$/;
            var re2=/^(0\d{2,3}-\d{7,8})$/;
            if(value==''){
              callback(new Error('号码不能为空'))
            }else if(!re1.test(value)&&!re2.test(value)){
              callback(new Error('请输入正确的手机号或电话'))
            }else{
              callback()
            }
          };
            return {
              screeHeight:window.innerHeight,
              dialogTitle:'新增员工名片',
              dialogFormVisible:false,
              headPhoneVisible:false,
              form:{
                name:'',
                head_pic:'',
                duty:'成员',
                contacts_phone:'',
                qrcode:'',
                introduce:'',
                id:''
              },
              rules:{
                name:[{required: true, message: '请输入姓名', trigger: 'blur'}],
                head_pic:[{required: true, message: '请上传头像', trigger: 'on-change',validator: goodsImgsNull}],
                duty:[{required: true, message: '请输入职位', trigger: 'blur'}],
                contacts_phone:[{required: true,  trigger: 'blur',validator:phoneValidate}]
              },
              formInline:{
                name:'',
                contacts_phone:'',
              },
              submitFormFlag:true,
              currentPage1:1,
              total_page:1,
              total_count:0,
              cardList:[],
              uploadOptions:{
                url:this.api.upload_img,
                data:{
                  path_code:'22',
                  data_type:'html'
                }
              },
              cropper: {
                img: '',
                info: true,
                size: 1,
                outputType: 'jpeg',
                canScale: true,
                autoCrop: true,
                // 开启宽度和高度比例
                autoCropWidth:100,
                autoCropHeight:100,
                fixed: true,
                full:true,
                fixedNumber: [1,1]
              },
            }
        },
        created:function(){
          this.getElementCardList(1);
        },
        methods: {
            //头像上传成功
          handleAvatarSuccess(file, fileList){
            if(file.size/1024/1024>2){
              this.$message.error('上传图片不能超过2M！');
              return false;
            }else{
                var _this=this;
              let img = new Image();
              img.onload = () =>{
                if (img.width / img.height >= 750 / 400) {
                  _this.cropper.autoCropWidth = (img.height * 750 / 400) * (750 / img.width);
                  _this.cropper.autoCropHeight=_this.cropper.autoCropWidth;
                } else {
                  _this.cropper.autoCropWidth = img.width * (400 / img.height);
                  _this.cropper.autoCropHeight=_this.cropper.autoCropWidth;
                }
                _this.cropper.img=file.url;
                _this.headPhoneVisible=true;
              };
              img.src=file.url;
            }
          },
          //二维码上传成功
          handleAvatarSuccess2(res, file){
            if(res.state.code==10200){
              this.form.qrcode = this.api.photo_Server+res.data;
            }else{
              this.$message.error('上传失败！');
            }
          },
          //头像上传前
          beforeAvatarUpload(file){
            if(file.size/1024/1024>2){
              this.$message.error('上传图片不能超过2M！');
              return false;
            }
          },
          AvatarUploadProgress1(event, file, fileList){
            this.form.head_pic=file.url;
            if(document.getElementById('head_pic').getElementsByClassName('el-form-item__error').length>0){
              document.getElementById('head_pic').getElementsByClassName('el-form-item__error')[0].remove();
            }
          },
          AvatarUploadProgress2(event, file, fileList){
            this.form.qrcode=file.url;
          },
          //点击筛选触发事件
          queryList(page){
              this.getElementCardList(1);
          },
          //获取员工名片列表
          getElementCardList(page){
              var smData={};
              smData.act=11;
              if(this.formInline.name!=''&&this.formInline.name!=undefined){
                  smData.name=this.formInline.name;
              }
              if(this.formInline.contacts_phone!=''&&this.formInline.contacts_phone!=undefined){
                  smData.contacts_phone=this.formInline.contacts_phone;
              }
              smData.page=page;
            this.api.request({
              url:this.api.clerk_info_list,
              method:'post',
              data:smData,
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.total_page=res.data.data.total_page;
                this.total_count=res.data.data.total_count;
                this.cardList=res.data.data.list;
              }
            })
          },
          handleCurrentChange(currentPage){
            this.getElementCardList(currentPage);
          },
          //获取新增/编辑员工名片数据
          addEmployeeCard(id){
              this.clearValidateForm();
            this.submitFormFlag=true;
            if(id!=''&&id!=undefined){
              this.api.request({
                url:this.api.get_clerk_info,
                params:{
                  act:11,
                  id:id
                }
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.form.name=res.data.data.name;
                  this.form.head_pic=res.data.data.head_pic;
                  this.form.duty=res.data.data.duty;
                  this.form.introduce=res.data.data.introduce;
                  this.form.contacts_phone=res.data.data.contacts_phone;
                  this.form.qrcode=res.data.data.qrcode;
                  this.form.id=id;
                  this.dialogFormVisible = true;
                }
              })
            }else{
              this.dialogFormVisible = true;
            }
          },
          //置顶职员名片
          overhead(id){
            if(id!=''&&id!=undefined){
              this.api.request({
                url:this.api.overhead,
                method:'post',
                data:{
                    act:11,
                  id:id
                }
              }).then((res)=>{
                if(res.data.state.code==10200){
                    this.getElementCardList(this.currentPage1);
                }
              })
            }
          },
          //删除员工名片
          delCard(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                this.api.request({
                  url:this.api.del_clerk_info,
                  method:'post',
                  data:{
                      act:11,
                    id:id
                  }
                }).then((res)=>{
                  if(res.data.state.code==10200){
                      this.getElementCardList(this.currentPage1);
                      this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  }
                })
            }).catch(() => {
            });
          },
          //提交新增/编辑员工名片
          submitForm(){
              if(this.submitFormFlag) {
                this.submitFormFlag=false;
                this.$refs['employeeCardForm'].validate((valid) => {
                  if (valid) {
                    var smData = this.form;
                    smData.act = 11;
                    this.api.request({
                      url: this.api.save_clerk_info,
                      method: 'post',
                      data: smData
                    }).then((res) => {
                      if (res.data.state.code == 10200) {
                        this.$message({
                          message: '保存成功！',
                          type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.getElementCardList(this.currentPage1);
                        //this.$refs['employeeCardForm'].resetFields();
                      }
                    })
                  } else {
                    this.submitFormFlag=true;
                    return false;
                  }
                });
              }
          },
          //移除整个表单的验证效果
          clearValidateForm() {
            if(this.$refs['employeeCardForm']!=undefined){
              this.$refs['employeeCardForm'].clearValidate();
            }
          },
          //截图确定事件
          getCoverScreenhot(){
            this.$refs.cropper.getCropData((base64Url) => {
              this.uploadCapture(base64Url);
            })
          },
          //头像上传服务器
          uploadCapture(base64Url){
            var smData={
              data: base64Url,
              path_code: 22
            }
            this.api.request({
              url: this.api.upload_data_img,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              params:{},
              data:qs.stringify(smData),
            }).then(res => {
              if(res.data.state.code==10200){
                this.headPhoneVisible=false;
                this.form.head_pic = this.api.photo_Server+res.data.data;
                console.log(this.form.head_pic,'上传');
                if(document.getElementById('head_pic').getElementsByClassName('el-form-item__error').length>0){
                  document.getElementById('head_pic').getElementsByClassName('el-form-item__error')[0].remove();
                }
              }else{
                this.headPhoneVisible=false;
                this.$message.error('头像上传失败');
              }
            });
          },
        }
    }
</script>
<style lang="less">
  #employeeCard{
    font-size:12px;
    color:#303133;
    .add{
      text-align: right;
    }
    .triangleTopleft {
      width: 0;
      height: 0;
      border-top: 40px solid #67C23A;
      border-right: 40px solid transparent;
      position:absolute;
      top:0px;
      left:0px;
      span{
        position: absolute;
        top: -35px;
        left: -13px;
        width: 50px;
        transform: rotate(-45deg);
        text-align: center;
        color:#fff;
      }
    }

    .box-card {
      width: 330px;
      display:inline-block;
      margin-right:20px;
      margin-bottom:20px;
    }
    .el-pagination{
      text-align: center;
      padding:10px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: block;
      &.headImg{
        border-radius:178px;
      }
    }
    .el-form-item{
     /* margin-bottom: 12px;*/
    }
    .el-dialog{
      margin-bottom: 0px !important;
    }
    .el-card{
      position:relative;
      .cardHover{
        position: absolute;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        background: rgba(0,0,0,0.3);
        align-items: center;
        justify-content: center;
        display: none;
      }
      &:hover .cardHover{
        display: flex;
      }
      .cardItem{
         height:150px;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         .cardInfo{
           display: flex;
           flex-direction: column;
           justify-content: space-between;
           max-width: 200px;
           overflow: hidden;
         }
         .cardImg{
           display: flex;
           flex-direction: column;
           justify-content: space-between;
           align-items:flex-end;

         }
         .shopname{
           display: -webkit-box;
           -webkit-box-orient: vertical;
           -webkit-line-clamp: 2;
           overflow: hidden;
           word-wrap : break-word ;word-break : break-all ;
           width:200px;
         }
       }

    }


  }
</style>
