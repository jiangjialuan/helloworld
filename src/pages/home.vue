<template>
  <div id="home">
    <sidebar></sidebar>
    <top></top>
    <notice></notice>
    <!--<keep-alive>-->
      <router-view class="childContainer"></router-view>
    <!--</keep-alive>-->
  </div>
</template>

<script>
  import sidebar from './sidebar.vue';
  import top from './top.vue';
  import notice from './views/notice.vue'

  export default {
    components: {sidebar, top, notice}
  }
</script>

<style lang="less">
  @import url("../css/common.css");

  #home {
    margin: 64px 0 0 260px;
    .childContainer {
      overflow: hidden;
    }
    .childContainer > * {
      margin: 30px;
    }
  }
</style>
