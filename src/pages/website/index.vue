<template>
  <div id="websitHome">
    <div class="wrap">
      <img src="../../img/website/bg-img.jpg" width="100%" height="672" />
      <div class="banner">
        <div class="banner-logo"><img src="../../img/website/logo.png" />一米科技<span class="small">——做最好的经营小程序解决方案</span></div>
        <div class="menue f-r">
          <a href="javascript:void(0)" class="active">首页</a>
          <a href="javascript:void(0)" @click="goIntroduce">小程序</a>
          <a href="javascript:void(0)" @click="goSystem">管理中心</a>
        </div>
        <div class="width" style="height:672px;">
          <div class="banner-content">
            <p class="banner-content-big">一米</p>
            <p class="banner-content-small">做最好的经营小程序解决方案</p>
            <p class="banner-content-small">让生意更好做</p>
            <a class="banner-content-btn" href="javascript:void(0)" @click="goSystem">免费体验</a>
          </div>
          <img class="banner-img" src="../../img/website/banner_cut.png" />
        </div>
      </div>
      <div class="info">
        <div class="item-title">
          <p class="item-main-title">一站式经营解决方案</p>
          <p class="item-second-title"><span>整合资源、深度挖掘，快速轻松变现</span></p>
        </div>
        <div class="info-list width">
          <div class="info-list-item">
            <p class="info-list-img"><img src="../../img/website/01.png" /></p>
            <p class="info-list-title">轻松变现</p>
            <p class="info-list-content">一键发布短视频+商品，粉丝无需任何安装，打开微信即点即看、边看边买</p>
          </div>
          <div class="info-list-item">
            <p class="info-list-img"><img src="../../img/website/05.png" /></p>
            <p class="info-list-title">海量商品支撑</p>
            <p class="info-list-content">拥有优质商品供应链，海量商品供您选择，没货也能赚钱</p>
          </div>
          <div class="info-list-item">
            <p class="info-list-img"><img src="../../img/website/02.png" /></p>
            <p class="info-list-title">专属小程序</p>
            <p class="info-list-content">首家微信小程序短视频+电商解决方案，提供定制化专属小程序，自主结算</p>
          </div>
          <div class="info-list-item">
            <p class="info-list-img"><img src="../../img/website/03.png" /></p>
            <p class="info-list-title">轻松对接、简单稳定</p>
            <p class="info-list-content">无需技术对接，0成本；腾讯核心产品技术团队实力保证，稳定可靠</p>
          </div>
          <div class="info-list-item">
            <p class="info-list-img"><img src="../../img/website/04.png" /></p>
            <p class="info-list-title">精细化数据运营</p>
            <p class="info-list-content">完善的数据分析体系，实时、详尽的数据展示，將精细化运营落到实处，提高效率</p>
          </div>
          <div class="info-list-item">
            <p class="info-list-img"><img src="../../img/website/06.png" /></p>
            <p class="info-list-title">还有更多……</p>
            <p class="info-list-content">内容付费 / 短视频+广告 / 营销工具</p>
          </div>
        </div>
      </div>
      <div class="conlist width">
        <div class="item-title">
          <p class="item-main-title">精选案例</p>
          <p class="item-second-title">全行业服务，为自媒体、企业提供全套解决方案</p>
        </div>
        <div class="listanli">
          <ul>
            <li v-on:mouseenter="mouseEnter('li1')" >
              <div class="piclist">
                <img src="../../img/website/an1.png" />
                <div :class="activeClass=='li1'?'picolist-rwm active':'picolist-rwm'"  ref="li1">
                  <img src="../../img/website/1.jpg" height="150" />
                  <!--<p>微信扫码观看</p>-->
                </div>
              </div>
              <div class="textlist">
                <p>《天空之城》-久石让 尤克里里指弹独奏版 白熊音乐出品</p>
                <p><span>2017-07-11 17:29:38</span></p>
              </div>
            </li>
            <li v-on:mouseenter="mouseEnter('li2')">
              <div class="piclist">
                <img src="../../img/website/an2.png" />
                <div class="picolist-rwm" :class="activeClass=='li2'?'active':''" ref="li2">
                  <img src="../../img/website/2.jpg" height="150" />
                  <!--<p>微信扫码观看</p>-->
                </div>
              </div>
              <div class="textlist">
                <p>闫莉女王 日系小清新服装搭配小课堂</p>
                <p><span>2017-07-07 13:31:27</span></p>
              </div>
            </li>
            <li v-on:mouseenter="mouseEnter('li3')">
              <div class="piclist">
                <img src="../../img/website/an3.png" />
                <div class="picolist-rwm" :class="activeClass=='li3'?'active':''" ref="li3">
                  <img src="../../img/website/3.jpg" height="150" />
                  <!--<p>微信扫码观看</p>-->
                </div>
              </div>
              <div class="textlist">
                <p>《佑.约》第一期 正确的首次约会方式 </p>
                <p><span>2017-06-21 17:13:45</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footerid">
        <div class="footer">
          <div class="footer-left hidden">
            <ul>
              <li>关于我们</li>
              <li><a href="">关于一米</a></li>
              <li><a href="">活动资讯</a></li>
              <li><a href="">媒体报道</a></li>
              <li><a href="">客户与伙伴</a></li>
              <li><a href="">友情链接</a></li>
              <li><a href="">联系我们</a></li>
              <li><a href="">行业资讯</a></li>
            </ul>
            <ul>
              <li>产品服务</li>
              <li><a href="">企业直播</a></li>
              <li><a href="">金融直播</a></li>
              <li><a href="">教育直播</a></li>
              <li><a href="">大会直播</a></li>
              <li><a href="">视频会议</a></li>
              <li><a href="">视频直播API</a></li>
              <li><a href="">视频直播SDK</a></li>
            </ul>
            <ul>
              <li>应用场景</li>
              <li><a href="">直播课堂</a></li>
              <li><a href="">企业培训</a></li>
              <li><a href="">产品发布会</a></li>
              <li><a href="">商务直播</a></li>
              <li><a href="">企业年会</a></li>
              <li><a href="">峰会论坛</a></li>
              <li><a href="">营销推广</a></li>
            </ul>
          </div>
          <!--<div class="footer-right">-->
          <div class="">
            <div class="address hidden">
              <p>
                <span>一米直播</span>
                <span>广州市新港东路琶洲新村</span>
              </p>
              <p>
                <span>400-800-8989  314258303@qq.com</span>
              </p>
            </div>
            <div class="wechat rwm">
                        <span class="">
                        <img src="../../img/website/wxapp.jpg" alt="一米微信公众号" width="130" style="margin-top:-10px;" >
                        <p>一米小程序</p>
                    </span>
              <span class="er2">
                        <img src="../../img/website/app.png" alt="一米APP" width="120" >
                        <p>一米APP</p>
                    </span>
            </div>
          </div>
        </div>
        <!--Copyright © 2016 QIYIGUO. All Rights Reserved -->
        <div class="banum"><a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备17096087号</a> 深圳云米信息科技有限公司版权所有 </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        data: function () {
            return {
              activeClass:'',
            }
        },
        methods: {
          mouseEnter(index){
              this.activeClass=index;
          },
          goSystem(){
            this.$router.push({path: '/login'});
          },
          goIntroduce(){
            this.$router.push({path: '/xappIntroduce'});
          }
        }
    }
