<template>
  <el-dialog id="promotionCollection" :title="title" :visible.sync="dialogSelectGoodsVisible"  :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
    <div class="tableList" @scroll.passive="getMore($event);">
      <el-table :data="tableList" :show-header="false">
        <el-table-column type="expand">
          <template slot-scope="props">
            <table class="el-table last"  cellspacing="0" cellpadding="0" border="0">
              <tr  v-for="(childitem,idx) in props.row.goods" :key="'childitem'+idx">
                <td>
                  <div class="goods-header">
                    <div class="goods-image">
                      <img alt="" :src="childitem.image" width="60" height="60">
                      <span v-if="childitem.sell==1">下架</span>
                      <span v-else class="parentIcon">总店</span>
                    </div>
                    <div class="goods-info">
                      <p class="goods-info-title">{{ childitem.wname }}</p>
                    </div>
                  </div>
                </td>
                <td width="55" class="alignCenter" >
                  <p v-if="childitem.on_sale">已同步</p>
                  <p v-else>未同步</p>
                </td>
              </tr>
              <tr v-if="props.row.goods.length<=0">
                <td class="alignCenter" colspan="2">暂时没有商品</td>
              </tr>
            </table>
          </template>
        </el-table-column>
        <el-table-column
          label="活动名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="" width="40">
          <template slot-scope="scope">
            <el-checkbox-group v-model="selectList">
              <el-checkbox :label="scope.row.id" :disabled="checkboxIsDisabled(scope.row.id)"></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogSelectGoodsVisible = false">取 消</el-button>
      <el-button type="primary" @click="selectGoodsComfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "promotionCollection",
      data(){
          return {
            dialogSelectGoodsVisible:false,
            screeHeight:window.innerHeight,
            tableList:[],
            has_next:true,
            loading:true,
            page:1,
            selectList:[],
            curuid:sessionStorage.getItem('curuid'),
          }
      },
      props: {
          title:'',
          options:{},
          limit:'',
      },
      watch: {
        limit:{
          handler(newValue, oldValue) {
          },
          deep: true
        },
      },
      methods:{
        //判断checbox是否禁用
        checkboxIsDisabled(id){
          if(this.imit==''||this.limit==undefined||this.limit==null){
            return false;
          }else{
            if(this.selectList.length>=this.limit){
              if(this.selectList.indexOf(id)>=0){
                return false;
              }else{
                return true;
              }
            }else{
              return false;
            }
          }
        },
        //打开弹框
        open(){
          this.tableList=[];
          this.page=1;
          this.has_next=true;
          this.selectList=[];
          this.getpromotionList();
          this.dialogSelectGoodsVisible=true;
        },

        //获取商品列表数据
        getpromotionList(){
          if(this.has_next&&this.loading){
            this.loading=false;
            var smData=this.options.params;
            smData.page=this.page;
            this.api.request({
              url:this.options.url,
              params:smData,
            }).then(res => {
              if (res.data.state.code == 10200) {
                if(this.tableList.length>0){
                  this.tableList = this.tableList.concat(res.data.data.list);
                }else
                  this.tableList = res.data.data.list;
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
        },

        //下拉加载更多
        getMore(e){
          if(e.srcElement!=undefined){
            if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
              this.getpromotionList();
            }
          }else{
            if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
              this.getpromotionList();
            }
          }
        },

        //选择活动确认事件
        selectGoodsComfirm(){
          if(this.selectList.length<=0){
            this.$message.error("请选择同步的活动！");
          }else{
            this.$confirm('如果活动中包含总店未同步的商品将会自动同步, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('comfirm',this.selectList);
              this.dialogSelectGoodsVisible=false;
            }).catch();

          }
        },
      }
    }
</script>

<style lang="less">
  #promotionCollection{
    .el-table__expanded-cell[class*=cell]{
      padding:0px 20px !important;
    }
   .last{
      tr:last-child{
        td{
          border:none !important;
        }
      }
    }
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
    .goods-info-title{
      word-wrap:break-word;
      max-width: 80%;
    }
    td .el-checkbox__label{
      display: none;
    }
    .goods-image{
      position: relative;
      height:60px;
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
