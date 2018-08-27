<template>
  <div id="login">
    <div class="loginBox">
      <div class="loginBoxLogo">
        <!--<p class="loginBoxLogoTxt1">Welcome</p>-->
        <p class="loginBoxLogoTxt1"><img src="../img/login/logo.png"/></p>
        <p class="loginBoxLogoTxt2">
          <span>做最好的经营小程序解决方案</span>
        </p>
      </div>
      <div class="loginCont">
        <!--tab登录框-->
        <el-tabs v-model="activeName" class="loginForm" :class="showForm" v-if="loginFormVisible">
          <!--验证码登录tab-->
          <el-tab-pane label="验证码登录" name="first">
            <el-form :model="codeLoginForm" ref="codeLoginForm" :rules="rules" >
              <el-form-item prop="mobile_phone"><!--prop里面的值对应model的，没有prop不会进行表单验证-->
                <!--<icon class="icon-front" name="phone" scale="2"></icon>-->
                <img  class="icon-front" src="../img/login/icon_phone.png"/>
                <el-input v-model="codeLoginForm.mobile_phone" placeholder="手机号" clearable autofocus></el-input>
              </el-form-item>
              <el-form-item prop="ticket_code">
                <!--<icon class="icon-front" name="id-code" scale="2"></icon>-->
                <img  class="icon-front" src="../img/login/icon_validation.png"/>
                <el-input v-model="codeLoginForm.ticket_code" placeholder="验证码" @keyup.enter.native="onSubmitCode"></el-input>
                <el-button round class="getCode" @click="getCode(3,codeLoginForm,'codeLoginForm')" :disabled="codeLoginFormCodeBtnIsDisabled">{{codeLoginFormCodeText}}</el-button>
              </el-form-item>
              <el-button class="button-style" type="primary" @click="onSubmitCode">登录</el-button>
            </el-form>
            <p style="text-align: center" class="tag">未注册，验证后将自动创建一米帐号</p>
          </el-tab-pane>
          <!--密码登录tab-->
          <el-tab-pane label="密码登录" name="second">
            <el-form :model="loginForm" ref="loginForm" :rules="rules" >
              <el-form-item>
                <!--<icon class="icon-front" name="phone" scale="2"></icon>-->
                <img  class="icon-front" src="../img/login/icon_phone.png"/>
                <el-input v-model="loginForm.mobile_phone" placeholder="手机号" clearable></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <!--<icon class="icon-front" name="password" scale="2"></icon>-->
                <img  class="icon-front" src="../img/login/icon_password.png"/>
                <el-input v-model="loginForm.password" :type="loginFormPasswordShow?'text':'password'" placeholder="密码" @keyup.enter.native="onSubmit" clearable></el-input>
                <span class="icon-end" @click="loginFormPasswordShow=!loginFormPasswordShow">
                  <icon :name="loginFormPasswordShow?'password-open':'password-close'" scale="2"></icon>
                </span>
              </el-form-item>
              <div style="text-align: right;margin-top: -40px">
                <el-button type="text" @click="forgetPwdFormVisible=true;loginFormHide()">忘记密码？</el-button>
              </div>
              <el-button class="button-style" type="primary" @click="onSubmit">登录</el-button>
            </el-form>

          </el-tab-pane>
        </el-tabs>
        <!--新账号注册框-->
        <div class="loginForm" v-if="consummateVisible">
          <el-form :model="consummate" ref="consummate" :rules="rules" label-width="80px">
            <el-form-item label="设置头像">
              <el-upload
                action="http://yimidemo.artqiyi.com/index/index/upload_img"
                :data="uploadPhoto"
                class="avatar-uploader"
                :show-file-list="false"
                name="headpic[]"
                :before-upload="handlePictureCardbefore"
                :on-success="handleAvatarSuccess">
                <img v-if="consummate.head_pic" :src="consummate.head_pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="店名" prop="nickname">
              <el-input style="width:100%" placeholder="必填"   v-model="consummate.nickname"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button class="button-style" type="primary" @click="submitConsummate" style="margin-top: 0px;">确 定</el-button>
          </div>
        </div>
        <!--忘记密码-手机号验证-->
        <div class="loginForm" v-if="forgetPwdFormVisible">
          <div class="titleMune">手机号验证</div>
          <el-form :model="forgetPwdForm" ref="forgetPwdForm" :rules="rules"
                   style="margin: 50px 0 0 0px;height: 220px" >
            <el-form-item prop="mobile_phone">
              <!--<icon class="icon-front" name="phone" scale="2"></icon>-->
              <img  class="icon-front" src="../img/login/icon_phone.png"/>
              <el-input v-model="forgetPwdForm.mobile_phone" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="ticket_code">
              <!--<icon class="icon-front" name="id-code" scale="2"></icon>-->
              <img  class="icon-front" src="../img/login/icon_validation.png"/>
              <el-input v-model="forgetPwdForm.ticket_code" placeholder="验证码"></el-input>
              <el-button round class="getCode" @click="getCode(2,forgetPwdForm,'forgetPwdForm')" :disabled="forgetPwdFormIsDisabled">{{forgetPwdFormCodeText}}</el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="footer">
            <el-button @click="forgetPwdFormVisible=false;loginFormShow()">取 消</el-button>
            <el-button type="primary" @click="verifyMobilePhone">确 定</el-button>
          </div>
        </div>
        <!--忘记密码——设置新密码-->
        <div class="loginForm" v-if="setNewPwdFormVisible">
        <div class="titleMune">设置新密码</div>
          <el-form :model="setNewPwdForm" ref="setNewPwdForm" :rules="rules"
                   style="margin: 50px 0 0 -25px;height: 220px" >
            <el-form-item prop="password">
              <!--<icon class="icon-front" name="password" scale="2"></icon>-->
              <img  class="icon-front" src="../img/login/icon_password.png"/>
              <el-input v-model="setNewPwdForm.password" :type="setNewPwdFormPasswordShow?'text':'password'" placeholder="新密码" clearable></el-input>
              <span class="icon-end" @click="setNewPwdFormPasswordShow=!setNewPwdFormPasswordShow"><icon :name="setNewPwdFormPasswordShow?'password-open':'password-close'" scale="2"></icon></span>
            </el-form-item>
            <el-form-item prop="repassword">
              <!--<icon class="icon-front" name="password" scale="2"></icon>-->
              <img  class="icon-front" src="../img/login/icon_password.png"/>
              <el-input v-model="setNewPwdForm.repassword" :type="setNewPwdFormRepasswordShow?'text':'password'" placeholder="确定新密码" clearable></el-input>
              <span class="icon-end" @click="setNewPwdFormRepasswordShow=!setNewPwdFormRepasswordShow"><icon :name="setNewPwdFormRepasswordShow?'password-open':'password-close'" scale="2"></icon></span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="footer">
            <el-button @click="setNewPwdFormVisible=false;loginFormShow()">取 消</el-button>
            <el-button type="primary" @click="setNewPasswordUpload">确 定</el-button>
          </div>
        </div>
      </div>
      <cutPictur @comfirm="pictureCardSuccess" ref="cutPicture"></cutPictur>
    </div>

  </div>
