<template>
    <div id="limitdiscount">

      <div class="btns">
        <el-button  type="primary" @click="synchronization()" v-if="userinfo.is_sub_shop&&userinfo.sync_flag">从总店同步</el-button>
        <el-button  type="primary" @click="newlimitdiscount()" v-if="userinfo.edit_flag">新建限时折扣</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
          <el-tab-pane label="所有促销" name="all"></el-tab-pane>
          <el-tab-pane label="未开始" name="nobegin"></el-tab-pane>
          <el-tab-pane label="进行中" name="conduct"></el-tab-pane>
          <el-tab-pane label="已结束" name="finished"></el-tab-pane>
        </el-tabs>
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
            label="有效时间">
            <template slot-scope="scope">
              {{scope.row.begin_time}}至{{scope.row.end_time}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="活动状态">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editLimitDiscount(scope.row.id)"  v-if="userinfo.edit_flag&&scope.row.from_parent==0">编辑</el-button>
              <el-button type="text" @click="editLimitDiscount(scope.row.id)" v-else>查看</el-button>
              <el-button type="text" @click="delLimitDiscount(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="alignCenter">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.page"
          layout="total, prev, pager, next, jumper"
          :page-size="pagination.pageSize"
          :total="pagination.total">
        </el-pagination>
      </div>
      <promotionCollection ref="promotionCollection" title="选择限时折扣同步" @comfirm="selectComfirm" :options="options"></promotionCollection>
    </div>
</template>

<script>
  import qs from 'qs';
  import promotionCollection from '../../../../components/promotionCollection.vue';
    export default {
        name: "limitdiscount",
      components:{
        promotionCollection,
      },
      data(){
          return {
            activeName:'all',
            tableData:[],
            options:{
              url:this.api.get_parent_discount_activities,
              params:{buid:sessionStorage.getItem('curuid')}
            },
            form:{
              buid:sessionStorage.getItem('curuid'),
              type:0
            },
            pagination:{
              page:1,
              pageSize:20,
              total:0,
              currentPage:1,
            },
            curuid:sessionStorage.getItem('curuid'),
            userinfo:JSON.parse(sessionStorage.getItem('userinfo'))
          }
      },
      created(){
        this.getList(1);
      },
      methods:{

        //点击从总店同步
        synchronization(){
          this.$refs['promotionCollection'].open();
        },
        //点击限时折扣同步确认
        selectComfirm(selectList){
          const loading = this.$loading({
            lock: true,
            text: '正在同步~~',
          });
          var smData={
            buid:this.curuid,
            ids:selectList.join(',')
          }
          this.api.request({
            url:this.api.async_parent_discount_activity,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({
                type:'success',
                message:'同步成功！'
              });
              this.getList(1);
              loading.close();
            }else{
              loading.close();
              this.$message.error(res.data.state.msg);
            }
          })
        },
        //选项卡切换触发事件
        handleClick(tab,event){
          this.pagination.page=1;
          this.pagination.total=0;
          if(tab.name=='all'){
            this.form.type=0;
          }else if(tab.name=='nobegin'){
            this.form.type=1;
          }else if(tab.name=='conduct'){
            this.form.type=2;
          }else if(tab.name=='finished'){
            this.form.type=3;
          }
          this.getList(this.pagination.page);
        },
        //新建限时折扣
        newlimitdiscount(){
          this.$router.push({path:'/promotion/limitdiscountAdd'});
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
            url:this.api.discount_list_data,
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
          this.$router.push({path:'/promotion/limitdiscountEdit/'+id});
        },
        //删除满减送
        delLimitDiscount(id){
          this.$confirm('此操作将永久删除该促销, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var loading = this.$loading({
              lock: true,
              text: '正在删除该限时折扣，请稍候~~',
              background: 'rgba(255, 255, 255, 0.7)'
            });
            var smData={
              buid:this.curuid,
              id:id,
            };
            this.api.request({
              url:this.api.del_discount,
              params:smData
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.getList(this.pagination.page);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
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
  #limitdiscount{
    position: relative;
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
    .btns{
      text-align: right;
      position:absolute;
      right:0px;
      z-index: 2;
    }
    .mybutton{
      position: absolute; z-index: 999;
      right:0px;
      top:0px;
    }
    .alignCenter{
      text-align: center;
    }
  }

</style>
