<template>
  <el-dialog title="封面截图" :visible.sync="dialogCoverScreenshotVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'"  ref="cutpicture" >
    <div class="dialog-body" style="height:400px;">
      <vueCropper
        ref="cropper"
        :img="cropper.img"
        :outputSize="cropper.size"
        :outputType="cropper.outputType"
        :info="cropper.info"
        :canScale="cropper.canScale"
        :autoCrop="cropper.autoCrop"
        :autoCropWidth="cropper.autoCropWidth"
        :autoCropHeight="cropper.autoCropHeight"
        :fixed="cropper.fixed"
        :fixedNumber="cropper.fixedNumber"
      ></vueCropper>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogCoverScreenshotVisible = false">取 消</el-button>
      <el-button type="primary" @click="comfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import VueCropper from 'vue-cropper'
  import qs from 'qs';
    export default {
      name: "cutPicture",
      components: {
        VueCropper
      },
      data(){
          return {
            dialogCoverScreenshotVisible:false,
            screeHeight:window.innerHeight,
            cropper: {
              img: '',
              info: true,
              size: 1,
              outputType: 'png',
              canScale: true,
              autoCrop: true,
              // 开启宽度和高度比例
              fixed: true,
              full:true,
              autoCropWidth:100,
              autoCropHeight:100,
              fixedNumber: [1,1]
            },
          }
      },
      methods:{
        //打开截图弹框
        open(file){
          var reader = new FileReader();
          reader.readAsDataURL(file);//转化成base64数据类型
          var _this=this;
          reader.onload = (e)=>{
            let img = new Image();
            img.onload = () =>{
              if (img.width / img.height >= 750 / 400) {
                _this.cropper.autoCropWidth = (img.height * 750 / 400) * (750 / img.width);
                _this.cropper.autoCropHeight=_this.cropper.autoCropWidth;
              } else {
                _this.cropper.autoCropWidth = img.width * (400 / img.height);
                _this.cropper.autoCropHeight=_this.cropper.autoCropWidth;
              }
            };
            img.src=e.currentTarget.result;
            _this.cropper.img=e.currentTarget.result;
          };
          _this.dialogCoverScreenshotVisible=true;
        },
        //切图确认事件
        comfirm(){
          this.$refs.cropper.getCropData((base64Url) => {
            this.uploadCapture(base64Url);
          })
        },
        //上传至服务器
        uploadCapture(base64Url){
          var smData={
            data: base64Url,
            path_code: 16
          }
          this.api.request({
            url: this.api.upload_data_img,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData),
          }).then(res => {
            if(res.data.state.code==10200){
              this.$emit('comfirm',res.data);
              this.dialogCoverScreenshotVisible=false;
            }else{
              this.$message.error('封面图上传失败');
            }
          });
        },
      }
    }
</script>

<style scoped>

</style>