</script>
<style lang="less" scoped>

  .wrap {
    color: #7d7d7d;
    background: #f2f2f2;
    min-width: 1200px;
    .banner {
      position: absolute;
      top: 0px;
      left: 0px;
      height: 672px;
      width: 100%;
      text-align: center;
      color: #fff;
      min-width: 1115px;
      .banner-logo .small {
        font-size: 14px;
        vertical-align: middle;
      }
    }
    .banner-logo {
      position: absolute;
      top: 40px;
      left: 78px;
      line-height: 46px;
      display: inline-block;
      font-size: 22px;
      z-index: 99;
    }
    .banner-logo img, .banner-logo span {
      margin-right: 30px;
      vertical-align: middle;
    }
    .banner-content-btn {
      width: 198px;
      border: 1px solid #fff;
      border-radius: 4px;
      height: 38px;
      display: inline-block;
      color: #fff;
      line-height: 38px;
      font-size: 18px;
      margin-top: 28px;
      cursor: pointer;
      background: url(../../img/website/none-bg.png) repeat;
    }
    a {
      text-decoration: none;
    }
    .menue {
      height: 80px;
      position: absolute;
      right: 90px;
      z-index: 99;
      a.active {
        color: #ff3c5c;
      }
      a {
        color: #fff;
        margin-left: 60px;
        cursor: pointer;
        line-height: 130px;
        font-size: 14px;
      }
    }
    .banner-content {
      margin-top: 140px;
      .banner-content-big {
        line-height: 74px;
        font-size: 45px;
        margin-bottom: 20px;
      }
      .banner-content-small {
        line-height: 32px;
        font-size: 18px;
      }
    }
    .banner-img {
      position: absolute;
      left: 50%;
      margin-left: -350px;
      bottom: 0px;
    }
    .item-main-title {
      line-height: 52px;
      font-size: 28px;
      color: #000;
    }
    .item-second-title {
      line-height: 38px;
      font-size: 20px;
      color: #555;
    }
    .f-r {
      float: right;
    }
    .width {
      width: 1115px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
    }
    .item-title {
      padding: 50px 0px;
      text-align: center;
    }
    .info-list {
      text-align: center;
      padding: 20px 0px 0px 20px;
      .info-list-item {
        width: 345px;
        height: 234px;
        overflow: hidden;
        padding: 34px 28px;
        display: inline-block;
        background: #fff;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 4px;
        float: left;
        box-sizing: border-box;
        p{
          margin:0px;
        }
        .info-list-img {
          height: 50px;
          img{
            height:46px;
          }
        }
        .info-list-title {
          height: 51px;
          color: #000;
          font-size: 22px;
        }
        .info-list-content {
          line-height: 33px;
          color: #555;
          font-size: 16px;
        }
      }
    }
    .listanli {
      padding-left: 20px;
      ul{
        margin: 0px;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding:0px;
        li {
          float: left;
          padding-right: 20px;
          cursor: pointer;
          box-sizing: border-box;
          width:365px;
        }
        list-style: none;
      }
      .piclist {
        position: relative;
        width: 345px;
        height: 195px;
        overflow: hidden;
        box-sizing: border-box;
      }
      .textlist {
        padding: 18px 0;
        box-sizing: border-box;
        p{
          font-size: 16px;
          padding: 3px 0;
          padding-left: 20px;
          color: #555;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 345px;
          height: 26px;
          margin: 0px;
        }
      }
      .picolist-rwm {
        text-align: center;
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(../../img/website/bg.png) repeat;
        top: -360px;
        left: 0;
        z-index: 11;
        line-height: 190px;
        transition:top 0.3s ease 0s;
        img{
          vertical-align: middle;
        }
        &.active{
          top:0px;
        }
      }
    }
    .footerid {
      width: 100%;
      background: #fff;
      margin-top: 70px;
    }
    .footer {
      width: 1115px;
      margin: 0 auto;
      padding: 40px 0px 40px 20px;
      background: #fff;
      overflow: hidden;
      .wechat span {
        display: inline-block;
        text-align: center;
        padding-left: 20px;
        margin-top: 5px;
      }
      .wechat .er2 {
        padding-left: 120px;
      }
      .address {
        padding-left: 20px;
      }
    }
    .banum {
      color: #888;
      font-size: 12px;
      text-align: center;
    }
    .rwm {
      text-align: center;
    }
    .footer-left ul {
      list-style: none;
      float: left;
      margin-right: 60px;
      li {
        margin-top: 10px;
        a {
          text-decoration: none;
          font-size: 12px;
          color: #959595;
        }
      }
    }
    .hidden {
      display: none!important;
      visibility: hidden!important;
    }
    .footer-left {
      float: left;
    }
  }
</style>
