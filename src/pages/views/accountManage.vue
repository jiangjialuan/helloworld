<template>
  <div id="accountManage">
    <!--帐户信息-->
    <div>
      <el-card style="width: 500px">
        <div slot="header">帐户信息</div>
        <el-form :model="accountInfoForm" ref="accountInfoForm" :rules="rules" label-width="140px">
          <el-form-item label="设置头像:">
            <el-upload
              class="avatar-uploader"
              action="http://yimidemo.artqiyi.com/index/index/upload_img"
              name="headpic[]"
              :data="uploadPhoto"
              :show-file-list="false"
              :before-upload="handlePictureCardbefore"

              >
              <!--:on-success="handleAvatarSuccess"-->
              <img v-if="accountInfoForm.head_pic" :src="accountInfoForm.head_pic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号:">
            <el-input :placeholder="userAccount" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="店名:" prop="name" required>
            <el-input v-model="accountInfoForm.name"  placeholder="店名(必填)" clearable></el-input>
          </el-form-item>
          <!--<el-form-item label="公司/个体名称:" prop="realname" required>
            <el-input v-model="accountInfoForm.realname" placeholder="公司/个体名称(必填)" :disabled="accountInfoForm.hasrealname" :clearable="!accountInfoForm.realname"></el-input>
          </el-form-item>
          <el-form-item label="联系人名称:" prop="contacts_name" required>
            <el-input v-model="accountInfoForm.contacts_name" placeholder="联系人名称(必填)" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="contacts_phone" required>
            <el-input v-model="accountInfoForm.contacts_phone" placeholder="联系电话(必填)" clearable></el-input>
          </el-form-item>
          <el-form-item label="个人简介:" prop="introduction">
            <el-input v-model="accountInfoForm.introduction" type="textarea" :rows="4" :maxlength="100" placeholder="个人简介"></el-input>
            <p style="text-align: right">({{accountInfoForm.introduction.length}}/100)</p>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="changeAccountInfo">提交</el-button>
            <el-button @click="resetForm('accountInfoForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <P style="padding:10px; text-align: center">注册日期:{{accountInfoForm.regtime}}</P>
    </div>
    <!--修改密码-->
    <el-card v-if="hasPassword" style="width: 500px;min-width: 500px;margin-left: 100px;height: 345px;">
      <div slot="header">修改密码</div>
      <el-form class="passwordForm" :model="changePasswordForm" ref="changePasswordForm" :rules="rules" label-width="140px">
        <el-form-item label="旧密码:" prop="oldPassword">
          <el-input v-model="changePasswordForm.oldPassword" :type="changePasswordFormOldPasswordShow?'text':'password'" placeholder="旧密码"></el-input>
          <span class="icon-end" @click="changePasswordFormOldPasswordShow=!changePasswordFormOldPasswordShow"><icon :name="changePasswordFormOldPasswordShow?'password-open':'password-close'"
                                                                                                                     scale="2"></icon></span>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input v-model="changePasswordForm.newPassword" :type="changePasswordFormNewPasswordShow?'text':'password'" placeholder="新密码，最少6位"></el-input>
          <span class="icon-end" @click="changePasswordFormNewPasswordShow=!changePasswordFormNewPasswordShow"><icon :name="changePasswordFormNewPasswordShow?'password-open':'password-close'"
                                                                                                                     scale="2"></icon></span>
        </el-form-item>
        <el-form-item label="确认密码:" prop="repeatPassword">
          <el-input v-model="changePasswordForm.repeatPassword" :type="changePasswordFormRepasswordShow?'text':'password'" placeholder="确认密码"></el-input>
          <span class="icon-end" @click="changePasswordFormRepasswordShow=!changePasswordFormRepasswordShow"><icon :name="changePasswordFormRepasswordShow?'password-open':'password-close'"
                                                                                                                   scale="2"></icon></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--设置密码-->
    <el-card v-if="!hasPassword" style="width: 500px;min-width: 500px;margin-left: 100px;height: 345px;">
      <div slot="header">设置密码</div>
      <el-form class="passwordForm" :model="setPasswordForm" ref="setPasswordForm" :rules="rules" label-width="140px">
        <el-form-item label="密码:" prop="password">
          <el-input v-model="setPasswordForm.password" :type="setPasswordFormPasswordShow?'text':'password'" placeholder="密码，最少6位"></el-input>
          <span class="icon-end" @click="setPasswordFormPasswordShow=!setPasswordFormPasswordShow"><icon :name="setPasswordFormPasswordShow?'password-open':'password-close'" scale="2"></icon></span>
        </el-form-item>
        <el-form-item label="确认密码:" prop="repassword">
          <el-input v-model="setPasswordForm.repassword" :type="setPasswordFormRepasswordShow?'text':'password'" placeholder="确认密码"></el-input>
          <span class="icon-end" @click="setPasswordFormRepasswordShow=!setPasswordFormRepasswordShow"><icon :name="setPasswordFormRepasswordShow?'password-open':'password-close'"
                                                                                                             scale="2"></icon></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setPasswordSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <cutPictur @comfirm="pictureCardSuccess" ref="cutPicture"></cutPictur>
  </div>
