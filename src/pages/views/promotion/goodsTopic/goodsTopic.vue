<template>
  <div id="goodsTopic">
    <div class="btns">
      <el-button class="mybutton" type="primary" @click="synchronization()" v-if="userinfo.is_sub_shop&&userinfo.sync_flag">从总店同步</el-button>
      <el-button class="mybutton" type="primary"   @click="newlimitdiscount()" v-if="userinfo.edit_flag">新建商品专题</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="活动名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span><span v-if="scope.row.from_parent" class="parentIcon">总店</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editLimitDiscount(scope.row.id)" v-if="userinfo.edit_flag&&scope.row.from_parent==0">编辑</el-button>
            <el-button type="text" @click="editLimitDiscount(scope.row.id)" v-else>查看</el-button>
            <el-button type="text" @click="sortLimitDiscount(scope.row.id,'up')">上移</el-button>
            <el-button type="text" @click="sortLimitDiscount(scope.row.id,'down')">下移</el-button>
            <el-button type="text" @click="delLimitDiscount(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <promotionCollection ref="promotionCollection" title="选择商品专题同步(每个店最多只能开设6个专题)" @comfirm="selectComfirm" :options="options" :limit="6-tableData.length"></promotionCollection>
  </div>
</template>

<script>
  import promotionCollection from '../../../../components/promotionCollection.vue';
  import qs from 'qs';

  export default {
    name: "limitdiscount",
    components:{
      promotionCollection,
    },
    data(){
      return {
        activeName:'all',
        tableData:[],
        form:{
          buid:sessionStorage.getItem('curuid'),
          type:0,
          per_page:20,
        },
        pagination:{
          page:1,
          pageSize:20,
          total:0,
          currentPage:1,
        },
        options:{
          url:this.api.get_parent_goods_albums,
          params:{
            buid:sessionStorage.getItem('curuid')
          }
        },
        curuid:sessionStorage.getItem('curuid'),
        userinfo:JSON.parse(sessionStorage.getItem('userinfo'))
      }
    },
    created(){
      this.getList(1);
    },
    methods:{
      //同步弹框---同步弹框确认按钮事件
      selectComfirm(selectList){
        var loading = this.$loading({
          lock: true,
          text: '正在同步~~',
        });
        var smData={
          buid:this.curuid,
          ids:selectList.join(',')
        }
        this.api.request({
          url:this.api.async_parent_goods_album,
          method:'post',
          headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          data:qs.stringify(smData)
        }).then((res)=>{
          if(res.data.state.code==10200){
            this.$message({
              type:'success',
              message:'同步成功！'
            });
            loading.close();
            this.getList(1);
          }else{
            loading.close();
            this.$message.error(res.data.state.msg);
          }
        })
      },
      //点击从总店同步
      synchronization(){
        if(this.tableData.length>=6){
          this.$message.error('最多只能添加6个专题！');
        }else {
          this.$refs['promotionCollection'].open();
        }
      },
      //向上移动
      sortLimitDiscount(id,type){
        var smData={
          buid:this.curuid,
          id:parseInt(id),
          sort_type:type
        };
        var len=this.tableData.length;
        if(type=='up'){
          if(id==this.tableData[0].id){
            this.$message.error("已经排在最前面了！");
            return;
          }
        }else{
          if(id==this.tableData[len-1].id){
            this.$message.error("已经排在最下面了！");
            return;
          }
        }
        var loading = this.$loading({
          lock: true,
          text: '正在排序，请稍候~~',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        this.api.request({
          url:this.api.goods_album_sort,
          method:'post',
          headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          data:qs.stringify(smData)
        }).then((res)=>{
          if(res.data.state.code==10200){
            this.$message({
              type:'success',
              message:'排序成功！'
            });
            this.getList(1);
            loading.close();
          }else{
            loading.close();
            this.$message.error(res.data.state.msg);
          }
        });
      },
      //新建限时折扣
      newlimitdiscount(){
        if(this.tableData.length>=6){
          this.$message.error('最多只能添加6个专题！');
        }else{
          this.$router.push({path:'/promotion/goodsTopicAdd'});
        }
      },
      //页码变换时触发函数
      handleCurrentChange(page){
        this.getList(page);
      },
      //获取限时优惠列表
      getList(page){
        var smData=JSON.parse(JSON.stringify(this.form));
        smData.page=page;
        this.api.request({
          url:this.api.goods_album_list_data,
          params:smData
        }).then((res)=>{
          if(res.data.state.code==10200){
            this.tableData=res.data.data.list;
            this.pagination.page=page;
            this.pagination.total=res.data.data.total_count;
          }else{
            this.$message.error(res.data.state.msg);
          }
        })
      },
      //点击编辑触发事件
      editLimitDiscount(id){
        this.$router.push({path:'/promotion/goodsTopicEdit/'+id});
      },
      //删除商品专题
      delLimitDiscount(id){
        this.$confirm('此操作将永久删除该商品专题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var loading = this.$loading({
            lock: true,
            text: '正在删除商品专题，请稍候~~',
            background: 'rgba(255, 255, 255, 0.7)'
          });
          var smData={
            buid:this.curuid,
            id:id,
          };
          this.api.request({
            url:this.api.del_goods_album,
            params:smData
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.getList(this.pagination.page);
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList(this.pagination.page)
            }else{
              this.$message.error(res.data.state.msg);
            }
            loading.close();
          });
        }).catch();
      }
    },

  }
</script>

<style lang="less">
  #goodsTopic{
    //position: relative;
    .btns{
      text-align: right;
    }
    .parentIcon{
      display: inline-block;
      width:32px;
      height:18px;
      line-height: 18px;
      border-radius:1px;
      background: rgba(0,0,0,0.5);
      font-size:10px;
      color:#fff;
      text-align: center;
      margin-left:10px;
    }
    .mybutton{
      /*position: absolute; z-index: 999;
      right:0px;
      top:0px;*/
    }
    .alignCenter{
      text-align: center;
    }
  }

</style>
