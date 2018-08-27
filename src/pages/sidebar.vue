<template>
  <div id="sidebar" data-color="orange">
    <!--一米logo-->
    <div class="logo">
      <img class="logo-img" src="../img/logo.png"/>
      <a class="logo-text" href="#">一米平台</a>
    </div>
    <!--用户头像-->
    <div class="user">
      <div class="photo"><img class="photo-img" :src="userinfo.head_pic"/></div>
      <!--{{currentBranchShop}}-->
      <div class="user-info">{{userinfo.name}}</div>
      <div class="alignCenter platform" v-if="hassubshop=='true'">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <span class="brandShop">切换分店</span>
              <!--<span slot="title">&nbsp;&nbsp;切换&nbsp;&nbsp;></span>-->
            </template>
            <el-menu-item-group>
              <el-menu-item index="/platform">平台概况</el-menu-item>
              <el-menu-item class="platformItem" :class="currentBranchShop==item.name?'is-active':''" v-for="(item,index) in tableData" :index="item.phone+'-'+item.anchorid" :key="item.anchorid" @click="menuClick(item.name)" >{{item.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="alignCenter" style="margin-top:16px;">
        <el-button class="userSetBtn" @click="goUserSet">帐户设置</el-button>
      </div>
    </div>
    <!--功能列表-->
    <div :style="{height:ListHeight}" style="overflow: auto;">
      <el-menu class="menu"
               text-color="#Fff"
               active-text-color="#fff"
               :default-active="$route.path"
               router>
        <template v-for="item in items">
          <!--有二级菜单-->
          <template v-if="item.subs">
            <el-submenu :index="item.index">
              <template slot="title"><i class="icon-left" :class="item.icon"></i>{{item.title}}</template>
              <el-menu-item class="menu" v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                <p>{{subItem.title}}</p>
              </el-menu-item>
            </el-submenu>
          </template>
          <!--没有二级菜单-->
          <template v-else>
            <el-menu-item :index="item.index">
              <p><i class="icon-left" :class="item.icon"></i>{{item.title}}</p>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        items:JSON.parse(sessionStorage.getItem('menue')),
        isCollapse:true,
        tableData:[],
        userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
        /*items:[
          {
            icon: 'el-icon-mall',
            index: '/mall',
            title: '我的商城',
            subs:[{
              index:'/mall/shop',
              title:'我的商城'
            },{
              index:'/mall/collageList',
              title:'拼团管理'
            }]
          }
        ],*/
        ListHeight: (window.innerHeight - 280) + 'px',
        phone:'',
        currentBranchShop:sessionStorage.getItem('currentBranchShop'),
        curuid:sessionStorage.getItem('curuid'),
        hassubshop:sessionStorage.getItem('hassubshop')
      }
    },

    created() {
      //生成菜单
      const permission = JSON.parse(sessionStorage.getItem('permission'));
      if(sessionStorage.getItem('hassubshop')=='true'){
        this.ListHeight = (window.innerHeight - 329) + 'px';
      }else{
        this.ListHeight = (window.innerHeight - 270) + 'px';
      }
      //窗口高度动态变化
      window.onresize = () => {
        if(sessionStorage.getItem('hassubshop'))
        this.ListHeight = (window.innerHeight - 329) + 'px';
        else this.ListHeight = (window.innerHeight - 270) + 'px';
      };
      //账户管理里面修改头像名字，菜单栏实时对应更新
      bus.$on('bus_head_pic', (data) => {
          this.userinfo.head_pic = data;
      });
      bus.$on('bus_name', (data) => {
          this.userinfo.name = data;
        this.currentBranchShop = data;
        this.getSubShop();
      });
      this.getSubShop();
      this.getUserPermission();
    },
    methods:{
      //获取平台数据
      getSubShop(){
        if(sessionStorage.getItem('hassubshop')==null||sessionStorage.getItem('hassubshop')==undefined||sessionStorage.getItem('hassubshop')==''||sessionStorage.getItem('hassubshop')=='false'){

        }else {
          this.api.request({
            url: this.api.getSubShop,
            params: {
              buid: localStorage.getItem('loginUid')
            }
          }).then((res) => {
            if (res.data.state.code == 10200) {
              this.tableData = res.data.data.sub_shops;
              sessionStorage.setItem('subshops', JSON.stringify(res.data.data.sub_shops));
            } else {
              this.$message.error(res.data.state.msg);
            }
          });
        }
      },
      //去帐户设置
      goUserSet(){
        this.$router.push({path:'/accountManage'})
      },
      //获取用户信息
      getUserInfo(){
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.userinfo + '?act=11',
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data.data));
              this.userinfo=res.data.data;
              resolve();
            } else{
              this.$message.error(res.data.state.msg)
            }
          }).catch()
        });
      },
      //平台分店点击触发事件
      menuClick(item){
        this.currentBranchShop=item;
        sessionStorage.setItem('currentBranchShop', item);
      },
      //获取商户概况statisticsData
      getStatisticsData() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.statistics_data + '?act=11',
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
            url: this.api.get_user_permission + '?act=11',
            params:{
              account:this.phone
            }
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('permission', JSON.stringify(res.data.data.permission));
              sessionStorage.setItem('menue', JSON.stringify(res.data.data.menu));
              sessionStorage.setItem('version', res.data.data.version);
              this.items=res.data.data.menu;
              resolve();
            } else {
              this.$message.error(res.data.state.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      //切换平台必调接口
      switch_account(uid){
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.switch_account,
            params: {
              act: 11,
              manager_id: localStorage.getItem('loginUid'),
              uid: uid
            }
          }).then((res) => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('curuid', uid);
              localStorage.setItem('shopurl', res.data.data.shop_url.url);
              resolve();
            } else {
              this.$message.error(res.data.data.msg);
            }
          })
        });
      },
      //平台菜单变化触发的函数
      handleSelect(key, keyPath){
        sessionStorage.setItem('hasDialog',0);
        var key=key;
        var arr=key.split('-');
        if(arr.length<2){
          this.$router.push({path:'/platform'});
        }else{
          this.phone=arr[0];
          this.switch_account(arr[1]).then((res)=>{
            Promise
              .all([ this.getStatisticsData(), this.getUserPermission(),this.getUserInfo()])
              .then((results) => {
                if(this.$route.path=='/info'){
                  this.items=JSON.parse(sessionStorage.getItem('menue'));
                  this.curuid=sessionStorage.getItem('curuid');
                  bus.$emit('statisticsData', JSON.parse(sessionStorage.getItem("statisticsData")));
                  bus.$emit('curuid', JSON.parse(sessionStorage.getItem("curuid")));
                  bus.$emit('userInfo',JSON.parse(sessionStorage.getItem("userinfo")));
                }else{
                  this.$router.push({path:'/info',query:{
                      id:arr[1]
                    }});
                };
                sessionStorage.setItem('hasDialog',1);
              });
          })
        }
      }
    }
  }
