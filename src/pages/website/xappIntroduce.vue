<template>
  <div id="xapp-introduce">
    <div class="menue">
      <div class="left">
        <img src="../../img/website/wapp-logo.png"/>
        <span><em>一米科技</em>——做最好的经营小程序解决方案</span>
      </div>
      <div class="right f-r">
        <a href="javascript:void(0)" @click="goIndex">首页</a>
        <a href="javascript:void(0)" class="active">小程序</a>
        <a href="javascript:void(0)" @click="goSystem">管理中心</a>
      </div>
    </div>
    <div class="banner">
      <div class="content">
        <div class="bannerImg"></div>
        <div class="banner-cont">
          <h2>一米小程序</h2>
          <p class="m-b20">做最好的经营小程序解决方案，一键生成，零门槛、免费</p>
          <p class="m-b80">比公众号更强大、比app更灵活</p>
          <p>
            <button class="wxapp-btn m-r50" @click="goSystem">生成我的小程序</button>
            <a href="###" class="wxapp-a hidden" style="vertical-align:bottom;">帮助教程></a>
          </p>
        </div>
      </div>
    </div>
    <div class="cont-server">
      <h3 class="mainTitle">内容服务粉丝，链接商业</h3>
      <ul class="content">
        <li class="item m-r18 text-center">
          <p class="serImg serImg1"></p>
          <p class="serTitle">短视频电商</p>
          <p class="sertP">边看边买完整交易闭环</p>
          <p  class="sertP">内容链接流量、留住粉丝</p>
          <p  class="sertP">娱乐、互动、消费一体化</p>
        </li>
        <li class="item m-r18 text-center">
          <p class="serImg serImg2"></p>
          <p  class="serTitle">新零售</p>
          <p  class="sertP">快速拓宽分销渠道</p>
          <p  class="sertP">高效管理分销系统</p>
          <p class="sertP">便捷掌控渠道分销效率</p>
        </li>
        <li   class="item text-center">
          <p class="serImg serImg3"></p>
          <p  class="serTitle">新营销</p>
          <p class="sertP">全流程数据监控</p>
          <p class="sertP">数据化驱动优化</p>
          <p class="sertP">精细化高效率运营</p>
        </li>
      </ul>
    </div>
    <div class="total-promote">
      <h3  class="mainTitle">全面提升变现能力</h3>
      <p class="secondTitle">充分利用微信生态，持续开放入口</p>
      <ul class="content">
        <li class="item">
          <img src="../../img/website/wxapp-Ticon1.png"/>
          <p>公众号</p>
        </li>
        <li  class="item">
          <img src="../../img/website/wxapp-Ticon2.png"/>
          <p>微信群</p>
        </li>
        <li  class="item">
          <img src="../../img/website/wxapp-Ticon3.png"/>
          <p>微信聊天</p>
        </li>
        <li  class="item">
          <img src="../../img/website/wxapp-Ticon4.png"/>
          <p>微信搜一搜</p>
        </li>
        <li  class="item">
          <img src="../../img/website/wxapp-Ticon5.png"/>
          <p>附近的小程序</p>
        </li>
      </ul>
    </div>
    <div class="no-code">
      <h3  class="mainTitle">零代码基础接入流程</h3>
      <p class="secondTitle">一米全程托管，无需代码基础</p>
      <ul class="content m-b80">
        <li class="item">
          <p><span class="nuber nuber1"></span><span class="text">注册微信小程序</span></p>
          <p class="fenge"></p>
        </li>
        <li class="item">
          <p><span class="nuber nuber2"></span><span class="text">将小程序一键授权给一米</span></p>
          <p class="fenge"></p>
        </li>
        <li class="item">
          <p><span class="nuber nuber3"></span><span class="text">填写并提交商户信息</span></p>
          <p class="fenge"></p>
        </li>
        <li class="item">
          <p><span class="nuber nuber4"></span><span class="text">小程序上线<i>（实时修改、更新）</i></span></p>
        </li>
      </ul>
      <p class="text-center m-b20"><button class="wxapp-btn" @click="goSystem">生成我的小程序</button></p>
      <p class="text-center hidden"><a href="###" class="wxapp-a">帮助教程></a> </p>
    </div>
    <div class="footer alignCenter">
      <p class="erma"><img src="../../img/website/wxapp-app.png"/></p>
      <p class="m-b80">一米好物</p>
      <div class="banum"><a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备17096087号</a> 深圳云米信息科技有限公司版权所有 </div>
    </div>
  </div>
</template>
<script>
    export default{
        data: function () {
            return {}
        },
        methods: {
          goIndex(){
             this.$router.push({path: '/index'});
          },
          goSystem(){
            this.$router.push({path: '/login'});
          }
        }
    }
