<template>
  <div>
    <script :id=id type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null,
        height:500
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        /*toolbars:[['Source','Bold','italic', 'underline',  'forecolor','fontfamily', 'fontsize', 'justifyleft','justifycenter', 'justifyright', 'simpleupload' ]],
        initialFrameHeight: 500,
        enableAutoSave: false,
        enableContextMenu: false,
        elementPathEnabled: false,
        wordCountMsg: '{#count} / 10000',
        wordOverFlowMsg: '请不要超过10000个字符',
        autoHeightEnabled: false,
        scaleEnabled: false,
        zIndex: 1,
        autoFloatEnabled: true,
        initialFrameWidth : null,
        initialFrameHeight: 500*/
      },
      id: {
        type: String
      },
    },
    computed:{

    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
        _this.editor.execCommand('serverparam',{
          path_code:23
        })
        _this.editor.execCommand( 'focus' );
        console.log(_this.height=_this.editor.getContentLength());
      });
      this.editor.getActionUrl=function(action){
          if(action=='config'){
            return '/static/UE/config.json'
          }else if(action=='uploadimage'){
            return '/index/index/upload_img'
          }
      };
      //console.log("上传这堆错误不用理会，上传接口需自行开发配置");
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },
      setUEContent(str){
        return this.editor.setContent(str);
      },
      setUEHeight(h){
          return this.editor.setHeight(h);
      },
      getUEContentLength(){
          return this.editor.getContentLength();
      },
      focus(){
        return this.editor.execCommand( 'focus' );
      }
    },
    destroyed() {
      this.editor.destroy();
    },

  }
</script>
<style>
  .edui-default .edui-toolbar{
    height:24px;
  }
  .edui-default .edui-editor-toolbarboxouter{
    height:30px;
  }
  .edui-default .edui-toolbar .edui-combox .edui-combox-body{
    height:20px;
  }
  .edui-default .edui-button-body{
    height:20px;
  }
</style>
