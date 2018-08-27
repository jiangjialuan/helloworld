<template>
    <div id="photodetail">
      <div class="theme">{{name}}</div>
      <div class="bar" style="text-align: right; margin-top:-54px;">
        <el-button  slot="trigger"  type="primary" @click="openupload" :disabled="!showCheckobx==0?true:false">上传图片</el-button>
        <el-button style="margin-left:10px;"  type="info" @click="batchManage" v-if="!showCheckobx" :disabled="tableData.length==0?true:false">批量管理</el-button>
        <el-button @click="completeManage" type="info" v-else>完成管理</el-button>
      </div>
      <div class="photolist">
        <div style="padding:10px;height:42px;" v-if="showCheckobx">
          <el-checkbox v-model="checkAll" style="float:left;" @change="handleCheckAllChange" :disabled="tableData.length==0?true:false">全选</el-checkbox>
          <el-button @click="delphotos" style="float:right;" size="mini" :disabled="tableData.length==0?true:false">删除</el-button>
        </div>
        <el-card class="box-card photos" v-for="(item,index) in tableData" :key="'showreel'+index" v-if="tableData.length>0">
          <div class="photoblock">
            <div class="imgbox">
              <img :src="item.image|imgFun" @click="enlarge(item.image)"/>
            </div>
            <div class="album-ft">
              <p class="title">{{item.createtime}}</p>
            </div>
          </div>
          <span class="downmenue" @click="delphotos(item.id,index)" v-if="!showCheckobx">
             <i class="icon el-icon-delete"></i>
          </span>
          <div class="checkbox" v-if="showCheckobx">
            <el-checkbox-group v-model="checkedPhotos" @change="handleCheckedCitiesChange">
             <el-checkbox :label="item"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <div  v-if="tableData.length<=0&&isloading" class="alignCenter">
          <el-card class="box-card photos">
            <div class="addphotos hasbg"  @click="openupload">
            </div>
          </el-card>
        </div>
      </div>
      <div class="block alignCenter">
        <el-pagination
          @current-change="getList"
          :current-page.sync="pagination.currentpage"
          :page-size="pagination.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
      <el-dialog title="上传照片" :visible="dialogFormVisible" :show-close="false"  :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
        <div style="margin-top:-20px;margin-bottom:20px;">
          <p>请上传格式为jpeg/jpg/png的图片，图片小于２M，建议宽高比为3:4</p>
        </div>
        <div class="photobox">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :multiple="true"
            list-type="picture-card"
            :action="uploadOptions.url"
            :data="uploadOptions.data"
            :limit="30-pagination.total"
            name="headpic[]"
            :file-list="fileList"
            :on-change="uploadChange"
            :on-remove="handleRemove"
            :on-exceed="exceedFun"
            :before-upload="handlePictureCardbefore"
            :on-success="handlePictureSuccess"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon">
            </i>
            <p style="margin-top: -120px;">按住Ctrl可多选</p>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"  @click="submitUpload">开始上传</el-button>
        </div>
      </el-dialog>
      <div class="el-loading-mask is-fullscreen" :class="percent==0||percent==100?'hidden':''" style="margin: 0px;">
        <el-progress class="elProgress" type="circle" :percentage="percent" ></el-progress>
      </div>
      <div class="viewbig" @click="hideview" v-show="imgsrc==''?false:true" :style="'line-height:'+screeHeight+'px'">
        <img :src="imgsrc"/>
      </div>
      <div class="footerSubmit"><button type="button" class="el-button el-button--primary" @click="returnBack"><span>返回作品集</span></button></div>
    </div>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "workphotodetail",
      data(){
          return {
            sid:this.$route.params.id,
            name:this.$route.query.name,
            curuid:sessionStorage.getItem('curuid'),
            tableData:[],
            pagination:{
              currentpage:1,
              pagesize:10,
              total:0
            },
            uploadOptions:{
              url:this.api.upload_img,
              data:{
                path_code:'24',
                data_type:'html'
              }
            },
            imgsrc:'',
            fileList:[],
            image:[],
            dialogFormVisible:false,
            screeHeight:window.innerHeight,
            showCheckobx:false,
            checkAll:false,
            checkedPhotos:[],
            percent:0,
            isloading:false,
            oldtime:true,
            expands:this.$route.query.expand
          }
      },
      computed:{
      },
      created(){
        this.getList(this.pagination.currentpage);
      },
      filters:{
        imgFun:function(val){
          var str='',result;
          if(val.indexOf('.jpg')>0){
            str=val.replace('.jpg','');
            result = str+"_3x4."+'jpg';
          }
          else if(val.indexOf('.jpeg')>0){
            str=val.replace('.jpeg','');
            result = str+"_3x4."+'jpeg';
          }
          else if(val.indexOf('.png')>0){
            str=val.replace('.png','');
            result = str+"_3x4."+'png';
          }else {
            result = val;
          }
          return result;
        }
      },
      methods:{
        //禁止重复点击
        throttle(currenttime){
          if(this.oldtime==currenttime){
            return true;
          }else{
            return false;
          };
        },
          //打开上传框
        openupload(){
          if(this.pagination.total==30){
            this.$message.error('最多只能上传30张，不能再上传了！');
          }else{
            this.fileList=[];
            this.dialogFormVisible=true;
          }

        },

        //获取作品集图片列表
        getList(page){
          var smData={};
          this.checkedPhotos=[];
          this.checkAll=false;
          smData.buid=this.curuid;
          smData.sid=this.sid;
          smData.page=page;
          this.api.request({
            url:this.api.showreel_image_list_data,
            params:smData
          }).then((res)=>{
            if(res.data.state.code==10200){
              if(page>1&&res.data.data.list.length==0){
                this.getList(page-1);
              }else{
                if(page==1&&res.data.data.list.length==0){
                  this.showCheckobx=false;
                }
                  this.tableData=res.data.data.list;
                  this.pagination.currentpage=res.data.data.page;
                  this.pagination.pagesize=res.data.data.per_page;
                  this.pagination.total=res.data.data.total_count;
                  this.isloading=true;
              }
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //图片上传前触发函数
        handlePictureCardbefore(filelist){
          var arr=[];
          filelist.forEach(file=>{
            if(file.size/1024/1024>2){
            }else{
              if(file.raw.type=='image/jpeg'){
                arr.push(file);
              }else if(file.raw.type=='image/png') {
                arr.push(file);
              }else  if(file.raw.type=='image/jpg'){
                arr.push(file);
              }else{
              }
            }
          });
          return arr;
        },
        //图片上传成功时触发的函数
        handlePictureSuccess(res, file){
          this.image.push(this.api.photo_Server+res.data);
          if(this.image.length==this.fileList.length){
            this.savephotos();
          }
        },
        //保存作品图片
        savephotos(flag){
          var smData={};
          smData.buid=this.curuid;
          smData.sid=this.sid;
          smData.image=this.image.join(',');
          this.api.request({
            url:this.api.goods_showreel_image_store,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.getList(this.pagination.currentpage);
              var message='上传成功！';
              this.$message({
                type:'success',
                message:message
              });
              this.dialogFormVisible=false;
              this.fileList=[];
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //删除作品集图片
        delphotos(id,index){
          this.$confirm('此操作将永久删除该作品集图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var smData={};
            smData.buid=this.curuid;
            if(index==undefined||index==null){
              var arr=[];
              this.checkedPhotos.forEach(item=>{
                arr.push(item.id);
              });
              smData.id=arr.join(',');
            }else{
              smData.id=id;
            }
            this.api.request({
              url:this.api.del_showreel_image,
              params:smData
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getList(this.pagination.currentpage);
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },
        //上传图片系列函数
        submitUpload() {
          if(this.throttle(true)){
            this.oldtime=false;
            if(this.fileList.length>0){
              if(30-this.pagination.total-this.fileList.length>=0){
                var arr=this.handlePictureCardbefore(this.fileList);
                if(arr.length>0){
                  this.image=[];
                  this.percent=0.1;
                  let formData = new FormData();
                  arr.forEach(item=>{
                    formData.append('headpic[]',item.raw);
                  });
                  formData.append('path_code',24);
                  var loading;

                  this.api.request({
                    url:this.api.upload_img,
                    method:'post',
                    headers: {'Content-Type': 'multipart/form-data'},
                    data:formData,
                    onUploadProgress:(progressEvent)=>{
                      if(progressEvent.lengthComputable) {
                        this.percent=Math.round(progressEvent.loaded/progressEvent.total*100);
                        if(this.percent==100){
                          loading = this.$loading({
                            lock: true,
                            text:arr.length<this.fileList.length?'部分图片因格式或大小不匹配,须重新上传，其它图片正在保存，请稍后~~~':'正在保存图片，请稍候~~',
                            background: 'rgba(255, 255, 255, 0.7)'
                          });
                        }
                      }
                    }
                  }).then((res)=>{
                    if(res.data.state.code==10200){
                      loading.close();
                      if(arr.length==1){
                        this.image.push(this.api.photo_Server+res.data.data);
                      }else{
                        res.data.data.forEach((item)=>{
                          this.image.push(this.api.photo_Server+item);
                        });
                      }
                      this.savephotos();
                      this.fileList=[];
                      this.percent=0;
                      this.oldtime=true;
                    }else{
                      this.$message.error(res.data.state.msg);
                      this.oldtime=true;
                    }
                  });
                }else{
                  this.$message.error('图片格式或者大小不匹配，请重新上传');
                  this.oldtime=true;
                }
              }else{
                this.$message.error('本次最多只能再上传'+parseInt(30-this.pagination.total)+'张！');
                this.oldtime=true;
              }
            }else{
              this.$message.error('请先选择图片！');
              this.oldtime=true;
            }

          }
        },
        uploadChange(file){
          this.fileList.push(file);
        },
        handleRemove(file, fileList) {
          this.fileList=fileList;
        },
        exceedFun(files, fileList){
          this.$message.error('本次最多只能再上传'+parseInt(30-this.pagination.total)+'张！');
        },
        //点击批量管理
        batchManage(){
          this.showCheckobx=true;
          this.checkAll=false;
        },
        //完成批量管理
        completeManage(){
          this.showCheckobx=false;
        },

        //全选change事件
        handleCheckAllChange(val){
          this.checkedPhotos = val ? this.tableData : [];
        },
        //单个checkbox-change事件
        handleCheckedCitiesChange(value){
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.tableData.length;
        },
        //查看原图
        enlarge(src){
          this.imgsrc=src;
        },
        //关闭原图
        hideview(){
          this.imgsrc='';
        },
        //返回作品集
        returnBack(){

          this.$router.push({'path':'/mall/photolist',query:{'expand':this.expands}});
        }
      },
    }
</script>

<style lang="less">
#photodetail{
  color:#606266;
  font-size:12px;
  padding-bottom:50px;
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
  .viewbig{
    position: absolute;
    z-index: 10000;
    background-color: rgba(0,0,0,.6);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    text-align: center;
    margin: 0px !important;
    line-height: 100%;
    img{
      max-width:100%;
      max-height:100%;
      vertical-align: middle;
    }
  }
  .photolist{
    background: #fff;
    margin: 0px !important;
    padding:20px;
  }
  .elProgress{
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -20px;
  }
  .theme{
    font-size: 22px;
    line-height: 24px;
  }
  .alignCenter{
    text-align: center;
  }
  .elupload{
    display: inline-block;
  }
  .el-checkbox__inner{
    width:20px;
    height:20px;
  }
  .el-checkbox__inner::after{
    left:5px;
    height:12px;
    top:1px;
    width:6px;
  }
  .photobox{
    height:400px;
    overflow:auto;

  }
  .photos{
    padding:5px;
    /*width:125px;*/
    display: inline-block;
    margin-right:20px;
    position: relative;
    margin-bottom:20px;
    .checkbox{
      position:absolute;
      top:10px;
      left:10px;
      .el-checkbox__label{
        display: none;
      }
    }
    &:hover{
      .downmenue{
        display: block;
      }
      .downmenue-child{
        display: block;
      }
    }
    .downmenue{
      position: absolute;
      z-index: 50;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #D6D6D6;
      box-shadow: 0 0 2px rgba(0,0,0,.15);
      text-align: center;
      line-height: 20px;
      top: 6px;
      right: 6px;
      display: none;
    }

    .addphotos{
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
      height: 160px;
      cursor: pointer;
      line-height: 160px;
      vertical-align: top;
      text-align: center;
      font-size: 24px;
      &.hasbg{
        background: url('../../../../img/mall/bgimg.png') no-repeat center;
        width:300px;
        height:400px;
      }
    }
    .el-card__body{
      padding:0px;
    }
    .imgbox{
      height:165px;
      width:125px;
      position:relative;
      box-sizing: border-box;
      img{
        height:165px;
        width: 125px;
      }
      .pic-num{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 115px;
        height: 50px;
        color: #fff;
        text-align: right;
        line-height: 62px;
        font-size: 32px;
        padding-right: 5px;
        background-image: linear-gradient(rgba(255,255,255,0),rgba(26,26,26,.4));
      }

    }
    .album-ft{
      padding: 10px 0 3px;
      .title{
        width:100%;
        height:21px;
        line-height: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        i.icon{
          position: absolute;
          top: 2px;
          left: 2px;
          display: inline-block;
          font-size: 0;
          width: 16px;
          height: 16px;
          background-repeat: no-repeat;
          font-style: normal;
          font-weight: normal;
        }
      }
    }
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin:0px;
    border:none;
    &:hover .avatar-del{
      opacity: 1;
    }
  }
  .el-upload--picture-card,.el-upload-list__item{
    width: 120px;
    height: 160px;
  }
  .el-upload-list__item{
    border-radius:4px;
  }
  .avatar-uploader{
    vertical-align: top;
    overflow: hidden;
    background-color: #fff;
    border-radius: 6px;
    box-sizing: border-box;
    width: 120px;
    height: 160px;
    margin: 0 8px 8px 0;
    display: inline;

  }
  .avatar-del{
    position: absolute;
    width: 34px;
    height: 34px;
    top: 0;
    right: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;

    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    .delitem{
      position: static;
      font-size: inherit;
      color: inherit;
      i.el-icon-delete{
        font-family: element-icons!important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
      }
      &::after{
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
      }
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 4px;
    box-sizing: border-box;
    width: 120px;
    height: 160px;
    line-height: 146px;
    vertical-align: top;
  }
}
</style>
