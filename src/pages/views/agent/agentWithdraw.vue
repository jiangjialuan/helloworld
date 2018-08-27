<template>
  <div id="agentWithdraw">
    <!--筛选-->
    <el-form :inline="true" :model="filterCriteria">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="filterCriteria.date_picker"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="编号:">
        <el-input v-model="filterCriteria.id" placeholder="编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请人电话:">
        <el-input v-model="filterCriteria.mobile_phone" placeholder="申请人电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="filterCriteria.status" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="待打款" value="0"></el-option>
          <el-option label="已打款" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="agentWithdraw(1)">筛选</el-button>
      </el-form-item>
    </el-form>
    <!--操作-->
    <div>
      <el-button @click="batchMoney">批量打款</el-button>
    </div>
    <!--内容主体-->
    <el-table :data="agentWithdrawData" ref="agentWithdrawData" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="checkboxIsDisabled"></el-table-column>
      <el-table-column label="编号" prop="id"></el-table-column>
      <el-table-column label="申请人">
        <template slot-scope="scope">
          <p>微信昵称:{{scope.row.name}}</p>
          <p>电话:{{scope.row.mobile_phone}}</p>
        </template>
      </el-table-column>
      <el-table-column label="提现金额">
        <template slot-scope="scope">
          <p>￥<span class="active">{{scope.row.money}}</span></p>
        </template>
      </el-table-column>
      <el-table-column label="银行卡信息">
        <template slot-scope="scope">
          <p>卡号:{{scope.row.card_no}}</p>
          <p>开户行:{{scope.row.bank_name}}</p>
          <p>姓名:{{scope.row.card_holder}}</p>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="create_time"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <p v-if="scope.row.status==1">已打款</p>
          <el-button type="text" size="small" v-else-if="scope.row.status==0" @click="confirmPay(scope.row)">确认打款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :current-page="currentPage"
      :total="total_count"
      :page-count="total_page"
      @current-change="agentWithdraw">
    </el-pagination>
    <!--确认打款二次确认-->
    <el-dialog
      title="提示"
      :visible.sync="showConfirmDialog"
      width="300px"
      center>
      <p style="text-align: center">打款二次确认</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="showConfirmDialog=false">取 消</el-button>
        <el-button type="primary" @click="confirmPaySecond">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量打款二次确认-->
    <el-dialog
      title="提示"
      :visible.sync="showAllConfirmDialog"
      width="300px"
      center>
      <p style="text-align: center">批量打款二次确认</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="showAllConfirmDialog=false">取 消</el-button>
        <el-button type="primary" @click="allConfirmPay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        filterCriteria: {
          date_picker: '',
          id: '',
          status: '-1',
          mobile_phone: ''
        },
        agentWithdrawData: [],
        currentPage: sessionStorage.getItem("agentWithdrawPage") == null ? 1 : parseInt(sessionStorage.getItem("agentWithdrawPage")),
        total_count: 0,
        total_page: 0,
        selectedId: [],
        showConfirmDialog: false,
        showAllConfirmDialog: false,
        confirmPayRow: {},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    mounted() {
      // 获取提现管理数据
      this.agentWithdraw(this.currentPage);
    },
    methods: {
      //获取提现列表
      agentWithdraw(page) {
        if (this.filterCriteria.date_picker == null) this.filterCriteria.date_picker = "";
        this.api.request({
          url: this.api.business_withdraw_log,
          data: {
            act: 11,
            from_time: this.filterCriteria.date_picker[0],
            end_time: this.filterCriteria.date_picker[1],
            id: this.filterCriteria.id,
            mobile_phone: this.filterCriteria.mobile_phone,
            status: this.filterCriteria.status,
            page: page
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.agentWithdrawData = res.data.data.list;
            this.total_count = res.data.data.total_count;
            this.total_page = res.data.data.total_page;
            sessionStorage.setItem("agentWithdrawPage", page);
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //代理提现确认打款
      confirmPay(row) {
        this.confirmPayRow = row;
        this.showConfirmDialog = true;
      },
      //代理提现二次确认打款
      confirmPaySecond() {
        this.api.request({
          url: this.api.confirm_remit,
          data: {
            act: 11,
            ids: JSON.stringify(this.confirmPayRow.id)
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.confirmPayRow.status = 1;
            this.$message.success(res.data.state.msg);
            this.showConfirmDialog = false;
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //多选按钮发生改变
      handleSelectionChange(val) {
        this.selectedId = val;
      },
      //判断checkbox是否禁用
      checkboxIsDisabled(row, index) {
        if (row.status == 0) {//未打款是0，return true可选
          return true
        } else if (row.status == 1) {//已打款是1，return false不可选
          return false
        }
      },
      //点击批量打款
      batchMoney(){
          if(this.selectedId.length<=0){
            this.$message.error("请勾选要打款的对象");
          }else{
            this.showAllConfirmDialog=true;
          }
      },
      //代理提现批量打款
      allConfirmPay() {
        let selectedIdString = '';
        for (let i = 0; i < this.selectedId.length; i++) {
          selectedIdString += ',' + this.selectedId[i].id;
        }
        if(selectedIdString==''){
          this.$message.error("请勾选要打款的对象");
          this.showAllConfirmDialog = false;
          return false;
        }
        this.api.request({
          url: this.api.confirm_remit,
          data: {
            act: 11,
            ids: selectedIdString.substr(1)
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            for (let i = 0; i < this.selectedId.length; i++) {
              this.selectedId[i].status = 1;
            }
            this.$refs.agentWithdrawData.clearSelection();
            this.$message.success(res.data.state.msg);
            this.showAllConfirmDialog = false;
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  #agentWithdraw{
    font-size:12px;
    color:#303133;
    .active{
      color:#f60;
      line-height: 40px;
      font-size:14px;
    }
    .el-form-item label{
      font-size:12px;
    }
    .el-pagination{
      text-align: center;
      padding:10px;
    }
    .el-table,.el-button,.el-input{
      font-size:12px;
    }
    .el-date-editor .el-range-input, .el-date-editor .el-range-separator,input{
      font-size:12px !important;
    }
  }
</style>
