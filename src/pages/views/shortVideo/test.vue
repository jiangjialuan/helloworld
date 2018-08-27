<template>
  <div class="components-container">
    <div class="info">UE编辑器示例<br>需要使用编辑器时，调用UE公共组件即可。可设置填充内容defaultMsg，配置信息config(宽度和高度等)，可调用组件中获取内容的方法。支持页面内多次调用。</div>
    <button @click="getUEContent()">获取内容</button>
    <button @click="getUEContentTxt()">获取无文本内容</button>
    <div class="editor-container">
      <el-tabs v-model="activeName2" type="card" >
        <el-tab-pane label="基本信息" name="first">
      <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue" v-if="kk"></UE>
        </el-tab-pane>
        <el-tab-pane label="fda" name="second">
      <UE :defaultMsg=defaultMsg2 :config=config :id=ue2 ref="ue2"></UE>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style>
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
</style>
<script>
  import UE from '../../../components/ue.vue';
  import ElTabPane from "../../../../node_modules/element-ui/packages/tabs/src/tab-pane";
  export default {
    components: {ElTabPane, UE},
    created(){
      this.setContent();
    },
    data() {
      return {
        defaultMsg: 'fdafd',
        defaultMsg2:'',
        config: {
          initialFrameHeight:'100%',
          initialFrameWidth:'100%',
        },
        kk:false,
        activeName2:'first',
        ue1: "ue1", // 不同编辑器必须不同的id
        ue2: "ue2"
      }
    },
    methods: {
      getUEContent() {
          debugger;
        let content = this.$refs.ue.getUEContent(); // 调用子组件方法
        this.$notify({
          title: '获取成功，可在控制台查看！',
          message: content,
          type: 'success'
        });
        console.log(content)
      },
      getUEContentTxt() {
        let content = this.$refs.ue.getUEContentTxt(); // 调用子组件方法
        this.$notify({
          title: '获取成功，可在控制台查看！',
          message: content,
          type: 'success'
        });
        console.log(content)
      },
      setContent(){
        return new Promise((resolve,reject)=> {
          this.api.request({
            url: this.api.get_enterprise_card + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              //this.businessCardForm = res.data.data;
              this.kk=true;
              this.defaultMsg=res.data.data.enterprise_detail[2].introduce;
              this.defaultMsg2=res.data.data.enterprise_detail[1].introduce;
              resolve(res);
            }
          })
        });
      }
    }
  };
</script>



