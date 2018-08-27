<template>
  <div id="agentList">
    <!--头-->
    <div class="partnerCode">
      <div class="codeImg"><img :src="agentQrcode" height="138" width="138"/></div>
      <div class="codeTxt">
        <h3>邀请二维码</h3>
        <p class="tag">邀请他人扫码，即可成为您的代理</p>
        <p class="tag">你当前有<span class="active"> {{agent_users}}</span>位代理</p>
      </div>
    </div>
    <!--筛选-->
    <el-form :inline="true" :model="filterCriteria">
      <el-form-item label="昵称:">
        <el-input v-model="filterCriteria.name" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机:">
        <el-input v-model="filterCriteria.mobile_phone" placeholder="手机" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="agentList(1)">筛选</el-button>
      </el-form-item>
    </el-form>
    <!--内容主体-->
    <el-table :data="agentListData" stripe>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.head_pic" width="60px" height="60px">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="mobile_phone" label="手机"></el-table-column>
      <el-table-column prop="invited_time" label="添加日期"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :current-page="currentPage"
      :total="total_count"
      :page-count="total_page"
      @current-change="agentList">
    </el-pagination>
  </div>
</template>

<script>
  import noQrcodeImg from '../../../img/agentList/noQrcode.jpg'

  export default {
    data() {
      return {
        agent_users: JSON.parse(sessionStorage.getItem('userinfo')).agent_users,
        agentQrcode: '',
        activeName2:'first',
        agentListData: [],
        filterCriteria: {
          name: '',
          mobile_phone: ''
        },
        currentPage: sessionStorage.getItem("agentListPage") == null ? 1 : parseInt(sessionStorage.getItem("agentListPage")),
        total_count: 0,
        total_page: 0
      }
    },
    mounted() {
      this.api.request({
        url: this.api.getAgentQrcode + '?from_uid=' + JSON.parse(sessionStorage.getItem('userinfo')).uid,
      }).then(res => {
        if (res.data.state.code == 10200) {
          this.agentQrcode = res.data.data.url;
        } else if (res.data.state.code == 10400) {
          this.agentQrcode = noQrcodeImg;
          this.$message.error(res.data.state.msg);
        } else if (res.data.state.code == 10401) {
          this.$message.error(res.data.state.msg);
        }
      }).catch(err => {
        this.$message.error(err);
      });
      this.agentList(this.currentPage);
    },
    methods: {
      agentList(page) {
        this.api.request({
          url: this.api.get_business_agent,
          data: {
            act: 11,
            page: page,
            name: this.filterCriteria.name,
            mobile_phone: this.filterCriteria.mobile_phone
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.agentListData = res.data.data.list;
            this.total_count = res.data.data.total_count;
            this.total_page = res.data.data.total_page;
            sessionStorage.setItem("agentListPage", page);
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
  #agentList{
    font-size:12px;
    color:#303133;
    .active{
      color:#f60;
      line-height: 40px;
      font-weight:bold;
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
    .tag{
      color:#909399;
    }
    .partnerCode{
      display: flex;flex-direction: row;align-items: center;
      .codeImg{
        display: inline-block;
        margin-right:15px;
      }
      .codeTxt{
        line-height: 1.5rem;
      }
    }
  }

</style>