</script>

<style lang="less">
  .el-menu-item{
    color:#9CA0A7 !important;
  }
  .el-menu--vertical{
    z-index: 99999 !important;
  }
  #sidebar {
    user-select: none;
    width: 260px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background: #39414F;
    .el-icon-wxProgram{
      background: url("../img/icon/icon_xiao.png") no-repeat;
    }
    .el-icon-agentManage{
      background: url("../img/icon/icon_guanli.png") no-repeat;
    }
    .el-icon-mall{
      background: url("../img/icon/icon_shop.png") no-repeat;
    }
    .el-icon-earnings{
      background: url("../img/icon/icon_shouxi.png") no-repeat;
    }
    .el-icon-video{
      background: url("../img/icon/icon_video.png") no-repeat;
    }
    .el-icon-info1{
      background: url("../img/icon/icon_gaikuang.png") no-repeat;
    }
    .el-icon-wxAuthorization{
      background: url("../img/icon/icon_wxAuthorization.png") no-repeat;
    }
    .el-icon-joinlist{
       background: url("../img/icon/icon_joinlist.png") no-repeat;
    }
    .el-icon-promotion{
      background: url("../img/icon/icon_promote.png") no-repeat;
    }
    .el-icon-member{
      background: url("../img/icon/icon_member.png") no-repeat;
    }

    .logo { // 1
      text-align: center;
      height: 63px;
      width: 260px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: center;
      background: #89C3F8;
      align-items: center;
      .logo-img { //2
        width: 36px;
        height: 36px;
        margin-right: 10px;
      }
      .logo-text { //2
        color: #fff;
        font-weight: 400;
        font-size: 20px;
      }
    }
    .user { //1
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      .photo { //2
        width: 72px;
        height: 72px;
        overflow: hidden;
        border-radius: 50%;
        //border: 1px solid rgba(255, 255, 255, 0.3);
        margin: 0 auto;
        .photo-img { //3
          height: 72px;
          width: 72px;
        }
      }
      .user-info { //2
        color: #fff;
        padding: 8px 14px;
        text-align: center;
        font-weight: 400;
        font-size: 15px;
        height:20px;
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .el-menu {
      background: none;
      border-right: none;
      li{
        font-size:14px;
        font-weight:400;
      }
    }
    .el-menu-item {
      padding: 10px 0px;
      margin: 5px 0px 0px;
      box-sizing: border-box;
      line-height: 30px;
      height:50px;
      color:#9CA0A7 !important;
      border-left:8px solid transparent;
      p{padding-left:20px;}
      &.is-active{
        border-left:8px solid #89C3F8;
        color:#fff !important;
      }
      &:focus,&:hover{
        color:#fff !important;
        background: none !important;
      }
    }
    .menu { //1
      .el-submenu{
        .el-menu-item{
          padding: 10px 0px 0px 70px  !important;
        }
        &.is-active{
          .el-submenu__title{
            border-left:8px solid #89C3F8;
            color:#fff !important;
          }
          .is-active{
            border-left:8px solid transparent;
            color:#fff !important;
          }
          &.is-opened{
            background: #2C3542;
          }
        }
      }
      .icon-left { //2
        color: rgba(255, 255, 255, .7);
        margin-right: 20px;
        font-size: 20px;
        font-weight: normal;
        width:20px;
        height:20px;
      }
      i {
        color: rgba(255, 255, 255, .7);
        font-weight: bold;
      }
    }
    .el-submenu__title {
      padding: 10px 0px 10px 40px !important;
      margin: 5px 0px 0px;
      box-sizing: border-box;
      line-height: 30px;
      height:50px;
      color:#9CA0A7 !important;
      border-left:8px solid transparent;
      &:hover{
        color:#fff !important;
        background: none !important;
      }
    }
    ::-webkit-scrollbar { /*隐藏滚动条*/
      display: none;
    }
    .el-submenu__icon-arrow {
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 2px;
      vertical-align: middle;
      border-top: 4px dashed;
      border-top: 4px solid\9;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      transition: all 150ms ease-in;
      font-weight: 700;
      color:#fff;
      margin-top:-2px !important;
    }
    .el-icon-arrow-down:before{
      content:'' !important;
    }
    .userSetBtn{
      background: none;
      width:160px;
      height:40px;
      text-align: center;
      border:1px solid #89C3F8;
      color:#89C3F8;
      &:hover{
        background: #89C3F8;
        color:#fff;
      }
    }
    .alignCenter{
      text-align: center;
    }

    .platform{
      position: static;
      background: none;
      width:160px;
      height:40px;
      text-align: center;
      border:1px solid #89C3F8;
      color:#89C3F8;
      border-radius: 4px;
      margin: 16px auto 0px;

      .el-submenu__title{
        border-left:none;
        padding:0px !important;
      }
      .brandShop{
        overflow: hidden;
        text-overflow: ellipsis;
        color:#89C3F8;
        &:hover{
          color:#fff;
        }
      }
      ul{
        width:100%;
        height:40px;
        .el-menu{
          background: none;
        }
        li{
          background: none;
        }
      }
      .el-submenu{
        &.is-opened{
          background: #89C3F8;
          color:#fff;
          span{
            color:#fff;
          }
        }
      }
      .el-submenu__title{
        margin:0px;
        padding:0px 20px;
        height:40px;
        line-height: 40px;
        &:hover{
          background: #89C3F8;
          color:#fff;
        }
      }
      .el-submenu__icon-arrow{
        display: none;
      }
      .el-submenu{
        border-radius: 4px;
      }
      .is-active .el-submenu__title,.el-submenu__title{
        background: none;
      }
      .el-menu--collapse>.el-submenu>.el-submenu__title span{
        visibility:visible;
        width:100%;
        height:auto;
      }
      .el-icon-menu{
        color: rgb(255, 208, 75);
      }
    }
  }
  .el-menu--popup-right-start{
    background: rgba(57,65,79,0.8);
    max-height:650px;
    overflow: auto;
    &::-webkit-scrollbar { /*隐藏滚动条*/
      /*display: none;*/
      width: 8px;
      padding-right: 4px;
      background-color: rgba(57,65,79,0.5);
    }
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 4px;
      border-radius: 4px;
      background-color: rgba(255,255,255,0.5);
    }
    .platformItem{
      height:50px;
      max-width:300px;
      overflow:hidden;
      text-overflow: ellipsis;
    }
    li{
      &.is-active{
        color: #fff !important;
      }
      &:hover{
        color: #fff !important;
        background: none;
      }
    }
  }
</style>
