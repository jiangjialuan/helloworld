<template>
  <div id="shortVideoEdit">
    <div class="editVideo firstTab">
      <div class="videoPlay p-b15" id="videoPlay">
        <canvas class="f-r hidden" id="cvs"></canvas>
        <!--:width="videoWidth" :height="videoHeight"-->
        <div class="posterImg" id="posterImg" v-if="step=='second'"><img :src="videoPoster" /></div>
        <div class="posterCanvas" style="display: none;"></div>
        <div class="vedeoBg" v-if="step=='first'">
          <videoPlayer ref="videoPlayer" id="my-video" :class="isHaveSource?'':'hidden'" :options="playerOptions" :playsinline="true"
                       @timeupdate="onPlayerTimeupdate($event)"
          @error="onErrorVideo">
          </videoPlayer>
        </div>
        <el-button class="upload" :class="isHaveSource?'hidden':''" onclick="upload.click()">上传短视频
        </el-button>
        <!--<el-button class="upload" onclick="upload.click()">上传短视频
        </el-button>-->
        <input type="file" accept="video/*" id="upload"  ref="upload" name="upload" style="display:none" @change="nativeView">
        <div class="btn-area" v-if="step=='second'">
          <el-button class="videoPlayBtn videoSetBtn"  plain @click="videoCover">从视频截取封面</el-button>
          <el-button class="videoPlayBtn videoSetBtn uploadPhoto" type="primary" plain onclick="uploadPhoto.click()">从相册选择封面</el-button>
          <input type="file" accept="image/*" id="uploadPhoto" name="uploadPhoto"  style="display:none" @change="photoCoverChange">
        </div>
        <div class="btn-area" :class="step=='first'?'':'hidden'">
          <div class="bubblingItem" v-for="(item,index) in bubblingGoods" :class="item.show_time==currentTime?'active':''"
               :style="'left:'+Math.floor(item.show_time*800/videoDuration)+'px'"
               :show-time="item.show_time"   v-if="item.is_show==1" @click="goCurrentBubbling(item.show_time)">
            <img :src="item.image"/>
          </div>
        </div>
      </div>
      <div class="VideoShop col-sm-12" id="VideoShop" :class="step=='first'?'':'hidden'" v-if="userinfo.edit_flag">
        <el-row class="selectGoodsList" id="selectGoodsList">
          <el-col class="selectGoodsList-item" v-for="(item,index) in selectGoods" :key="'select'+index" :class="currentGoods(item.goods_id)?'':'active'">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.image" width="98" height="98"/>
              <div class="el-card-background">
                <el-button  round class="selectGoodsBtn" size="small" type="primary" v-if="currentGoods(item.goods_id)" @click="recommend(index)">推荐</el-button>
                <el-button  class="selectGoodsBtn" size="small" round v-else @click="cancelBubbling(item.goods_id)">取消</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="footerSubmit" :class="step=='first'?'':'hidden'" v-if="userinfo.edit_flag">
        <el-button @click="nextStep">下一步</el-button>
        <el-button @click="addGoods" type="primary" v-if="!(version.indexOf('官网')>=0)">添加商品</el-button>
      </div>
      <div class="footerSubmit" :class="step=='first'?'':'hidden'" v-else>
        <el-button type="primary" @click="nextBlack">返回视频列表</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :class="step=='second'?'':'hidden'">
        <el-form-item label="添加标题" required>
          <el-input v-model="form.title" placeholder="请输入短视频名称（最多30字）" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="分享设置">
          <el-input v-model="form.share_title" placeholder="请输入主标题"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form.share_desc" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div class="footerSubmit" :class="step=='second'?'':'hidden'">
        <el-button @click="lastStep">上一步</el-button>
        <el-button @click="submit" type="primary" :disabled="isDisabled">发布</el-button>
      </div>
    </div>
    <el-dialog title="封面截图" :visible="dialogCoverScreenshotVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'"  ref="videoCover" :before-close="ai_dialog_close">
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
        <el-button type="primary" @click="getCoverScreenhot">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择封面" :visible="dialogVideoVisible"  ref="videoCover" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'" :before-close="ai_dialog_close">
      <div class="dialog-body">
        <videoPlayer ref="videoPlayer2" id="my-video2" :options="playerOptions2" :playsinline="true" >
        </videoPlayer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoVisible = false">取 消</el-button>
        <el-button type="primary" @click="videoCapture('my-video2')">确 定</el-button>
      </div>
    </el-dialog>

    <div class="el-loading-mask is-fullscreen" :class="progressEvent==0?'hidden':''" style="margin: 0px;">
      <el-progress class="elProgress" type="circle" :percentage="progressEvent" ></el-progress>
    </div>
    <selectGood :version="versionData" :limit="6" title="选择商品（最多只能选择6个商品）" ref="selectGoods" :propSelect="selectGoods" @comfirm="selectGoodsComfirm"></selectGood>

  </div>