</template>

<script>
  import {isvalidPhone} from '../../js/validate.js';
  import cutPictur from '../../components/cutPicture.vue';

  export default {
    components: {
      cutPictur
    },
    data() {
      const validatePhone = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入电话号码'))
        } else if (!isvalidPhone(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码不得小于6位'))
        } else {
          callback()
        }
      };
      const validateRepeatpassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'))
        } else if (value != this.changePasswordForm.newPassword) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      };
      const validateRepassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'))
        } else if (value != this.setPasswordForm.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      };
      const validateNoEmpty = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('内容不能为空！'))
        } else {
          callback()
        }
      };
      return {
        userAccount:JSON.parse(sessionStorage.getItem('userinfo')).mobile_phone,
        uploadPhoto: {
          path_code: 16
        },
        userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
        curuid:sessionStorage.getItem('curuid'),
        accountInfoForm: {
          head_pic: JSON.parse(sessionStorage.getItem('userinfo')).head_pic,
          name: JSON.parse(sessionStorage.getItem('userinfo')).name,
          realname: JSON.parse(sessionStorage.getItem('userinfo')).realname,
          contacts_name: JSON.parse(sessionStorage.getItem('userinfo')).contacts_name,
          contacts_phone: JSON.parse(sessionStorage.getItem('userinfo')).contacts_phone,
          introduction: JSON.parse(sessionStorage.getItem('userinfo')).introduction,
          regtime: JSON.parse(sessionStorage.getItem('userinfo')).regtime,
          hasrealname:JSON.parse(sessionStorage.getItem('userinfo')).realname==''?false:true,
        },
        rules: {//输入验证
          oldPassword: [{validator: validatePassword, trigger: 'blur'}],
          newPassword: [{validator: validatePassword, trigger: 'blur'}],
          repeatPassword: [{validator: validateRepeatpassword, trigger: 'blur'}],
          password: [{validator: validatePassword, trigger: 'blur'}],
          repassword: [{validator: validateRepassword, trigger: 'blur'}],
          name: [{validator: validateNoEmpty, trigger: 'blur'}],
          realname: [{validator: validateNoEmpty, trigger: 'blur'}],
          contacts_name: [{validator: validateNoEmpty, trigger: 'blur'}],
          contacts_phone: [{validator: validatePhone, trigger: 'blur'}]
        },
        hasPassword: JSON.parse(sessionStorage.getItem('userinfo')).has_password == 1 ? true : false,
        changePasswordForm: {
          oldPassword: '',
          newPassword: '',
          repeatPassword: ''
        },
        changePasswordFormOldPasswordShow: false,//修改密码表单旧密码显示隐藏
        changePasswordFormNewPasswordShow: false,//修改密码表单新密码显示隐藏
        changePasswordFormRepasswordShow: false,//修改密码表单确认密码显示隐藏
        setPasswordForm: {
          password: '',
          repassword: ''
        },
        setPasswordFormPasswordShow: false,//设置密码表单密码显示隐藏
        setPasswordFormRepasswordShow: false,//设置密码表单确认密码显示隐藏
      }
    },
    methods: {
      //商品图片上传前触发函数
      handlePictureCardbefore(file){
        if(file.size/1024/1024>2){
          this.$message.error("上传图片不能大于2M");
          return false;
        }
        if(file.type=='image/jpeg'){
          //return true;
          this.$refs['cutPicture'].open(file);
          return false;
        }else if(file.type=='image/png') {
          // return true;
          this.$refs['cutPicture'].open(file);
          return false;
        }else  if(file.type=='image/jpg'){
          // return true;
          this.$refs['cutPicture'].open(file);
          return false;
        }else{
          this.$message.error("请上传图片");
          return false;
        }
      },
      //切图上传成功角发函数
      pictureCardSuccess(res){
        this.accountInfoForm.head_pic = this.api.photo_Server+ res.data;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //修改账户信息
      changeAccountInfo() {
        this.$refs['accountInfoForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.complete_info,
              data: {
                act: 11,
                head_pic: this.accountInfoForm.head_pic,
                name: this.accountInfoForm.name,
                realname: this.accountInfoForm.realname,
                contacts_name: this.accountInfoForm.contacts_name,
                contacts_phone: this.accountInfoForm.contacts_phone,
                introduction: this.accountInfoForm.introduction
              },
              method: 'post'
            }).then(res => {
              if (res.data.state.code == 10200) {

                this.accountInfoForm.hasrealname=true;
                const userinfoObj = JSON.parse(sessionStorage.getItem('userinfo'));
                userinfoObj.head_pic = this.accountInfoForm.head_pic;
                userinfoObj.name = this.accountInfoForm.name;
                userinfoObj.realname = this.accountInfoForm.realname;
                userinfoObj.contacts_name = this.accountInfoForm.contacts_name;
                userinfoObj.contacts_phone = this.accountInfoForm.contacts_phone;
                userinfoObj.introduction = this.accountInfoForm.introduction;
                const userinfoString = JSON.stringify(userinfoObj);
                //if(this.curuid==this.userinfo.uid) {
                  sessionStorage.setItem('userinfo', userinfoString);
                //}
                bus.$emit('bus_head_pic', this.accountInfoForm.head_pic);
                bus.$emit('bus_name', this.accountInfoForm.name);
                this.$message.success(res.data.state.msg);
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              } else if (res.data.state.code == 10401) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },
      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //修改密码
      changePassword() {
        this.$refs['changePasswordForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.reset_password,
              data: {
                act: 11,
                old_password: this.changePasswordForm.oldPassword,
                new_password: this.changePasswordForm.newPassword
              },
              method: 'post'
            }).then(res => {

              this.loading = false;
              if (res.data.state.code == 10200) {
                this.$message.success(res.data.state.msg);
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              } else if (res.data.state.code == 10401) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.loading = false;
              this.$message.error(err);//登录失败提示错误
            })
          }
        })
      },
      //设置密码
      setPasswordSubmit() {
        this.$refs['setPasswordForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.complete_info,
              data: {
                act: 11,
                password: this.setPasswordForm.password,
                repeat_password: this.setPasswordForm.repassword
              },
              method: 'post'
            }).then(res => {
              if (res.data.state.code == 10200) {
                this.$message.success(res.data.state.msg);
                this.hasPassword=true;
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  #accountManage {
    color:#606266;
    padding-bottom:55px;
    background: #fff;
    font-size:12px;
    display: flex;
    .passwordForm {
      .el-form-item__content { //1
        display: flex;
      }
      .icon-end { //2显示密码眼睛图标
        color: #606266;
        position: relative;
        right: 25px;
        top: 4px;
      }
    }
  }

  /*上传头像*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-left: 40px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
