<template>
<div id="platformList">
  <top></top>
  <el-tabs v-model="activeName">
    <el-tab-pane label="平台概况" name="first">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="店铺ID"
          prop="anchorid"
          width="180">
        </el-table-column>
        <el-table-column
          label="店铺名"
          prop="name"
          width="180">
        </el-table-column>
        <el-table-column
          label="店铺logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" width="60" height="60"/>
          </template>
        </el-table-column>
        <el-table-column
          label="昨日收益（元）">
          <template slot-scope="scope">
            <p class="active">{{scope.row.income}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="管理员帐号">
        </el-table-column>
        <el-table-column prop="createtime"
                         label="添加日期">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="enterBranchShop(scope.row.phone,scope.row.name,scope.row.anchorid)">进入后台</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

</div>
</template>

<script>
  import top from '../platformTop.vue';
  export default {
    data(){
      return {
        tableData:[],
        userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
        activeName:'first',
        phone:'',
      }
    },
    components: {top},
    created(){
      this.getSubShop();
    },
    methods: {
      //切换平台必调接口
      switch_account(uid){
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.switch_account,
            params: {
              act: 11,
              manager_id: localStorage.getItem('loginUid'),
              uid: uid
            }
          }).then((res) => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('curuid', uid);
              localStorage.setItem('shopurl', res.data.data.shop_url.url);
              sessionStorage.setItem('hasDialog',0);
              resolve();
            } else {
              this.$message.error(res.data.data.msg);
            }
          })
        });
      },
      //获取用户信息
      getUserInfo(){
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.userinfo + '?act=11',
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data.data));
              this.userinfo=res.data.data;
              resolve();
            } else{
              this.$message.error(res.data.state.msg)
            }
          }).catch()
        });
      },
          //获取商户概况statisticsData
      getStatisticsData(){
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.statistics_data + '?act=11',
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('statisticsData', JSON.stringify(res.data.data));
              resolve();
            } else if (res.data.state.code == 10401) {
              this.$message.error(res.data.state.msg)
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      //获取用户权限，生成对应菜单
      getUserPermission() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.get_user_permission + '?act=11',
            params:{
              account:this.phone
            }
          }).then(res => {
            if (res.data.state.code == 10200) {
              sessionStorage.setItem('permission', JSON.stringify(res.data.data.permission));
              sessionStorage.setItem('menue', JSON.stringify(res.data.data.menu));
              resolve();
            } else {
              this.$message.error(res.data.state.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        })
      },
      //获取平台数据
      getSubShop(){
        if(sessionStorage.getItem('hassubshop')==null||sessionStorage.getItem('hassubshop')==undefined||sessionStorage.getItem('hassubshop')==''||sessionStorage.getItem('hassubshop')=='false'){

        }else {
          this.api.request({
            url: this.api.getSubShop,
            params: {
              buid: localStorage.getItem('loginUid')
            }
          }).then((res) => {
            if (res.data.state.code == 10200) {
              this.tableData = res.data.data.sub_shops;
              sessionStorage.setItem('subshops', JSON.stringify(res.data.data.sub_shops));
            } else {
              this.$message.error(res.data.state.msg);
            }
          });
        }
      },
      //进入平台分店
      enterBranchShop(phone,name,uid){
        this.phone=phone;
        this.switch_account(uid).then((res)=>{
          Promise
            .all([ this.getStatisticsData(), this.getUserPermission(),this.getUserInfo()])
            .then((results) => {
              sessionStorage.setItem('currentBranchShop', name);
              this.$router.push({path:'/info',query:{
                  id:uid
                }});
            });
        })
      }
    }
  }


</script>

<style lang="less" scoped>
  #platformList{
    padding:84px 20px 20px;
    .active{
      color:#f60;
      line-height: 40px;
      font-size:14px;
    }
  }
</style>
