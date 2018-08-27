<template>
  <div id="top">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="breadcrumb-item" v-for="(item,index) in levelList" :key="index">
        {{item.name}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown trigger="click" class="quit logo">
      <i class="el-icon-exit"></i>
      <el-dropdown-menu slot="dropdown">
        <!--<el-dropdown-item class="clearfix" v-if="userinfo.uid==curuid">
          <router-link to="/accountManage">账户管理</router-link>
        </el-dropdown-item>-->
        <el-dropdown-item class="clearfix">
          <p @click="quit">退出</p>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
        userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
        curuid:sessionStorage.getItem('curuid'),
      }
    },
    mounted() {
      bus.$on('curuid', (curuid) => {
        this.curuid=curuid;
      })
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
        this.$confirm('确认退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.clear();
          this.$router.replace({path: '/login'});
        }).catch();

      }
    }
  }
</script>

<style lang="less">
  #top {
    height: 64px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    position: fixed;
    top: 0;
    left: 260px;
    right: 0;
    background:#F5F5F5;
    /*border-bottom: 1px #e5e5e5 solid;*/
    box-sizing: border-box;
    z-index:1999;
    justify-content:flex-end;
    display: flex;
    flex-direction: row;
    .breadcrumb-item{
      font-size:16px;
    }
    .el-icon-exit{
      background: url("../img/icon_exit.png") no-repeat;
      display: inline-block;
      width:28px;
      height:28px;
    }
    .breadcrumb {
      cursor: text !important;
      color: #770d08;
      position: absolute;
      left: 15px;
      top:0px;
      height: 64px;
      line-height: 64px;
      font-size: 12px;
      font-weight: 400;

    }
    .quit {

      margin-right: 40px;
      i {
        font-size: 28px;
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