</template>
<script>

  import {videoPlayer} from 'vue-video-player'
  import qs from 'qs'
  import VueCropper from 'vue-cropper'
  import selectGood from '../../../components/selectgoods.vue'
  export default {
    components: {
      videoPlayer: videoPlayer,
      qs,
      VueCropper,
      selectGood
    },
    data(){
      return {
        userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
        versionData:{
          hassocial:'',
          hasService:'',
          hasSubscribe:'',
          hasConsultation:'',
          hasfictitious:'',
          hasReal:''
        },
        selectGoods:[],
        permission:JSON.parse(sessionStorage.getItem('permission')),
        version:sessionStorage.getItem('version'),
        isDisabled:false,
        screeHeight:window.innerHeight,
        playerOptions: {
          height: '450',
          width: '800',
          autoplay: true,
          muted: false,// false默认情况下将会消除任何音频。
          aspectRatio: '16:9',//// 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true,//// 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [],
          controls: true,
        },
        playerOptions2: {
          muted: false,
          aspectRatio: '16:9',
          controls: true,
          autoplay: true,
        },
        cropper: {
          img: '',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: true,
          autoCrop: true,
          // 开启宽度和高度比例
          fixed: true,
          full:true,
          fixedNumber: [4,3]
        },
        progressEvent:0,
        videoId:this.$route.params.id,
        videoDuration:0,
        videoWidth:0,
        videoHeight:0,
        videoPoster:'',
        videoUrl:'',
        activeName: 'tab0',
        currentTime:'',
        bubblingGoods:[],
        step: 'first',
        form: {
          title: '',
          share_desc: '',
          share_title: '',
        },
        dialogVideoVisible: false,
        dialogCoverScreenshotVisible:false,
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
      isHaveSource(){
          if(this.playerOptions.sources.length>0){
            if(this.playerOptions.sources[0].src==''||this.playerOptions.sources[0].src==undefined){
                return false;
            }else{
                return true;
            }
          }else{
              return false;
          }
      },

    },
    created:function(){
      if(this.videoId!=''&&this.videoId!=undefined){
        this.api.request({
          url:this.api.short_video_data,
          params:{
              act:11,
              id:this.videoId
          }
        }).then(res=>{
          if(res.data.state.code==10200){
            this.videoPoster=res.data.data.cover;
            this.videoUrl=res.data.data.url;
            var arr=[{
              type: "video/mp4",
              src: res.data.data.url.replace('http://resource.yimizhibo.tv', window.location.protocol + "//" + window.location.host),
            }];
            this.playerOptions.sources=arr;
            this.playerOptions2.sources=arr;
            debugger;
            this.videoDuration=res.data.data.length;
            if(res.data.data.goods.length>0){
              res.data.data.goods.forEach((item)=>{
                if(item.is_show==1){
                  var hasItem;
                  this.selectGoods.forEach(child=>{
                    if(item.goods_id==child.goods_id){
                      hasItem=child;
                      return;
                    }
                  });

                  if(hasItem==undefined) this.selectGoods.push(item);
                  this.bubblingGoods.push(item);
                }else{
                  this.selectGoods.push(item);
                }
              });
            }
            this.form.title=res.data.data.title;
            this.form.share_desc=res.data.data.share_desc;
            this.form.share_title=res.data.data.share_title;
          }
        });
      }
      this.hassocial();
      this.hasService();
      this.hasSubscribe();
      this.hasConsultation();
      this.hasfictitious();
      this.hasReal();
    },
    methods: {
      //返回视频 列表
      nextBlack(){
        this.$router.push('/shortVideo/');
      },
      hassocial(){
        if(this.version.indexOf('社保')>=0){
          this.versionData.hassocial=true;
        }else{
          this.versionData.hassocial=false;
        }
      },
      hasService(){
        //服务
        if(this.version.indexOf('美业')>=0){
          this.versionData.hasService=true;
        }else{
          this.versionData.hasService=false;
        }
      },
      hasSubscribe(){
        //预约
        if(this.version.indexOf('美业')>=0){
          this.versionData.hasSubscribe=true;
        }else{
          this.versionData.hasSubscribe=false;
        }
      },
      hasConsultation(){
        //咨询
        if(this.version.indexOf('标准')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
            this.versionData.hasConsultation = false;
          }else this.versionData.hasConsultation=true;
        }else if(this.version.indexOf('尊享')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
            this.versionData.hasConsultation = false;
          }else this.versionData.hasConsultation=true;
        }else if(this.version.indexOf('美业')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
            this.versionData.hasConsultation = false;
          }else this.versionData.hasConsultation=true;
        }else if(this.version.indexOf('社保')>=0){
          if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
            this.versionData.hasConsultation = false;
          }else this.versionData.hasConsultation=true;
        }else{
          this.versionData.hasConsultation=false;
        }
      },
      hasfictitious(){
        //虚拟
        if(this.version.indexOf('标准')>=0){
          this.versionData.hasfictitious=true;
        }else if(this.version.indexOf('尊享')>=0){
          this.versionData.hasfictitious=true;
        }else if(this.version.indexOf('美业')>=0){
          this.versionData.hasfictitious=true;
        }
        else if (this.version.indexOf('社保') >= 0){
          this.versionData.hasfictitious=true;
        }
        else{
          this.versionData.hasfictitious=false;
        }
      },
      hasReal(){
        //实物
        if(this.version.indexOf('标准')>=0){
          this.versionData.hasReal=true;
        }else if(this.version.indexOf('尊享')>=0){
          this.versionData.hasReal=true;
        }else if(this.version.indexOf('美业')>=0){
          this.versionData.hasReal=true;
        }else{
          this.versionData.hasReal=false;
        }
      },
        //关闭弹框
      ai_dialog_close(){
        this.dialogVideoVisible=false;
          this.dialogCoverScreenshotVisible=false;
      },
      //点击上传视频触发事件
      nativeView(){
        var file = document.getElementById('upload').files[0];
        if(file!=undefined){
          var arr = [{
            type: "video/mp4",
            src: URL.createObjectURL(file),
          }];
          this.playerOptions.sources = arr;
          this.playerOptions2.sources = arr;
        }
      },
      //视频上传七牛--七牛验证
      qiniu_upload_params(){
          return new Promise((resolve,reject)=>{
              this.api.request({
                url:this.api.qiniu_upload_params,
                params:{
                    act:11
                },
                headers:{"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'}
              }).then((res)=>{
                  if(res.data.state.code==10200){
                    resolve(res.data);
                  }
              }).catch(reject);
          })
      },
      //视频上传至服务器
      uploadVideo(){
          return new Promise((resolve,reject)=>{
            this.qiniu_upload_params().then(res=>{
              this.videoUrl=res.data.visit_url;
              var videoData = new FormData();
              videoData.append('file', this.$refs.upload.files[0]);
              videoData.append('key', res.data.key);
              videoData.append('token', res.data.token);
              videoData.append('path_code', 17);
              videoData.append('data_type', 'html');
              return this.api.request({
                url:'http://up-z2.qiniu.com/',
                data:videoData,
                method:'post',
                headers:{"Content-Type": "multipart/form-data"},
                onUploadProgress:(progressEvent)=>{
                  this.progressEvent=parseFloat(((progressEvent.loaded/progressEvent.total)*100).toFixed(2));
                  console.log((progressEvent.loaded/progressEvent.total)*100);
                }
              });
            }).then(res=>{
              resolve(res);
            }).catch((res)=>{
              reject(res);
              //this.clearVideo("上传视频失败，请重新上传！");
            });
          });
      },
      //视频播放出借
      onErrorVideo(res){
        this.clearVideo("媒体无法加载,由于服务器或网络失败或不支持该格式,请重新上传！");
      },
      //视频清空
      clearVideo(text){
        this.progressEvent=0;
        this.$alert(text, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.videoUrl='';
            var arr = [{
              type: "video/mp4",
              src: '',
            }];
            this.playerOptions.sources = arr;
            this.playerOptions2.sources = arr;
            this.step='first';
            this.videoPoster='';
            document.getElementById("upload").setAttribute("value","");
            console.log(this.playerOptions.sources[0].src);
          }
        });
      },
      //根据视频初始化值
      init(){
        this.videoWidth=this.player.videoWidth();
        this.videoHeight=this.player.videoHeight();
        this.videoDuration=this.player.duration();
        this.cropper.fixedNumber=[this.videoWidth,this.videoHeight];
      },
      //视频播放进度触好的事件
      onPlayerTimeupdate(player){
          this.currentTime=Math.floor(this.player.currentTime());

      },
      //下一步
      nextStep(){
        if (this.isHaveSource) {
          this.player.pause();
          this.init();
          if(this.videoPoster==''){
            this.videoCapture('my-video');
          }
          this.step = 'second';
        } else {
          this.$message.error("请先上传视频！");
        }
      },
      //上一步
      lastStep(){
        this.step = 'first';
      },
      //商品弹框--打开弹框
      addGoods(){
        this.videoDuration=this.player.duration();
        if(this.isHaveSource){
          this.$refs['selectGoods'].open();
        }else{
          this.$message.error("请先上传视频！");
        }
      },
      //商品弹框---商品弹框确认按钮事件
      selectGoodsComfirm(selectGoods){
        this.selectGoods=selectGoods;
        var arr=[];
        this.bubblingGoods.forEach((e,i)=>{
          var isHave;
          this.selectGoods.forEach(item=>{
            if(e.goods_id==item.goods_id){
              isHave=item;
              return;
            }
          });
          if(isHave!=undefined){
            arr.push(e);
          }
          if(i==this.bubblingGoods.length-1){
            this.bubblingGoods=arr;
          }
        })
      },
      //冒泡商品--点击推荐事件
      recommend(index){
        debugger;
        this.player.pause();
        var len=this.bubblingGoods.length;
        var currentTime=Math.floor(this.player.currentTime());
        var arr=JSON.parse(JSON.stringify(this.selectGoods[index]));
        arr.is_show=1;
        arr.show_time=currentTime;
        if(len>0){
          for(var i=0;i<len;i++){
            if(this.bubblingGoods[i].show_time==currentTime){
              this.bubblingGoods.splice(i,1);
              this.bubblingGoods.push(arr);
              break;
            }else{
              if(i==len-1){
                if(len>=6){
                  this.$message.error("最多只能推荐6个商品！");
                }else{
                  this.bubblingGoods.push(arr);
                }
              }
            }
          }
        }else{
          this.bubblingGoods.push(arr);
        }
      },
      //点击冒泡事件
      goCurrentBubbling(show_time){
        this.player.pause();
          this.player.currentTime(show_time);
      },
      //冒泡商品推荐与取消的切换
      currentGoods(id){
        var obj;
        this.bubblingGoods.forEach(item=>{
          if(item.show_time==this.currentTime&&item.goods_id==id&&item.is_show==1){
            obj=item;
            return;
          }
        });
        if(obj!=undefined){return false}else{return true};
      },
      //冒泡取消事件
      cancelBubbling(id){
          var arr=this.bubblingGoods;
        for(var i=0;i<arr.length;i++){
            if(id==arr[i].goods_id&&arr[i].show_time==this.currentTime){
              this.bubblingGoods.splice(i,1);
            }
        }
      },
      //视频截图弹框打开
      videoCover(){
        this.dialogVideoVisible = true;
        //this.player2.pause();
      },
      //视频截屏--确定事件
      videoCapture(id){
        debugger;
          if(this.$refs.videoPlayer2){
            this.$refs.videoPlayer2.player.pause();
          }
        var Mycanvas = document.getElementById("cvs"),
          ctx = Mycanvas.getContext("2d"),
          Myvideo = document.getElementById(id).getElementsByTagName('video')[0];
        Mycanvas.width = this.videoWidth;
        Mycanvas.height = this.videoHeight;
        ctx.drawImage(Myvideo, 0, 0, this.videoWidth, this.videoHeight);
        var base64Url = Mycanvas.toDataURL('images/png');
        this.videoPoster=base64Url;
        this.uploadCapture(base64Url);
      },
      //从相册中选择封面
      photoCoverChange(){
        var file = document.getElementById('uploadPhoto').files[0];
        if((file.size)/1024/1024>2){
          this.$message.error("图片不能大于2M！")
        }else{
          if(!/image\/\w+/.test(file.type)){
            this.$message.error("请确保文件为图像类型");
            return false;
          }
          var reader = new FileReader();
          reader.readAsDataURL(file);//转化成base64数据类型
          reader.onload = (e)=>{
            this.cropper.img=e.currentTarget.result;
          };

          this.dialogCoverScreenshotVisible=true;
        }
      },
      //封面图截剪--确定事件
      getCoverScreenhot(){
        this.$refs.cropper.getCropData((base64Url) => {
          this.uploadCapture(base64Url);
        })
      },
      //封面图上传服务器
      uploadCapture(base64Url){
          var smData={
            data: base64Url,
            path_code: 17
          }
        this.api.request({
          url: this.api.upload_data_img,
          method:'post',
          headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          params:{},
          data:qs.stringify(smData),
        }).then(res => {
            if(res.data.state.code==10200){
                this.videoPoster=this.api.photo_Server+res.data.data;
              this.dialogVideoVisible = false;
              this.dialogCoverScreenshotVisible=false;
            }else{
              this.$message.error('封面图上传失败');
            }
        });
      },
      //点击发布短视频
      submit(){
          this.isDisabled=true;
        if(this.form.title==''){
          this.$message.error('视频标题不能为空');
          this.isDisabled=false;
        }else{
          if(this.videoUrl==''){
            this.uploadVideo().then(res=>{
              this.publish();
            }).catch((res)=>{
              this.clearVideo("网络出错了！请重新上传！");
              this.isDisabled=false;
            });
          }else{
            this.publish();
          }
        }

      },
      publish(){
        var loading = this.$loading({
          lock: true,
          text: '正在发布，请稍候~~',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        var arr=[];
        this.selectGoods.forEach((item,i)=>{
          var tag;
          this.bubblingGoods.forEach(e=>{
            if(e.goods_id==item.goods_id){
              tag=e;
            }
          })
          if(tag==undefined){
              arr.push(JSON.parse(JSON.stringify(item)));
              arr[arr.length-1].is_show=0;
              arr[arr.length-1].show_time=0;
          }
        })
        var smData={
          act:11,
          url:this.videoUrl,
          //cover_time:'',
          goods:JSON.stringify(this.bubblingGoods.concat(arr)),
          cover:this.videoPoster,
          id:this.videoId,
          length:this.videoDuration,
          width:this.videoWidth,
          height:this.videoHeight,
          title:this.form.title,
          share_title:this.form.share_title,
          share_desc:this.form.share_desc,
        };

        if(this.videoId!=''&&this.videoId!=undefined){
            var posturl=this.api.edit_short_video;
        }else{
            var posturl=this.api.add_short_video;
        }
        this.api.request({
          url:posturl,
          data:smData,
          method:'post',
        }).then((res)=>{
          if(res.data.state.code=10200){
            this.$message.success('发布成功！');
            this.$router.replace({path: '/shortVideo'});
          }
          this.isDisabled=false;
          loading.close();
        }).catch(()=>{
          loading.close();
            this.isDisabled=false;
        });
      }
    }
  }
