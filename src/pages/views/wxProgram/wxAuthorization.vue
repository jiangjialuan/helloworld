<template>
  <div id="wxAuthorization">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
      <el-form-item label="小程序名称：" prop="app_name" :rules="[{ required: true, message: '请输入小程序名称', trigger: 'blur'}]">
        <el-col class="line" :span="12">
        <el-input v-model="ruleForm.app_name"  ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="小程序APPsecret：" prop="app_secret" class="line">
        <el-col class="line" :span="12" >
        <el-input v-model="ruleForm.app_secret" ></el-input>
        </el-col>
        <el-col class="line" :span="2">
        <el-tooltip class="item" effect="dark" content="微信小程序后台，首页-开发设置进行配置" placement="bottom-end">
          <el-button icon="el-icon-question" circle>帮助</el-button>
        </el-tooltip>
        </el-col>
      </el-form-item>
      <el-form-item label="扫码授权：" prop="name">
        <a :href="getAccreditUrl" target="_blank" v-if="!authorization">立即扫码</a>
        <el-button type="success" disabled v-else>已授权</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <!--<el-button type="primary" @click="modifyForm" v-else>修改</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
    export default{
        data: function () {
            const validateSecret = (rule, value, callback) => {
              if (value == '') {
                callback(new Error('请输入小程序APPsecret'))
              } else if (value.length!=32) {
                callback(new Error('小程序APPsecret必须为32个字'))
              } else {
                callback()
              }
            };
            return {
              ruleForm:{
                app_name:'',
                app_secret:''
              },
              getAccreditUrl:'',
              authorization:false,
              setTimeOutFlag:'',
              isModify:'',
              rules:{
                app_secret:[{ required: true, message: '请输入小程序APPsecret', trigger: 'blur'},{validator: validateSecret, trigger: 'blur'}],
              }
            }
        },
        created:function(){
          this.getAccreditUrlFun();
          if(!this.authorization){
            this.isAuthorization();
          }
        },
        methods: {
          //获取立即扫码的url
          getAccreditUrlFun(){
              var uid=JSON.parse(sessionStorage.getItem('userinfo')).uid;
            var redirectUrl=window.location.protocol + "//" + window.location.host+'/authorization?uid='+uid;
            this.api.request({
              url:this.api.getAccreditUrl,
              params:{
                redirect:redirectUrl,
              },
            }).then((res)=>{
                if(res.data.state.code==10200){
                  this.getAccreditUrl=res.data.data.url;
                }
            });
          },
          //保存
          submitForm(){
            this.$refs['ruleForm'].validate((valid)=>{
                if(valid){
                    if(this.authorization){
                      this.api.request({
                        url:this.api.save_applet_info,
                        method:'post',
                        data:{
                          act:11,
                          app_name:this.ruleForm.app_name,
                          app_secret:this.ruleForm.app_secret
                        }
                      }).then((res)=>{
                        if(res.data.state.code==10200){
                          this.$message({
                            message:'保存成功！',
                            type:'success'
                          });
                        }
                      });
                    }else{
                      this.$message.error('请先进行扫码授权！');
                    }
                }
            });
          },
          //轮询是否已经授权
          isAuthorization(){
            var redirectUrl='';
            this.api.request({
              url:this.api.check_is_authorization,
              params:{
                act:11,
              },
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.authorization=res.data.data.is_authorization;
                if(this.ruleForm.app_name=='') {
                  this.ruleForm.app_name=res.data.data.app_name;
                  if(this.ruleForm.app_name!=''&&this.authorization) this.isModify=true;
                }
                if(this.authorization==1){
                  clearTimeout(this.setTimeOutFlag);
                }else{
                  this.setTimeOutFlag=setTimeout(this.isAuthorization,1500);
                }
              }
            });
          }
        }
    }
</script>
<style>
  #wxAuthorization{

  }
</style>
