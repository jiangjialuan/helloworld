<template>
  <div id="earnings">
    <!--头-->
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card shadow="never">
          <p class="active alignCenter">￥{{week_income}}</p>
          <p class="alignCenter">7天收益（截止今日0点）</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <p class="active alignCenter">￥{{await_settlement}}</p>
          <p class="alignCenter">待结算</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <p class="active alignCenter">￥{{balance}}</p>
          <p class="alignCenter">可提现</p>
        </el-card>
      </el-col>
    </el-row>
    <!--tab标签页-->
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <!--收益统计tab-->
      <el-tab-pane label="收益统计" name="first">
        <!--筛选-->
        <el-form :inline="true" :model="filterCriteria_first">
          <el-form-item label="时间:">
            <el-date-picker
              v-model="filterCriteria_first.date_picker"
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
          <el-form-item>
            <el-button type="primary" @click="myEarnings">筛选</el-button>
          </el-form-item>
        </el-form>
        <div style="float: right;margin-top: -50px;"> 总收益:¥<span class="active">{{total_earned}}</span> </div>
        <!--内容主体-->
        <!--订单收益-->
        <el-table :data="orderIncomeData" stripe>
          <el-table-column prop="type" label="收益类型"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="order_num" label="完成订单数量"></el-table-column>
          <el-table-column prop="order_amount" label="完成订单总额(元)"></el-table-column>
          <el-table-column prop="earnings_amount" label="最终收益(元)"></el-table-column>
        </el-table>
      </el-tab-pane>
      <!--订单收益明细tab-->
      <el-tab-pane label="订单收益明细" name="second">
        <!--筛选-->
        <el-form :inline="true" :model="filterCriteria_second">
          <el-form-item label="时间:">
            <el-date-picker
              v-model="filterCriteria_second.date_picker"
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
          <el-form-item label="订单号:">
            <el-input v-model="filterCriteria_second.sn" placeholder="订单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="	买家昵称:">
            <el-input v-model="filterCriteria_second.nickname" placeholder="买家昵称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="orderEarnings(1)">筛选</el-button>
          </el-form-item>
        </el-form>
        <div style="float: right;margin-top: -50px;"> 总收益:<span class="active">¥{{earnings_amount}}</span> </div>
        <!--内容主体-->
        <el-table :data="orderIncomeDetailData" stripe>
          <el-table-column prop="sn" label="订单号"></el-table-column>
          <el-table-column prop="createtime" label="创建时间"></el-table-column>
          <el-table-column prop="receive_time" label="订单完成时间"></el-table-column>
          <el-table-column prop="username" label="买家昵称"></el-table-column>
          <el-table-column prop="order_money" label="实付金额(元)"></el-table-column>
          <el-table-column prop="agent_money" label="佣金支出"></el-table-column>
          <el-table-column prop="earnings_money" label="最终收益"></el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :current-page="order_currentPage"
          :total="order_total_count"
          :page-count="order_total_page"
          @current-change="orderEarnings">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        week_income: JSON.parse(sessionStorage.getItem('statisticsData')).week_income,
        await_settlement: JSON.parse(sessionStorage.getItem('statisticsData')).await_settlement,
        balance: JSON.parse(sessionStorage.getItem('statisticsData')).balance,
        activeName: 'first',
        total_earned: 0,
        orderIncomeData: [],
        //redPacketIncomeData: [],
        earnings_amount: 0,
        orderIncomeDetailData: [],
        order_currentPage: sessionStorage.getItem("earningsOrderPage") == null ? 1 : parseInt(sessionStorage.getItem("earningsOrderPage")),
        order_total_count: 0,
        order_total_page: 0,
        total_amount: 0,
        redPacketIncomeDetailData: [],
        red_total_count: 0,
        red_total_page: 0,
        filterCriteria_first: {
          date_picker: ''
        },
        filterCriteria_second: {
          date_picker: '',
          sn: '',
          nickname: ''
        },
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
    created(){
      this.getStatisticsData().then((statisticsData)=>{
        this.week_income = statisticsData.week_income;
        this.await_settlement= statisticsData.await_settlement;
        this.balance= statisticsData.balance;
      });
    },
    mounted() {
      // 收益统计
      this.myEarnings();
      // 订单收益明细
      this.orderEarnings(this.order_currentPage);
    },
    methods: {
      //获取商户概况statisticsData
      getStatisticsData() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.statistics_data + '?act=11'
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('statisticsData', JSON.stringify(res.data.data));
              resolve(res.data.data);
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg)
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      handleClick(tab, event) {
      },
      //收益统计
      myEarnings() {
        if (this.filterCriteria_first.date_picker == null) this.filterCriteria_first.date_picker = '';
        this.api.request({
          url: this.api.my_earnings,
          data: {
            act: 11,
            from_time: this.filterCriteria_first.date_picker[0],
            end_time: this.filterCriteria_first.date_picker[1]
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.total_earned = res.data.data.total_earned;
            this.orderIncomeData = res.data.data.order_earned;
            this.redPacketIncomeData = res.data.data.redenvelope_earned;
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //订单收益明细
      orderEarnings(page) {
        if (this.filterCriteria_first.date_picker == null) this.filterCriteria_first.date_picker = '';
        this.api.request({
          url: this.api.order_earnings,
          data: {
            act: 11,
            from_time: this.filterCriteria_second.date_picker[0],
            end_time: this.filterCriteria_second.date_picker[1],
            sn: this.filterCriteria_second.sn,
            nickname: this.filterCriteria_second.nickname,
            page: page
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.earnings_amount = res.data.data.earnings_amount;
            this.orderIncomeDetailData = res.data.data.list;
            this.order_total_count = res.data.data.total_count;
            this.order_total_page = res.data.data.total_page;
            sessionStorage.setItem("earningsOrderPage", page);
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  #earnings{
    font-size:12px;
    color:#303133;
    .active{
      color:#f60;
      line-height: 40px;
      font-weight:bold;
      font-size:16px;
    }
    .alignCenter{
      text-align: center;
    }
    .el-form-item label{
      font-size:12px;
    }
    .el-pagination{
      text-align: center;
      padding:10px;
    }
    .el-table{
      font-size:12px;
    }
    .el-button{
      font-size:12px;
    }
    .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
      font-size:12px;
    }
    /*块1*/
    .el-row {
      padding: 24px;
    }

    .el-col {
      border-radius: 4px;
    }

    .grid-content {
      border-radius: 4px;
      min-height: 36px;
      height: 100px;
    }

    .bg-purple {
      background: white;
    }
  }

</style>
