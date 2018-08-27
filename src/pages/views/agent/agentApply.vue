<template>
  <div id="agentApply">
    <!--筛选-->
    <el-form :inline="true" :model="filterCriteria" class="demo-form-inline">
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
      <el-form-item label="姓名:">
        <el-input v-model="filterCriteria.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话:">
        <el-input v-model="filterCriteria.mobile_phone" placeholder="电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="filterCriteria.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="已拒绝" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="agentApply(1)">筛选</el-button>
      </el-form-item>
    </el-form>
    <!--内容主体-->
    <el-table :data="agentApplyData" stripe>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="create_time" label="申请时间"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="mobile_phone" label="电话"></el-table-column>
      <el-table-column prop="weixin" label="微信"></el-table-column>
      <el-table-column prop="consult" label="咨询内容"></el-table-column>
      <el-table-column label="状态/操作">
        <template slot-scope="scope">
          <template v-if="scope.row.status==0">
            <p>申请中</p>
            <el-button size="mini" type="success" @click="applyPassOrReject(scope.row,1)">通过</el-button>
            <el-button size="mini" type="danger" @click="applyPassOrReject(scope.row,-1)">拒绝</el-button>
          </template>
          <p v-else-if="scope.row.status==1">通过</p>
          <p v-else-if="scope.row.status==-1">拒绝</p>
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
      @current-change="agentApply">
    </el-pagination>
    <!--审核通过拒绝二次确认-->
    <el-dialog
      title="提示"
      :visible.sync="showApplyPassOrRejectDialog"
      width="300px"
      center>
      <p style="text-align: center" v-if="applyPassOrRejectStatus==1">通过二次确认</p>
      <p style="text-align: center" v-else>拒绝二次确认</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="showApplyPassOrRejectDialog=false">取 消</el-button>
        <el-button type="primary" @click="applyPassOrRejectSecond">确 定</el-button>
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
          name: '',
          mobile_phone: '',
          status: ''
        },
        agentApplyData: [],
        currentPage: sessionStorage.getItem("agentApplyPage") == null ? 1 : parseInt(sessionStorage.getItem("agentApplyPage")),
        total_count: 0,
        total_page: 0,
        showApplyPassOrRejectDialog: false,
        applyPassOrRejectRow: {},
        applyPassOrRejectStatus: 0,
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
      this.agentApply(this.currentPage);
    },
    methods: {
      //获取代理申请列表
      agentApply(page) {
        if (this.filterCriteria.date_picker == null) this.filterCriteria.date_picker = "";
        this.api.request({
          url: this.api.get_agent_apply,
          data: {
            act: 11,
            from_time: this.filterCriteria.date_picker[0],
            end_time: this.filterCriteria.date_picker[1],
            name: this.filterCriteria.name,
            mobile_phone: this.filterCriteria.mobile_phone,
            status: this.filterCriteria.status,
            page: page
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.agentApplyData = res.data.data.list;
            this.total_count = res.data.data.total_count;
            this.total_page = res.data.data.total_page;
            this.currentPage = page;
            sessionStorage.setItem("agentApplyPage", page);
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //代理申请通过拒绝审核
      applyPassOrReject(row, status) {
        this.applyPassOrRejectRow = row;
        this.applyPassOrRejectStatus = status;
        this.showApplyPassOrRejectDialog = true;
      },
      //代理申请通过拒绝审核二次确认
      applyPassOrRejectSecond() {
        this.api.request({
          url: this.api.check_agent_apply,
          data: {
            act: 11,
            id: this.applyPassOrRejectRow.id,
            status: this.applyPassOrRejectStatus
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.agentApply(this.currentPage);
            this.$message.success(res.data.state.msg);
            this.showApplyPassOrRejectDialog = false;
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
  }
</script>

<style lang="less" scoped>
  #agentApply{
    font-size:12px;
    color:#303133;
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