</script>
<style lang="less">
  @import url("../../../../node_modules/video.js/dist/video-js.css");

  #shortVideoEdit {
    padding-top: 20px;
    color:#606266;
    padding-bottom:50px;
    font-size:12px;
    .footerSubmit {
      background-color: rgba(0, 0, 0, 0.4);
      height: 50px;
      line-height: 50px;
      position: fixed;
      left: 260px;
      right: 0;
      bottom: 0;
      text-align: center;
      z-index: 10000;
      margin:0px;
    }
    .hidden {
      display: none !important;
    }
    .el-dialog{
      margin-bottom: 0px !important;
    }
    .tableList {
      max-height: 320px;
      overflow-y: auto;
    }
    .elProgress{
      position: fixed;
      top: 50%;
      left: 50%;
      margin-top: -100px;
      margin-left: -20px;
    }
    .bubblingItem{
      position: absolute;
      bottom: 5px;
      height:60px;
      overflow: hidden;
      left:0px;
      right:0px;
      width:50px;
      background: url('../../../img/video/shopbox.png') no-repeat;
    }
    .bubblingItem:hover,.bubblingItem.active{
      background: url('../../../img/video/shopselectHover.png') no-repeat;
    }

    .bubblingItem img{
      width: 38px;
      height: 38px;
      border-radius: 19px;
      margin-top: 9.5px;
      margin-left: 2px;
    }
    .bubblingItem:hover img,.bubblingItem.active img{
      width: 45px;
      height: 45px;
      border-radius: 22.5px;
      margin-top: 12.4px;
      margin-left: 2.5px;
    }

    .selectGoodsList{
      display:flex;
      align-content: center;
      flex-direction: row;
      justify-content:center;
      margin-bottom:20px;
      .active{
        border:2px solid #409EFF;border-radius:6px;
      }
      .selectGoodsList-item{
        width:98px;
        height:98px;
        position: relative;
        overflow:hidden;
        display: inline-block;
        margin-left: 10px;
        .selectGoodsBtn{
          position:absolute;
          top:50%;
          left:50%;
          margin-top:-16px;
          margin-left:-28px;
          z-index: 3;
        }
        .el-card-background{
          background:rgba(0,0,0,0.2) ;
          position:absolute;
          top:0px;
          left:0px;
          right:0px;
          bottom:0px;
          z-index: 2;
          border-radius:4px;
        }
      }
    }
    .goods-header {
      display: flex;
      flex-direction: row;
      align-content: center;
      .goods-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
      }
    }
    .btn-area {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 50px;
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      background: rgba(0, 0, 0, 0.3);
      z-index: 99;
    }
    .upload {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -20px;
      margin-left: -56px;
    }
    .alignCenter {
      text-align: center;
    }
    .videoPlay {
      position: relative;
      width: 800px;
      margin: 0px auto 20px;
      background: #000;
      min-height: 450px;
      video#my-video {
        max-height: 450px;
      }
    }
    .vjs-volume-panel-horizontal, .vjs-icon-placeholder {
      display: none !important;
    }
    .video-js .vjs-button {
      display: none;
    }
    .vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
      opacity: 1 !important;
    }
    .vjs-big-play-button{
      display: none;
    }
    #my-video .vjs-control-bar {
      margin-bottom: 50px;
    }
    .posterImg {
      position: absolute;
      top: 0px;
      right: 0px;
      left: 0px;
      bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      z-index: 9;
      background: #000;
      text-align: center;
      img{
        max-height: 450px;
        max-width:800px;
      }
    }
    .el-form {
      width: 800px;
      margin: 20px auto;
    }
  }
</style>