</script>
<style lang="less" scoped>
  #xapp-introduce {
    div, span,
    h1, h2, h3, h4, h5, h6, p,
    del, dfn, em, img,i,ul, li{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .text-center {
      text-align: center;
    }
    ul, ul li {
      list-style: none;
    }
    font-size: 14px;
    min-width: 1040px;
    color: #353535;
    font-family: "Helvetica Neue","Hiragino Sans GB","Microsoft YaHei","\9ED1\4F53",Arial,sans-serif;
    .menue {
      background: #fff;
      height: 80px;
      padding: 0px 90px 0px 78px;
      line-height: 80px;
      .left, .right {
        display: inline-block;
      }
      .left{
        em {
          font-style: normal;
          font-size: 18px;
          color: #000;
        }
        img{
          vertical-align: middle;
        }
      }
      .right{
        a {
          color: #353535;
          margin-left: 60px;
          cursor: pointer;
          &.active {
            color: #ff3c5c;
          }
        }
      }
    }
    .content {
      width: 1040px;
      margin: 0px auto;
      position: relative;
    }
    .m-b20 {
      margin-bottom: 20px;
    }
    .m-b80 {
      margin-bottom: 80px;
    }
    .m-r50 {
      margin-right: 50px;
    }
    .mainTitle {
      font-size: 30px;
      color: #262626;
      font-weight: normal;
      text-align: center;
    }
    .total-promote ul, .no-code ul, .cont-server ul {
      margin-top: 50px;
    }
    .banner {
      background: #fafafa;
      height: 419px;
      .wxapp-btn {
        width: 192px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        color: #fff;
        border-radius: 5px;
        background: #ff3c5c;
        border: none;
        font-size: 16px;
      }
      .bannerImg {
        height: 419px;
        background: url(../../img/website/wapp-banner.png) no-repeat bottom left;
        display: inline-block;
        width: 412px;
      }
      .banner-cont {
        display: inline-block;
        position: absolute;
        left: 490px;
        top: 70px;
      }
      h2 {
        font-size: 40px;
        color: #000;
        letter-spacing: 2.5px;
        font-weight: normal;
        margin-bottom: 45px;
      }
      p {
        font-size: 18px;
      }
    }
    .total-promote, .no-code, .cont-server {
      padding: 70px 0px;
    }
    .f-r {
      float: right;
    }
    .total-promote {
      text-align: center;
    }
    .footer {
      background: #fafafa;
      .erma {
        padding: 40px 0px;
      }
    }
    .alignCenter {
      text-align: center;
    }
    .cont-server {
      .item {
        background: #fafafa;
        border-radius: 5px;
        width: 330px;
        height: 300px;
        display: inline-block;
        padding-top: 62px;
        box-sizing: border-box;
        .serImg {
          display: inline-block;
          width: 60px;
          height: 60px;
          margin-bottom: 22px;
        }
        .serTitle {
          color: #000;
          margin-bottom: 26px;
          font-size: 20px;
          line-height: 0px;
        }
        .sertP {
          line-height: 30px;
        }
      }
      .serImg1 {
        background: url(../../img/website/wxapp-icon1.png) no-repeat top left;
      }
      .serImg2 {
        background: url(../../img/website/wxapp-icon2.png) no-repeat top left;
      }
      .serImg3 {
        background: url(../../img/website/wxapp-icon3.png) no-repeat top left;
      }

    }
    .secondTitle {
      font-size: 16px;
      color: #353535;
      line-height: 26px;
      margin-top: 30px;
      text-align: center;
    }
    .total-promote {
      .item {
        width: 100px;
        display: inline-block;
        font-size: 16px;
        color: #353535;
        line-height: 26px;
        margin: 0 45px;
      }
    }
    .no-code {
      .item {
        position: relative;
        padding-left: 400px;
        .text {
          display: inline-block;
          vertical-align: top;
          line-height: 44px;
          i {
            font-style: normal;
            color: #999;
          }
        }
        .nuber {
          display: inline-block;
          width: 44px;
          height: 44px;
          margin-right: 24px;
        }
        .fenge {
          background: url(../../img/website/wxapp-ficon5.png) no-repeat 18px 3px;
          height: 36px;
        }
        .nuber1 {
          background: url(../../img/website/wxapp-ficon1.png) no-repeat 0px 0px;
        }
        .nuber2 {
          background: url(../../img/website/wxapp-ficon2.png) no-repeat 0px 0px;
        }
        .nuber3 {
          background: url(../../img/website/wxapp-ficon3.png) no-repeat 0px 0px;
        }
        .nuber4 {
          background: url(../../img/website/wxapp-ficon4.png) no-repeat 0px 0px;
        }
      }
    }
    .hidden{
      display: none;
    }
    a{
      text-decoration: none;
    }
    .wxapp-btn {
      width: 192px;
      height: 48px;
      text-align: center;
      line-height: 48px;
      color: #fff;
      border-radius: 5px;
      background: #ff3c5c;
      border: none;
      font-size: 16px;
    }
  }
</style>
