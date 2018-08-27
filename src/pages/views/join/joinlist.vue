<template>
<div id="joinlist">
  <!--筛选-->
  <el-form :inline="true" :model="form" class="demo-form-inline">
    <el-form-item label="时间:">
      <el-date-picker
        v-model="form.date_picker"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="form.name" placeholder="姓名" clearable></el-input>
    </el-form-item>
    <el-form-item label="电话:">
      <el-input v-model="form.mobile" placeholder="电话" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getlist(1)">筛选</el-button>
    </el-form-item>
  </el-form>
  <!--内容主体-->
  <el-table :data="tablelist" stripe>
    <el-table-column prop="id" label="序号"></el-table-column>
    <el-table-column prop="create_time" label="申请时间"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column prop="wechat" label="微信"></el-table-column>
    <el-table-column prop="message" label="咨询内容"></el-table-column>
  </el-table>
  <!--分页-->
  <el-pagination
    background
    layout="total, prev, pager, next, jumper"
    :current-page="currentPage"
    :total="total_count"
    :page-count="total_page"
    @current-change="getlist">
  </el-pagination>
</div>
</template>

<script>
    export default {
        name: "joinlist",
      data(){
        return {
          form: {
            date_picker: '',
            name: '',
            mobile: '',
          },
          tablelist:[],
          currentPage:1,
          total_count:0,
          total_page:0
        }
      },
      created(){
        this.getlist(1);
      },
      methods:{
        //获取列表数据
        getlist(page){
          if(this.form.mobile!=''){
            var re1=/^(1(3|4|5|6|7|8|9)[0-9]{9})$/;
            var re2=/^(0\d{2,3}-\d{7,8})$/;
            if(!re1.test(this.form.mobile)&&!re2.test(this.form.mobile)){
              this.$message.error('请输入正确的手机号');
              return false;
            }
          }
          if (this.form.date_picker == null) this.form.date_picker = "";
          this.currentPage=page;
          this.api.request({
            url: this.api.get_enterprise_con_list,
            params: {
              act: 11,
              from_time: this.form.date_picker[0],
              end_time: this.form.date_picker[1],
              name: this.form.name,
              mobile_phone: this.form.mobile,
              page: page
            },
            //method: 'post'
          }).then(res => {
            if(res.data.state.code==10200){
              this.tablelist=res.data.data.list;
              this.total_count=res.data.data.total_count;
              this.total_page=res.data.data.total_page;
            }else{
              this.$message.error(res.data.state.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        }
      }
    }
</script>

<style lang="less">
  #joinlist{
    .el-pagination{
      text-align: center;
    }
    .el-table{
      width:auto;
    }
  }

</style>
