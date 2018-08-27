<template>
  <div id="authorization">
    <div class="head">
      <img src="../../../img/wxProgramDecoration/wechat.png" width="35"/>
      <span>微信小程序&nbsp;&nbsp;|&nbsp;&nbsp;授权</span>
    </div>
    <div class="main-body">
      <div class="main-box text-center">
        <p class="no" v-if="!authorization">
          <img src="../../../img/wxProgramDecoration/waiting.png" width="94"  />
          <span>正在授权，请不要关闭此页面……</span>
        </p>
        <p class="yes" v-else>
          <img src="../../../img/wxProgramDecoration/complete.png" width="94"  />
          <span class="success">恭喜，授权成功！</span>
          <span  class="desc">一米将为您提供最好的小程序变现服务。</span>
          <!--<span><a href="/system/login.html" target="_blank" class="btn btn-success">去管理中心</a> </span>-->
        </p>

      </div>
    </div>
  </div>
</template>
<script>
    export default{
        data: function () {
            return {
                authorization:false
            }
        },
        created(){
            this.accredit();
        },
        methods: {
          //授权
          accredit(){
            var urlParseArr=this.urlParse();
            if(urlParseArr.auth_code!=undefined&&urlParseArr.expires_in!=undefined){
              this.api.request({
                url:this.api.accredit,
                params:{
                  auth_code:urlParseArr.auth_code,
                  expires_in:urlParseArr.expires_in,
                  uid:urlParseArr.uid
                }
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.authorization=true;
                }
              });
            }
          },
          //获取url后面的参数
          urlParse(){
            var url = window.location.search;
            var obj = {};
            var reg = /[?&][^?&]+=[^?&]+/g;
            var arr = url.match(reg);
            if (arr) {
              arr.forEach(function (item) {
                var tempArr = item.substring(1).split('=');
                var key = decodeURIComponent(tempArr[0]);
                var val = decodeURIComponent(tempArr[1]);
                obj[key] = val;
              });
            }
            return obj;
          },
        }
    }
</script>
<style lang="less" scoped>
  #authorization{
    .head{
      border-top:4px solid #2f9833;
      background: #fff;
      border-bottom: 1px solid #cbcbcb;
      margin-bottom: 36px;
      padding-left:78px;
      height:64px;
      line-height: 64px;
      font-size:16px;
    }
    .main-body{
      padding:0px 78px;
    }
    .main-box{
      border: 1px solid #cbcbcb;
      background: #fff;
      border-radius: 5px;
      height:518px;
      color:#262626;
      font-size:20px;
    }
    .main-box p{
      text-align: center;
    }
    .main-box p span{
      display: block;
    }
    .main-box p.no img{
      display: block;
      margin: 105px auto 88px;
    }
    .main-box p.yes{
      font-size:20px;
    }
    .main-box p.yes img{
      display: block;
      margin: 85px auto 48px;
    }
    .main-box p.yes .desc{
      color:#999;
      margin: 36px auto 118px;
      font-size:16px;
    }
    .main-box p.yes .btn-success{
      background: #42c947;
      color:#fff;
      font-family: Arial;
      font-size:14px;
      display: inline-block;
      border:none;
    }
  }
</style>