</template>

<script>
  import md5 from 'js-md5';
  import cutPictur from '../components/cutPicture.vue';
  import {isvalidPhone, isvalidCode, isvalidNickname} from '../js/validate.js';

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
      const validateCode = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入验证码'))
        } else if (!isvalidCode(value)) {
          callback(new Error('请输入正确的验证码'))
        } else {
          callback()
        }
      };
      const validateNickname = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入昵称'))
        } else if (value.length>10) {
          callback(new Error('昵称不能超过10个字'))
        } else {
          callback()
        }
      };
      const validateRepassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'))
        } else if (value != this.setNewPwdForm.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      };
      return {
        activeName: 'first',
        userinfo:'',
        version:'',
        rules: {//输入验证
          mobile_phone: [{validator: validatePhone, trigger: 'blur'}],
          password: [{validator: validatePassword, trigger: 'blur'}],
          ticket_code: [{validator: validateCode, trigger: 'blur'}],
          nickname: [{required: true, message: '请输入昵称', trigger: 'blur'},{validator: validateNickname, trigger: 'blur'}],
          repassword: [{validator: validateRepassword, trigger: 'blur'}]
        },
        showForm: 'card-hidden',//初始输入框的显示，作用：页面加载的时候有个渐变动画，若改用v-if或v-show功能失效
        codeLoginForm: {//验证码登录表单数据
          mobile_phone: '',
          ticket_code: ''
        },
        codeLoginFormCodeText: '获取验证码',//验证码登录表单的获取验证码文本
        codeLoginFormCodeBtnIsDisabled: false,//获取验证码的按钮能否被点击
        loginByCodePhoneNum: '',//通过验证码登录但未注册的用户，临时存储电话号码
        loginForm: {//密码登录表单数据
          mobile_phone: '',
          password: ''
        },
        loginFormPasswordShow: false,//密码登录表单密码显示隐藏
        forgetPwdFormVisible: false,//忘记密码按钮被点击，手机短信验证页面显示
        loginFormVisible:true,//登录框内容显示隐藏
        forgetPwdForm: {//忘记密码，手机短信验证页面的表单数据
          mobile_phone: '',
          ticket_code: ''
        },
        forgetPwdFormCodeText: '获取验证码',//忘记密码表单的获取验证码文本
        forgetPwdFormIsDisabled: false,//获取验证码的按钮能否被点击
        setNewPwdFormVisible: false,//忘记密码，设置新密码页面显示
        setNewPwdForm: {//忘记密码，设置新密码的表单数据
          password: '',
          repassword: ''
        },
        setNewPwdFormPasswordShow: false,//设置新密码表单的密码显示隐藏
        setNewPwdFormRepasswordShow: false,//设置新密码表单的确认密码显示隐藏
        consummateVisible: false,//通过验证码登录，但并未注册过的新用户，显示注册页面
        consummate: {//注册页面表单数据
          head_pic: '',
          nickname: ''
        },
        uploadPhoto: {//上传头像图片给后台的附加信息
          path_code: 16
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.showForm = ''
      }, 300);
      // 初始化输入框的数据
      if (localStorage.getItem('phoneByCode') != null) {
        this.codeLoginForm.mobile_phone = localStorage.getItem('phoneByCode');
      }
      if (localStorage.getItem('phoneByPwd') != null) {
        this.loginForm.mobile_phone = localStorage.getItem('phoneByPwd');
      }
      if (localStorage.getItem('password') != null) {
        this.loginForm.password = localStorage.getItem('password');
      }
    },
    methods: {
      //登录框的显示
      loginFormShow(){
        this.loginFormVisible=true;
      },
      //登录框的隐藏
      loginFormHide(){
        this.loginFormVisible=false;
      },
      // 通过验证码登录
      onSubmitCode() {
        this.$refs['codeLoginForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.codeLogin,
              data: {
                act: 11,
                role: 1,
                mobile_phone: this.codeLoginForm.mobile_phone,
                ticket_code: this.codeLoginForm.ticket_code
              },
              method: 'post'
            }).then(res => {
              debugger;
              if (res.data.state.code == 10200) {
                localStorage.setItem('phoneByCode', this.codeLoginForm.mobile_phone);
                this.loginByCodePhoneNum = this.codeLoginForm.mobile_phone;

                if (res.data.data.name == '') {
                  this.consummateVisible = true;//通过验证码登录，还没注册过账号的时候执行，显示模态框
                  this.loginFormHide();
                } else {
                  localStorage.setItem('loginUid', res.data.data.uid);
                  localStorage.setItem('shopurl', res.data.data.shop_url.url);

                  sessionStorage.setItem('userAccount', this.codeLoginForm.mobile_phone);
                  sessionStorage.setItem('hassubshop', res.data.data.has_sub_shop);
                  Promise
                    .all([this.getUserInfo(), this.getStatisticsData(),this.getUserPermission()])
                    .then((results) => {
                      if(res.data.data.has_sub_shop){
                        this.$router.push({path: '/platform'});
                      }else{
                        if(this.version.indexOf('官网')>=0)
                          this.$router.push({path: '/shortVideo'}); //登录成功之后重定向到首页
                        else
                          this.$router.push({path: '/info'}); //登录成功之后重定向到首页
                      }
                    });
                }
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },
      // 通过密码登录
      onSubmit() {
        this.$refs['loginForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.login,
              data: {
                act: 11,
                mobile_phone: this.loginForm.mobile_phone,
                password: md5(this.loginForm.password)
              },
              method: 'post'
            }).then(res => {
              if (res.data.state.code == 10200) {
                localStorage.setItem('loginUid', res.data.data.uid);
                localStorage.setItem('phoneByPwd', this.loginForm.mobile_phone);
                localStorage.setItem('password', this.loginForm.password);
                localStorage.setItem('shopurl', res.data.data.shop_url.url);

                sessionStorage.setItem('userAccount', this.loginForm.mobile_phone);
                sessionStorage.setItem('hassubshop', res.data.data.has_sub_shop);
                Promise
                  .all([this.getUserInfo(), this.getStatisticsData(),this.getUserPermission()])
                  .then((results) => {

                    if(res.data.data.has_sub_shop){
                      this.$router.push({path: '/platform'});
                    }else{
                      if(this.version.indexOf('官网')>=0)
                        this.$router.push({path: '/shortVideo'}); //登录成功之后重定向到首页
                      else
                        this.$router.push({path: '/info'}); //登录成功之后重定向到首页
                    }

                  });
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },
      //获取平台数据
      getSubShop(){
        return new Promise((resolve, reject) => {
          if(sessionStorage.getItem('hassubshop')==null||sessionStorage.getItem('hassubshop')==undefined||sessionStorage.getItem('hassubshop')==''||sessionStorage.getItem('hassubshop')=='false'){
            resolve();
          }else{
            this.api.request({
              url:this.api.getSubShop,
              params:{
                buid:localStorage.getItem('loginUid')
              }
            }).then((res)=>{
              if(res.data.state.code==10200){
                sessionStorage.setItem('subshops', JSON.stringify(res.data.data.sub_shops));
                //this.tableData=res.data.data.sub_shops
                resolve();
              }else{
                this.$message.error(res.data.state.msg);
              }
            }).catch(err=>{
              this.$message.error(err);
            });
          }
        });

      },
      //获取用户信息userinfo
      getUserInfo() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.userinfo + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data.data));
              sessionStorage.setItem('curuid', res.data.data.uid);

              sessionStorage.setItem('userAccount',res.data.data.mobile_phone);
              this.userinfo=res.data.data;
              this.getSubShop();
              resolve();
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg)
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      //获取商户概况statisticsData
      getStatisticsData() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.statistics_data + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('statisticsData', JSON.stringify(res.data.data));
              resolve();
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg)
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      //获取用户权限，生成对应菜单
      getUserPermission() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.get_user_permission + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('permission', JSON.stringify(res.data.data.permission));
              sessionStorage.setItem('menue', JSON.stringify(res.data.data.menu));
              sessionStorage.setItem('version', res.data.data.version);
              this.version=res.data.data.version;
              resolve();
            } else {
              this.$message.error(res.data.state.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      // 获取验证码
      getCode(act, form, formName) {
        this.$refs[formName].validateField('mobile_phone', valid => {
          if (!valid) {
            this.api.request({
              url: this.api.getcode + '?act=' + act + '&mobile_phone=' + form.mobile_phone
            }).then(res => {
              if (formName == 'codeLoginForm') {
                this.codeLoginFormCodeBtnIsDisabled = true;
                this.codeLoginFormCodeText = 30;
                this.timer = setInterval(() => {
                  this.codeLoginFormCodeText--;
                  if (this.codeLoginFormCodeText == 0) {
                    this.codeLoginFormCodeText = '获取验证码';
                    this.codeLoginFormCodeBtnIsDisabled = false;
                    clearInterval(this.timer)
                  }
                }, 1000);
              } else if (formName == 'forgetPwdForm') {
                this.forgetPwdFormIsDisabled = true;
                this.forgetPwdFormCodeText = 30;
                this.timer = setInterval(() => {
                  this.forgetPwdFormCodeText--;
                  if (this.forgetPwdFormCodeText == 0) {
                    this.forgetPwdFormCodeText = '获取验证码';
                    this.forgetPwdFormIsDisabled = false;
                    clearInterval(this.timer)
                  }
                }, 1000);
              }
              this.$message.success('验证码已发送');
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },
      // 完善资料
      submitConsummate() {
        this.$refs['consummate'].validate(valid => {
          if (valid) {
            if (this.consummate.head_pic == '') {
              var thisData = {act: 11, name: this.consummate.nickname}
            } else {
              var thisData = {act: 11, head_pic: this.consummate.head_pic, name: this.consummate.nickname}
            }
            this.api.request({
              url: this.api.complete_info,
              data: thisData,
              method: 'post'
            }).then(res => {
              if (res.data.state.code == 10200) {
                localStorage.setItem('loginUid', res.data.data.uid);
                localStorage.setItem('shopurl', res.data.data.shop_url.url);
                Promise
                  .all([this.getUserInfo(), this.getStatisticsData(),this.getUserPermission()])
                  .then((results) => {
                    if(this.version.indexOf('官网')>=0)
                      this.$router.push({path: '/shortVideo'}); //登录成功之后重定向到首页
                    else
                      this.$router.push({path: '/info'}); //登录成功之后重定向到首页
                  });
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },
      //头像上传前触发函数
      handlePictureCardbefore(file){
        /*if(file.size/1024/1024>2){
          this.$message.error('上传图片不能超过2M！');
          return false;
        }*/
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
      // element-ui上传头像成功后的回调函数
      //切图上传成功角发函数
      pictureCardSuccess(res){
        this.consummate.head_pic = 'http://yimi.artqiyi.com' + res.data;
      },
      handleAvatarSuccess(res, file) {
        this.consummate.head_pic = 'http://yimi.artqiyi.com' + res.data;
      },
      // 忘记密码按钮被点击-验证手机号
      verifyMobilePhone() {
        this.$refs['forgetPwdForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.register_ticket + '?act=11&mobile_phone=' + this.forgetPwdForm.mobile_phone + '&ticket_code=' + this.forgetPwdForm.ticket_code
            }).then(res => {
              if (res.data.state.code == 10200) {
                this.forgetPwdFormVisible = false;
                this.setNewPwdFormVisible = true;
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },
      // 设置新密码上传
      setNewPasswordUpload() {
        this.$refs['setNewPwdForm'].validate(valid => {
          if (valid) {
            this.api.request({
              url: this.api.reset_password,
              data: {
                act: 12,
                mobile_phone: this.forgetPwdForm.mobile_phone,
                password: this.setNewPwdForm.password,
                repeat_password: this.setNewPwdForm.repassword
              },
              method: 'post'
            }).then(res => {
              if (res.data.state.code == 10200) {
                this.setNewPwdFormVisible = false;
                this.loginFormShow();
              } else if (res.data.state.code == 10400) {
                this.$message.error(res.data.state.msg);
              } else {
                this.$message.error(res.data.state.msg);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        })
      },

    }
  }
</script>

<style lang="less">
  #login {
    box-sizing: border-box;
    font-size:12px;
    color:#303133;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    //background: linear-gradient(to bottom, #faa43a 0%, rgb(227, 104, 96) 100%);
    background: url('../img/login/bg.png') no-repeat center;
    background-size:cover;
    .icon-end svg{
      padding-right:20px;
    }
    .el-form-item__error{
      font-size:14px;
    }
    .loginBox{
      background: rgba(255,255,255,0.3);
      position: absolute;
      width:1200px;
      height:480px;
      top:50%;
      left:50%;
      margin-left:-600px;
      margin-top:-240px;
    }
    .loginBoxLogo,.loginCont{
      width:600px;
      height:480px;
      overflow: hidden;
      float: left;
    }
    .loginBoxLogo{
      position: relative;
      .loginBoxLogoTxt1{
        width:145px;
        height:47px;
        font-size:36px;
        font-family:MicrosoftYaHei;
        color:rgba(255,255,255,1);
        line-height:47px;
        text-shadow: 4px 2px 5px #666;
        text-align: center;
        position:absolute;
        top:167px;
        left:50%;
        margin-left:-81px;
        padding:0px;
        margin-top:0px;
      }
      .loginBoxLogoTxt2{
        height:60px;
        line-height: 60px;
        text-align: center;
        position: absolute;
        top:305px;
        left:0px;
        right:0px;
        font-size:24px;
        font-family:MicrosoftYaHei;
        color:rgba(255,255,255,1);
        line-height:31px;
        img{
          vertical-align: middle;
          margin-right:17px;
        }
      }
    }
    .loginCont{
      background: #fff;
      padding:60px 100px 89px 100px;
      position: relative;
      width:400px;
      overflow: hidden;
      height:331px;
    }
    input{
      outline: none;
    }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    }
    .tag{
      padding-top:10px;
      color:#909399;
    }
    .card-hidden {
      opacity: 0;
      transform: translate3d(0, -160px, 0);
    }
    .loginForm {
      transition: opacity, transform 800ms, 600ms linear;
    }
    .title {
      text-align: center;
      margin-bottom: 40px;
    }
    .icon-front {
      color: #606266;
      position: absolute;
      left: 10px;
      top: 10px;
      z-index: 2;
      .phone{
        width:100%;
        height:100%;
        background: url('../img/login/icon_phone.png') no-repeat top left;
      }
    }
    .icon-end {
      color: #606266;
      position: absolute;
      right: 16px;
      top: 4px;
    }
    .getCode {
      position: absolute;
      right: 26px;
      top: 5px;
    }
    .button-style {
      width: 400px;
      height:48px;
      font-size:24px;
      font-family:MicrosoftYaHei;
      color:rgba(255,255,255,1);
      line-height: 48px;
      padding:0px;
      margin-top:36px;
    }
    .footer{
      display: flex;
      justify-content: space-between;
      .el-button{
        width:45%;
      }
    }
    .titleMune{
      font-size: 24px;
      width: 198px;
      display: inline-block;
      text-align: center;
      width:100%;
    }

    .hidden {
      display: none;
    }
    .el-input__inner {
      padding-left: 40px;
      border-top:none;
      border-left:none;
      border-right:none;
      border-radius:0px;
      font-size:16px;
    }
    .el-input {
      font-size: 16px;
      height: 40px;
      line-height: 40px;
    }
    .el-form-item{
      margin-bottom: 44px;
    }
    .el-form-item__error {
      left: 5%;
    }
    .el-tabs__item {
      font-size: 24px;
      width: 198px;
      display: inline-block;
      text-align: center;
    }
    .el-tabs--top .el-tabs__item.is-top:nth-child(2){
      border-right:2px solid rgba(230,230,230,1);
    }
    .el-tabs__active-bar {
      background: none;
    }
    .el-tabs__header {
      margin: 0 0 40px;
    }
    .el-button.is-round {
      padding: 8px 18px;
      font-size: 10px;
      width:80px;
      line-height: 30px;
      border-radius:4px;
      text-align: center;
      padding: 0px;
      height:30px;
      color:rgba(151,151,151,1);
      border:1px solid #979797;
    }
    .el-alert--success {
      width: 20%;
      margin: 50px auto;
    }
    .el-dialog {
      width: 450px;
      border-radius: 16px;
      box-shadow: 0 25px 30px -13px rgba(40, 40, 40, 0.4);
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
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-dialog--center .el-dialog__body {
      /*margin-left: -25px;*/
    }
    .el-tabs__nav{
      width:100%;

    }
    .el-tabs__nav-wrap::after{
      background: none;
    }
  }

</style>
