<template>
  <el-dialog id="homeShopVideoCollection" title="选择视频同步" :visible.sync="dialogSelectGoodsVisible"  :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
    <div class="tableList" @scroll.passive="getMore($event);">
      <table class="el-table el-table--border" cellspacing="0" cellpadding="0" border="0">
        <tr  v-for="(childitem,idx) in videoList" :key="'childitem'+idx">
          <td>
            <div class="goods-header">
              <div class="goods-image">
                <img alt="" :src="childitem.cover">
                <span class="parentIcon">总店</span>
              </div>
              <div class="goods-info">
                <p class="goods-info-title">{{ childitem.title }}</p>
                <p class="goods-info-sub">上传于：{{childitem.create_time}}</p>
                <p class="goods-info-sub">点赞：{{childitem.thumbsup_number}}&nbsp;&nbsp;评论：{{childitem.remark_count}}</p>
              </div>
            </div>
          </td>
          <td width="55" class="alignCenter" >
            <el-checkbox-group v-model="selectGoods">
              <el-checkbox :label="childitem.id" ></el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
        <tr v-if="!loading">
          <td class="alignCenter" colspan="2">正在加载~~</td>
        </tr>
        <tr v-if="!has_next&&videoList.length>10">
          <td class="alignCenter" colspan="2">已加载全部视频</td>
        </tr>
        <tr v-if="videoList.length<=0">
          <td class="alignCenter" colspan="2" >暂时没有视频</td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogSelectGoodsVisible = false">取 消</el-button>
      <el-button type="primary" @click="selectGoodsComfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "homeShopVideoCollection",
      data(){
          return{
            screeHeight:window.innerHeight,
            dialogSelectGoodsVisible:false,
            videoList: [],
            selectGoods:[],
            has_next:true,
            page:1,
            loading:true,
            oldtime:'',
            curuid:sessionStorage.getItem('curuid'),
          }
      },
      props: {
        hasAdd:'',
      },
      methods: {

        //打开弹框
        open(){
          this.videoList=[];
          this.page=1;
          this.has_next=true;
          this.getList();
          this.dialogSelectGoodsVisible=true;
        },
        //禁止重复点击
        throttle(currenttime){
          if(this.oldtime==''){
            this.oldtime=currenttime;
            return true;
          }else{
            if(currenttime-this.oldtime<100){
              this.oldtime=currenttime;
              return false;
            }else{
              this.oldtime=currenttime;
              return true;
            }
          };
        },
        //获取商品列表数据
        getList(){
          if(this.throttle(new Date().getTime())){
            if(this.has_next&&this.loading){
              this.loading=false;
              this.api.request({
                url: this.api.parent_short_video,
                params: {
                  buid:this.curuid,
                  page:this.page
                },
              }).then(res => {
                if (res.data.state.code == 10200) {
                  if(this.videoList.length>0){
                    this.videoList = this.videoList.concat(res.data.data.list);
                  }else
                    this.videoList = res.data.data.list;
                  this.has_next=res.data.data.has_next;
                  this.page=this.page+1;
                  this.loading=true;
                } else if (res.data.state.code == 10400) {
                  this.$message.error(res.data.state.msg);
                } else if (res.data.state.code == 10401) {
                  this.$message.error(res.data.state.msg);
                }
              }).catch(err => {
                this.$message.error(err);
              })
            }
          }
        },
        //下拉加载更多
        getMore(e){
          debugger;
          if(e.srcElement!=undefined){
            if (e.srcElement.scrollHeight-(e.srcElement.scrollTop + e.srcElement.offsetHeight) <=200&&this.loading) {
              this.getList();
            }
          }else{
            if (e.target.scrollHeight-(e.target.scrollTop + e.target.offsetHeight)<=200&&this.loading) {
              this.getList();
            }
          }
        },
        //选择商品确认事件
        selectGoodsComfirm(){
          if(this.selectGoods.length<=0){
            this.$message.error("请选择商品！");
          }else{
            this.$emit('comfirm',this.selectGoods);
            this.dialogSelectGoodsVisible=false;
          }
        }
      }
    }
</script>

<style lang="less">
#homeShopVideoCollection{
  .tableList {
    max-height: 320px;
    overflow-y: auto;
  }
  .alignCenter{
    text-align: center;
  }
  td{
    word-break: break-all;
  }
  td .el-checkbox__label{
    display: none;
  }
  .goods-image{
    position: relative;
    width:60px;
    min-width: 60px;
    height:60px;
    text-align: center;
    line-height: 58px;
    background: #222;
    img{
      max-height: 60px;
      max-width:60px;
      vertical-align: middle;
    }
  }
  .parentIcon{
    display: inline-block;
    width:32px;
    height:18px;
    line-height: 18px;
    border-radius:1px;
    background: rgba(0,0,0,0.5);
    font-size:10px;
    position: absolute;
    bottom:3px;
    right:3px;
    color:#fff;
    text-align: center;
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
  .goods-info{
    width:100%;
    justify-content: center;
    display: flex;
    flex-direction: column;
    p{
      overflow : hidden;
      text-overflow: ellipsis;
      align-items: center;
      justify-content: center;
      line-height: 20px;
      &.wname{
        margin-bottom: 10px;
      }
      &.price{
        color:#f60;
        font-size:16px;
      }
    }
  }
}
</style>
