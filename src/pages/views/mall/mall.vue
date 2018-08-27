<template>
  <!--<div id="mall">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="">
      <el-submenu index="1">
        <template slot="title">商品管理</template>
        <el-menu-item index="1-1">在售商品</el-menu-item>
        <el-menu-item index="1-2">仓库中的商品</el-menu-item>
      </el-submenu>
      <el-menu-item index="2">交易订单</el-menu-item>
    </el-menu>
  </div>-->
  <div><iframe  name="iFrame1" border="0" frameborder="no" id="shopIframe" width="100%" :src="shopurl" :style="'height:'+iframeH+'px;margin:0px;'"></iframe></div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        shopurl:localStorage.getItem('shopurl')
      }
    },
    computed: {
      iframeH() {
        return document.documentElement.clientHeight-74
      },

    },
  }
</script>

<style>

</style>
