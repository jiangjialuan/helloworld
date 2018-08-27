<template>
    <div id="couponList">
      <div class="btns">
        <!--<el-button  type="primary" @click="synchronization()" v-if="userinfo.is_sub_shop&&userinfo.sync_flag">从总店同步</el-button>-->
        <el-button  type="primary"  @click="newReward()" v-if="userinfo.edit_flag">新建优惠券</el-button>
      </div>

      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="未开始" name="nobegin"></el-tab-pane>
          <el-tab-pane label="进行中" name="conduct"></el-tab-pane>
          <el-tab-pane label="已结束（已过期）" name="finished"></el-tab-pane>
        </el-tabs>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span><span v-if="scope.row.from_parent" class="parentIcon">总店</span>
            </template>
          </el-table-column>
          <el-table-column

            label="优惠金额">
            <template slot-scope="scope">
              <p><span  class="active">{{scope.row.quota}}</span> 元</p>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="使用限制">
            <template slot-scope="scope">
              <p v-if="scope.row.type==1">不限</p>
              <p v-if="scope.row.type==2">最低消费满<span class="active">{{scope.row.min_order_money}}</span>元可用</p>
            </template>
          </el-table-column>
          <el-table-column
            label="数量（领取/剩余/库存）">
            <template slot-scope="scope">
              <p>{{scope.row.quantity_received}}/{{parseInt(scope.row.quantity)-parseInt(scope.row.quantity_received)}}/{{scope.row.quantity}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="有效期">
            <template slot-scope="scope">
              {{scope.row.begin_time}}至{{scope.row.end_time}}
            </template>
          </el-table-column>
          <el-table-column
            label="已使用">
            <template slot-scope="scope">
              <p>{{scope.row.quantity_used}} 人</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editReward(scope.row.id)" v-if="userinfo.edit_flag&&scope.row.from_parent==0">编辑</el-button>
              <el-button type="text" @click="editReward(scope.row.id)" v-else>查看</el-button>
              <el-button type="text" @click="delReward(scope.row.id)">删除</el-button>
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
      <couponCollection ref="couponCollection" title="选择优惠券同步" @comfirm="selectComfirm" :options="options"></couponCollection>
    </div>
</template>
<script>
  import qs from 'qs';
  import couponCollection from '../../../../components/promotionCollection.vue';
    export default {
        name: "couponList",
      data(){
          return{
            activeName:'all',
            form:{
              buid:sessionStorage.getItem('curuid'),
              status:0
            },
            tableData:[],
            pagination:{
              page:1,
              pageSize:20,
              total:0,
            },
            options:{
              url:this.api.get_parent_fullprivilege_activities,
              params:{buid:sessionStorage.getItem('curuid')}
            },
            userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
            curuid:sessionStorage.getItem('curuid'),
          }
      },
      created(){
        this.getList(1);
      },
      components:{
        couponCollection,
      },
      methods:{
//从总店同步
        synchronization(){
          this.$refs['couponCollection'].open();
        },
        //同步确认
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
            url:this.api.async_parent_fullprivilege_activity,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({
                type:'success',
                message:'同步成功！'
              });
              this.pagination.page=1;
              this.pagination.total=0;
              this.getList(this.pagination.page);
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
            this.form.status=0;
          }else if(tab.name=='nobegin'){
            this.form.status=1;
          }else if(tab.name=='conduct'){
            this.form.status=2;
          }else if(tab.name=='finished'){
            this.form.status=3;
          }
          this.getList(this.pagination.page);

        },
        //新建优惠券
        newReward(){
          this.$router.push({path:'/promotion/couponAdd'});
        },
        //页码变换时触发函数
        handleCurrentChange(page){
          this.getList(page);
        },
        //获取优惠券列表
        getList(page){
          var smData=JSON.parse(JSON.stringify(this.form));
          smData.page=page;
          this.api.request({
            url:this.api.coupon_list_data,
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
        editReward(id){
          this.$router.push({path:'/promotion/couponEdit/'+id});
        },
        //删除优惠券
        delReward(id){
          this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var loading = this.$loading({
              lock: true,
              text: '正在删除该优惠券，请稍候~~',
              background: 'rgba(255, 255, 255, 0.7)'
            });
            var smData={
              buid:this.curuid,
              id:id,
            };
            this.api.request({
              url:this.api.coupon_del,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
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
      }
    }
</script>

<style lang="less" scoped>
  #couponList{
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
    .active{
      color:#f60;
    }
  }

</style>
