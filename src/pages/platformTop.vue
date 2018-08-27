<template>
  <div id="platTop">
    <!--一米logo-->
    <div class="logo">
      <img class="logo-img" src="../img/logo.png"/>
      <a class="logo-text" href="javescript:void(0)">一米平台</a>
    </div>

    <!--<el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="breadcrumb-item" v-for="(item,index) in levelList" :key="index">
        {{item.name}}
      </el-breadcrumb-item>
    </el-breadcrumb>-->
    <!--用户头像-->
    <div class="area">
      <div class="user">
        <div class="photo"><img class="photo-img" :src="headPicture"/></div>
        <div class="user-info">{{userName}}</div>
      </div>
      <el-dropdown trigger="click" class="quit">
        <i class="el-icon-setting"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            <router-link class="info" to="/accountManage">账户管理</router-link>
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            <p @click="quit">退出</p>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
    export default {
      created() {
        this.getBreadcrumb()
      },
      data() {
        return {
          levelList: null,
          headPicture: JSON.parse(sessionStorage.getItem("userinfo")).head_pic,
          userName: JSON.parse(sessionStorage.getItem("userinfo")).name,
        }
      },
      watch: {
        $route() {
          this.getBreadcrumb()
        }
      },
      methods: {
        getBreadcrumb() {//面包屑
          const matched = this.$route.matched.filter(item => item.name);
          this.levelList = matched;
        },
        quit() {
          sessionStorage.clear();
          this.$router.replace({path: '/login'});
        }
      }
    }
</script>

<style lang="less">
  a.info{
    color: #71cd99;
    text-decoration: none;
  }
  #platTop {
    height: 64px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0px;
    right: 0;
    background: #444;
    border-bottom: 1px #e5e5e5 solid;
    box-sizing: border-box;
    z-index:1999;

    .quit {
      margin-right: 20px;
      i {
        font-size: 24px;
        color: #eee;
      }
    }
    .logo { // 1
      text-align: center;
      height: 64px;
      width: 200px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img { //2
        width: 36px;
        height: 36px;
        margin-right: 10px;
      }
      .logo-text { //2
        color: #fff;
        font-weight: 400;
        font-size: 18px;
        text-decoration: none;
      }
    }
    .area{
      width:80%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      height:64px;
    }
    .user { //1
      padding: 0;
      //border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      justify-content: end;
      align-items: center;
      display: flex;
      .photo { //2
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50%;
        border: 4px solid rgba(255, 255, 255, 0.3);
        margin: 0 auto;
        .photo-img { //3
          height: 40px;
          width: 40px;
        }
      }
      .user-info { //2
        color: #fff;
        padding: 8px 14px;
        text-align: center;
        font-weight: 400;
        font-size: 15px;
        line-height: 40px;
      }
    }
  }

  .el-breadcrumb__inner, .el-breadcrumb__inner a {
    color: #777;
  }

  .el-breadcrumb__inner:hover {
    color: #000;
    cursor: text;
  }

</style>
