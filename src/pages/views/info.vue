<template>
  <div id="info">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card shadow="never">
          <div slot="header" class="title">最新数据</div>
          <el-row :gutter="24" class="gutter">
            <el-col :span="8">
              <p class="active">{{pre_produce}}</p>
              <p>待处理订单</p>
            </el-col>
            <el-col :span="8">
              <p class="active">{{today_order_num}}</p>
              <p>今日订单</p>
            </el-col>
            <el-col :span="8">
              <p class="active">{{today_order_amount}}</p>
              <p>今日交易额</p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <div slot="header" class="title">近期上新</div>
          <el-row :gutter="24" class="gutter">
            <el-col :span="12">
              <p class="active">{{goods_count_30}}</p>
              <p>30天商品上新数</p>
            </el-col>
            <el-col :span="12">
              <p class="active">{{short_video_30}}</p>
              <p>30天视频上新数</p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12" style="margin-bottom: 24px;">
        <el-card shadow="never">
          <div slot="header" class="title">常用功能</div>
          <el-row :gutter="24" class="btns">
            <el-col :span="8"><span class="shadowblock shadow1"></span><el-button class="btn1" @click="goAppDecoration"><i></i>小程序装修</el-button></el-col>
            <el-col :span="8" v-if="!(version.indexOf('社保')>=0)"><span class="shadowblock shadow2"></span><el-button class="btn2" @click="gopushlishCollage"><i></i>发布拼团</el-button></el-col>
            <el-col :span="8" v-if="userinfo.edit_flag"><span class="shadowblock shadow3"></span><el-button class="btn3" @click="gopushlishVideo"><i></i>发布视频</el-button></el-col>
            <el-col :span="8" v-if="!(version.indexOf('社保')>=0)&&userinfo.edit_flag"><span class="shadowblock shadow4"></span><el-button class="btn4" @click="gobuildgoodsTopic"><i></i>新建商品专题</el-button></el-col>
            <el-col :span="8"><span class="shadowblock shadow1"></span><el-button class="btn1" @click="gobusinessCard"><i></i>企业名片</el-button></el-col>
            <el-col :span="8" v-if="!(version.indexOf('社保')>=0)"><span class="shadowblock shadow2"></span><el-button class="btn2" @click="gosetshop"><i></i>店铺设置</el-button></el-col>
          </el-row>
        </el-card>
      </el-col>
      <!--v-if="permission.indexOf(4) <= -1"-->
      <el-col :span="12" v-if="permission.indexOf(4) >=0">
        <el-card shadow="never">
          <div slot="header" class="title">我的小程序码</div>
          <el-row class="alignCenter" style="width:100%;display: flex; justify-content: center;">
            <el-col class="imgbox">
              <img :src="qcode_url"/>
            </el-col>
            <!--<el-col  class="btnbox">
              <el-button type="primary" class="downloadBtn" @click="downImg(qcode_url)">下载图片</el-button>
            </el-col>-->
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="permission.indexOf(4) >=0? 24 : 12" style="margin-left: 0px; margin-right: 0px;">
        <el-card :style="permission.indexOf(4) >=0?'':'height:215px;padding-top: 10px;'">
          <div class="footerSubmit">
            <p class="title" style="margin-bottom: 15px;">一米手机客户端</p>
            <!--<p style="color:#999; margin-bottom: 24px;font-size:16px;">点击下载客户端，用手机随时地管理店铺</p>
            <p>
              <el-button class="down_btns" @click="enlarge()">&nbsp;iphone</el-button>
              <el-button class="down_btns" @click="enlarge()">&nbsp;Android</el-button>
            </p>-->
            <p><img width="100" height="100" src="data:image/png;base64,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" /></p>
            <p style="color:#999; font-size:12px;">扫描下载APP，随时随地管理店铺</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="设置密码"
               :visible.sync="dialogVisible"
               :close-on-click-modal=false
               :show-close=false
               :close-on-press-escape=false
               :modal-append-to-body=false
               center
               class="setPasswordDialog">
      <el-form :model="setPasswordForm" ref="setPasswordForm" :rules="rules">
        <el-form-item prop="password">
          <icon class="icon-front" name="password" scale="2"></icon>
          <el-input v-model="setPasswordForm.password" :type="setPasswordFormPasswordShow?'text':'password'" placeholder="密码" autofocus></el-input>
          <span class="icon-end" @click="setPasswordFormPasswordShow=!setPasswordFormPasswordShow"><icon :name="setPasswordFormPasswordShow?'password-open':'password-close'" scale="2"></icon></span>
        </el-form-item>
        <el-form-item prop="repassword">
          <icon class="icon-front" name="password" scale="2"></icon>
          <el-input v-model="setPasswordForm.repassword" :type="setPasswordFormRepasswordShow?'text':'password'" placeholder="确认密码"></el-input>
          <span class="icon-end" @click="setPasswordFormRepasswordShow=!setPasswordFormRepasswordShow">
            <icon :name="setPasswordFormRepasswordShow?'password-open':'password-close'" scale="2"></icon></span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible=false">下次再设置</el-button>
        <el-button type="primary" @click="setPasswordSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <div class="viewbig" @click="hideview" v-show="imgshow" :style="'line-height:'+screeHeight+'px'">
      <img src="../../img/QRcode.png"/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码不得小于6位'))
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
      return {
        pre_produce: '',
        goods_count_30:'',
        screeHeight:window.innerHeight,
        //qcode_url:'http://yimiimg.artqiyi.com/data/attachment/anchor_head_pic/2018-07-04/a4/mu/7CEDBB39-9E52-63CE-1FED-D0598E440AAC.png',
        qcode_url:'',
        short_video_30:'',
        today_order_amount:'',
        today_order_num:'',
        version:'',
        oldtime:'',
        imgshow:false,
        rules: {//输入验证
          password: [{validator: validatePassword, trigger: 'blur'}],
          repassword: [{validator: validateRepassword, trigger: 'blur'}]
        },
        dialogVisible: false,
        setPasswordForm: {
          password: '',
          repassword: ''
        },
        setPasswordFormPasswordShow: false,//设置密码表单密码显示隐藏
        setPasswordFormRepasswordShow: false,//设置密码表单确认密码显示隐藏
        platformId:this.$route.query.id,
        userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
        permission: JSON.parse(sessionStorage.getItem('permission')),
      }
    },
    created() {
      this.getStatisticsData().then((statisticsData)=>{
        this.pre_produce = statisticsData.pre_produce;
        this.goods_count_30= statisticsData.goods_count_30;
        this.qcode_url= statisticsData.qcode_url;
        this.short_video_30= statisticsData.short_video_30;
        this.today_order_amount= statisticsData.today_order_amount;
        this.today_order_num= statisticsData.today_order_num;
      });
      this.version=sessionStorage.getItem('version');
      var userInfo=JSON.parse(sessionStorage.getItem('userinfo'));
      if(userInfo.has_password == 0){
        if(sessionStorage.getItem('hasDialog')==null||sessionStorage.getItem('hasDialog')=='0'){
          sessionStorage.setItem('hasDialog',1);
          this.dialogVisible=true;
        }
      };
      bus.$on('statisticsData', (statisticsData) => {
        this.pre_produce = statisticsData.pre_produce;
        this.goods_count_30= statisticsData.goods_count_30;
        this.qcode_url= statisticsData.qcode_url;
        this.short_video_30= statisticsData.short_video_30;
        this.today_order_amount= statisticsData.today_order_amount;
        this.today_order_num= statisticsData.today_order_num;
        this.version=sessionStorage.getItem('version');
      });
      bus.$on('userInfo',(userInfo)=>{
        this.userinfo=userInfo;
        if(userInfo.has_password == 0){
          if(sessionStorage.getItem('hasDialog')==null||sessionStorage.getItem('hasDialog')=='0'){
            this.dialogVisible=true;
          }
        };
      })
    },
    methods: {
      //查看原图
      enlarge(){
        this.imgshow=true;
      },
      //关闭原图
      hideview(){
        this.imgshow=false;
      },
      //下载图片
      downImg(src){
        this.funDownload(src,'wxapp.png');
      },
      funDownload(src, filename) {
        this.api.request({
          url:this.api.get_wx_qrcode,
          responseType:'arraybuffer',
          params:{act:11}
        }).then((res)=>{
          let blob=new Blob([res.data],{type:'image/png'});
          let objectUrl=URL.createObjectURL(blob);
          var fileName='我的小程序'+Date.parse(new Date())+'.png';
          if(navigator.userAgent.indexOf("Firefox")>0){
            window.location.href=objectUrl;
          }else{
            if ('download' in document.createElement('a')) {
              debugger;
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              window.URL.revokeObjectURL(link.href);
            }else { // IE10+下载
              debugger;
              navigator.msSaveBlob(blob, fileName)
            }
         }
        });
      },

      //获取商户概况statisticsData
      getStatisticsData() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.statistics_data + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('statisticsData', JSON.stringify(res.data.data));
              resolve(res.data.data);
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg)
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      //快捷导航
      goAppDecoration(){
        this.$router.push({path:'/wxProgram/wxProgramDecoration'});
      },
      gopushlishCollage(){
        this.$router.push({path:'/promotion/collageList'});
      },
      gopushlishVideo(){
        this.$router.push({path:'/shortVideo/shortVideoEdit/'});
      },
      gobuildgoodsTopic(){
        this.$router.push({path:'/promotion/goodsTopicAdd'});
      },
      gobusinessCard(){
        this.$router.push({path:'/wxProgram/businessCard'});
      },
      gosetshop(){
        this.$router.push({path:'/mall/setshop'});
      },
      //没有设置密码的让他设置密码
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
                this.dialogVisible = false;
                this.$message.success(res.data.state.msg);
              } else if (res.data.state.code == 10400) {
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
  #info {
    padding:30px;
    .down_btns{
      padding:0px 20px;
      height:40px;
      background: #2C3542;
      color:#fff;
      border:1px solid transparent;
      span{
        height:24px;
        line-height: 24px;
        padding-left:24px;
        display: inline-block;
        vertical-align: middle;

      }
      &:first-child{
        span{
          background: url('../../img/iPhone.png') no-repeat;

        }
      }
      &:last-child{
        span{
          background: url('../../img/Android.png') no-repeat;
        }
      }
    }
    .down_btns:hover,.down_btns:focus{
      background: none;
      color:#2C3542;
      border:1px solid #2C3542;
      &:first-child{
        span{
          background: url('../../img/iPhone_active.png') no-repeat;
        }
      }
      &:last-child{
        span{
          background: url('../../img/Android_active.png') no-repeat;

        }
      }
    }
    .footerSubmit {
      color:#333;
      line-height: 25px;
      text-align: center;
      z-index: 10000;
      margin:0px;
      padding:4px;
    }
    .viewbig{
      position: absolute;
      z-index: 10000;
      background-color: rgba(0,0,0,.6);
      margin: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      -webkit-transition: opacity .3s;
      transition: opacity .3s;
      text-align: center;
      margin: 0px !important;
      line-height: 100%;
      img{
        max-width:100%;
        max-height:100%;
        vertical-align: middle;
      }
    }
    .v-modal{
      margin:0px !important;
    }
    .btns{
      width:100%;
      height:120px;
      text-align: left;
      padding-left:10%;
      margin: 0px !important;
      .el-col{
        margin-bottom:20px;
        display: inline-block;
        width:31%;
        padding:0px !important;
        height:48px;
        position:relative;
        .shadowblock{
          width:61%;
          height:24px;
          display: inline-block;
          position:absolute;
          left:16px;
          bottom:1px;
        }
        .shadow1{
          background: #89C3F8;
          box-shadow: 0px 2px 16px 0px #89C3F8 ;
        }

        .btn1{
          background: #89C3F8;
        }
        .btn2{
          background: #FFA897;
        }
        .shadow2{
          background: #FFA897;
          box-shadow: 0px 2px 16px 0px #FFA897 ;
        }
        .btn3{
          background: #BC8DEE;
        }
        .shadow3{
          background: #BC8DEE;
          box-shadow: 0px 2px 16px 0px #BC8DEE ;
        }
        .btn4{
          background: #F88989;
        }
        .shadow4{
          background: #F88989;
          box-shadow: 0px 2px 16px 0px #F88989 ;
        }
        .el-button{
          width:77.4%;
          height:48px;
          color:#fff;
          font-size:1rem;
          position: relative;
          border:none;
          padding:12px 0.1%;
          min-width: 100px;
          i{
            position:absolute;
            top:0px;
            left:0px;
            right:0px;
            height:24px;
            display: inline-block;
            background: rgba(255,255,255,0.1);
          }
        }
      }
    }
    .imgbox{
      display: inline-block;
      width:120px;
      height:120px;
      line-height: 120px;
      img{
        width:120px;
        height:120px;
      }
    }
    .btnbox{
      display: inline-block;
      width:22%;
      height:120px;
      line-height: 120px;
      .downloadBtn{
      background: #89C3F8;
      display: inline-block;
      width:100%;
      font-size:1rem;
      padding:12px 0.1%;
        height:3rem;
    }

    }
    .title{
      height:28px;
      color:#333333;
      font-size:20px;
      text-align:center;
      line-height: 28px;
    }
    .gutter{
      .el-col{
        border-right:1px solid #E6E6E6;
        .active{
          color:#f60;
          line-height: 40px;
          font-weight:bold;
          font-size:18px;
        }
        &:last-child{
          border-right:none;
        }
      }
    }
    .el-card__body{
      text-align: center;
    }
    font-size:12px;

    .setPasswordDialog {
      .el-dialog { //1
        width: 400px;
        border-radius: 16px;
      }
      .el-form-item__content { //2
        display: flex;
      }
      .icon-front { //3密码锁图标
        color: #606266;
        position: relative;
        left: 26px;
        top: 10px;
        z-index: 2;
      }
      .icon-end { //3显示密码眼睛图标
        color: #606266;
        position: relative;
        right: 25px;
        top: 4px;
      }
      .el-input__inner { //4input输入框
        padding: 0 34px;
      }
      .el-form-item__error { //3(验证错误提示信息)
        margin-left: 15px;
      }
    }
    .el-col {
      border-radius: 4px;
    }

    .grid-content {
      border-radius: 4px;
      min-height: 36px;
      height: 100px;
    }

    .bg-purple {
      background: white;
    }
  }
</style>
