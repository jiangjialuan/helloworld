<template>
    <div id="userList">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="客户列表" name="first">
          <el-form v-if="activeName=='first'" :model="form" class="demo-form-inline" :inline="true">
            <el-form-item label="" label-width="120">
              <el-input v-if="activeName=='first'" v-model="form.key" auto-complete="off" placeholder="请输入昵称"></el-input>
              <el-input v-else v-model="form.key" auto-complete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="getSaleList(1)">搜索</el-button>
            </el-form-item>
            <div>
              <div class="lineMenu">
                <label class="lineTitle">消费次数</label>
                <el-radio-group v-model="form.consume_times" @change="getSaleList(1)">
                  <el-radio-button label="0">全部</el-radio-button>
                  <el-radio-button label="1">一次</el-radio-button>
                  <el-radio-button label="3">三次以内</el-radio-button>
                  <el-radio-button label="5">五次以内</el-radio-button>
                  <el-radio-button :label="consume_times_value"><el-input size="mini" v-model="consume_times_value" style="width:80px;" @blur="consume_times_blur"></el-input>次以内</el-radio-button>
                </el-radio-group>
              </div>
              <div class="lineMenu" v-if="activeName=='second'">
                <label class="lineTitle">会员等级</label>
                <el-radio-group v-model="form.level_id"  @change="getSaleList(1)">
                  <el-radio-button label="0">全部</el-radio-button>
                  <el-radio-button v-if="memberLevel.length>0"  v-for="item in memberLevel" :key="item.name" :label="item.id" >{{item.name}}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="lineMenu" v-if="!userinfo.is_sub_shop">
                <label class="lineTitle">分店来源</label>
                <el-select v-model="form.shop_id" placeholder="请选择" style="padding-left:10px;" @change="getSaleList(1)">
                  <el-option class="selectWidth" label="全部" value="0"></el-option>
                  <el-option
                    v-for="item in subshops"
                    :key="item.buser_id"
                    :label="item.name"
                    :value="item.buser_id"
                    class="selectWidth"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="客户信息">
              <template slot-scope="scope" >
                <p>{{scope.row.username}}</p>
              </template>
            </el-table-column>
            <!--align="center" header-align="left"-->
            <el-table-column
              prop="total_amount"
              label="累计消费（元）">
              <template slot-scope="scope">
                <p class="active">{{scope.row.total_amount}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="total_buied_times"
              label="消费次数">
            </el-table-column>
            <el-table-column v-if="!userinfo.is_sub_shop"
               prop="shop_name"
               label="分店来源">
            </el-table-column>
            <el-table-column
              prop="last_login"
              label="上次访问时间">
            </el-table-column>
            <el-table-column
              prop="last_buied"
              label="上次消费时间">
            </el-table-column>
          </el-table>
          <div class="alignCenter">
            <el-pagination v-if="activeName=='first'"
              @current-change="getCustomersList"
              :current-page.sync="pagination.currentpage"
              :page-size="pagination.pagesize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="会员列表" name="second" v-if="!userinfo.is_sub_shop">
          <el-form :model="form" v-if="activeName=='second'" class="demo-form-inline" :inline="true">
            <el-form-item label="" label-width="120">
              <el-input v-if="activeName=='first'" v-model="form.key" auto-complete="off" placeholder="请输入昵称"></el-input>
              <el-input v-else v-model="form.key" auto-complete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="getSaleList(1)">搜索</el-button>
            </el-form-item>
            <div>
              <div class="lineMenu">
                <label class="lineTitle">消费次数</label>
                <el-radio-group v-model="form.consume_times" @change="getSaleList(1)">
                  <el-radio-button label="0">全部</el-radio-button>
                  <el-radio-button label="1">一次</el-radio-button>
                  <el-radio-button label="3">三次以内</el-radio-button>
                  <el-radio-button label="5">五次以内</el-radio-button>
                  <el-radio-button :label="consume_times_value"><el-input size="mini" v-model="consume_times_value" style="width:80px;" @blur="consume_times_blur"></el-input>次以内</el-radio-button>
                </el-radio-group>
              </div>
              <div class="lineMenu" v-if="activeName=='second'">
                <label class="lineTitle">会员等级</label>
                <el-radio-group v-model="form.level_id"  @change="getSaleList(1)">
                  <el-radio-button label="0">全部</el-radio-button>
                  <el-radio-button v-if="memberLevel.length>0"  v-for="item in memberLevel" :key="item.name" :label="item.id" >{{item.name}}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="lineMenu" v-if="!userinfo.is_sub_shop">
                <label class="lineTitle">分店来源</label>
                <el-select v-model="form.shop_id" placeholder="请选择" style="padding-left:10px;" @change="getSaleList(1)">
                  <el-option class="selectWidth" label="全部" value="0"></el-option>
                  <el-option
                    v-for="item in subshops"
                    :key="item.buser_id"
                    :label="item.name"
                    :value="item.buser_id"
                    class="selectWidth"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="会员信息">
              <template slot-scope="scope" >
                <p>{{scope.row.member_phone}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="level_name"
              label="会员等级">
            </el-table-column>
            <el-table-column
              prop="total_amount"
              label="累计消费（元）">
              <template slot-scope="scope">
                <p class="active">{{scope.row.total_amount}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="points"
              label="累计消费积分">
            </el-table-column>
            <el-table-column
              prop="total_buied_times"
              label="消费次数">
            </el-table-column>
            <el-table-column
               prop="shop_name"
               label="分店来源">
            </el-table-column>
            <el-table-column
              prop="last_buied"
              label="上次消费时间">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="eidtMember(scope.row.uid)">编辑</el-button>
                <!--<el-button type="text" @click="delMember(scope.row.uid)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter" >
            <el-pagination v-if="activeName=='second'"
              @current-change="getMembersList"
              :current-page.sync="pagination.currentpage"
              :page-size="pagination.pagesize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>




      <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="editForm" label-width="80px" ref="editForm">
          <el-form-item label="手机号"  prop="member_phone" :rules="[{ required: true, validator:validatephone, trigger: 'blur'}]">
            <el-input v-model="editForm.member_phone"  auto-complete="off" style="width:200px;"></el-input>
          </el-form-item>
          <!--<el-form-item label="微信号" prop="name" :rules="[{ required: true, message:'必填项不能为空', trigger: 'blur'}]">
            <el-input v-model="editForm.name" auto-complete="off" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="name" :rules="[{ required: true, message:'必填项不能为空', trigger: 'change'}]">
            <el-select v-model="editForm.name" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="会员积分" prop="points" :rules="[{ required: true, validator:optionsRules, trigger: 'blur'}]">
            <el-input v-model="editForm.points" :min="0" type="number" auto-complete="off" style="width:200px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editFormComfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import qs from 'qs'
    export default {
        name: "userList",
      data(){
          return {
            activeName:'first',
            curuid:sessionStorage.getItem('curuid'),
            userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
            form:{
              key:'',
              consume_times:'0',
              level_id:'0',
              shop_id:'0'
            },
            consume_times_value:'',
            consume_rate_value:'',
            editForm:{
              points:'',
              uid:'',
              member_phone:''
            },
            dialogFormVisible:false,
            tableData:[],
            pagination:{
              currentpage:1,
              pagesize:10,
              total:0
            },
            memberLevel:[],
            subshops:JSON.parse(sessionStorage.getItem('subshops')),
          }
      },
      created(){
        this.getCustomersList(1);
        this.getList();
      },
      methods:{

        //消费次数输入框失焦
        consume_times_blur(){
          this.form.consume_times=this.consume_times_value;
          this.getSaleList(1);
        },
        //电话号码验证
        validatephone(rule,value,callback){
          debugger;
          var re1=/^(1(3|4|5|6|7|8|9)[0-9]{9})$/;
          var re2=/^(0\d{2,3}-\d{7,8})$/;
          if(value==''){
            callback(new Error('号码不能为空'))
          }else if(!re1.test(value)&&!re2.test(value)){
            callback(new Error('请输入正确的手机号或电话'))
          }else{
            callback()
          }
        },
        //积分验证
        optionsRules(rules,value,callback){
          if(value==''){
            callback(new Error('积分值不能为空'))
          }else if(parseFloat(value)<0){
            callback(new Error('积分值不能为负数'))
          }else{
            callback();
          }
        },
          //会员编辑确认
        editFormComfirm(){
          this.$refs['editForm'].validate((valid)=>{
            if(valid){
              this.api.request({
                url:this.api.edit_user_member,
                method:'post',
                data:qs.stringify(this.editForm),
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.$message({
                    type:'success',
                    message:'保存成功！'
                  });
                  this.getMembersList(this.pagination.currentpage);
                  this.dialogFormVisible=false;
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });

            }
          });
        },
          //编辑会员
        eidtMember(id){
          this.api.request({
            url:this.api.get_user_member,
            params:{
              buid:this.curuid,
              uid:id
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.editForm.points=res.data.data.points;
              this.editForm.uid=id;
              this.editForm.member_phone=res.data.data.member_phone;
              this.editForm.buid=this.curuid;
              this.dialogFormVisible=true;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });

        },
        //删除会员
        delMember(id){
          this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch();
        },
        //切换选项卡触发事件
        handleClick(tab){
          this.form={
            key:'',
              consume_times:'0',
              level_id:'0',
              shop_id:'0'
          };
          if(this.activeName=='first'){
            this.getCustomersList(1)
          }else{
            this.getMembersList(1);
          }
        },
        //获取会员等级列表
        getList(){
          this.api.request({
            url:this.api.member_list_data,
            params:{
              buid:this.curuid
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              if(res.data.data<=0){

              }else
                this.memberLevel=res.data.data
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //点击搜索触发事件
        getSaleList(page){
          if(this.activeName=='first'){
            this.getCustomersList(page);
          }else{
            this.getMembersList(page)
          }
        },
        //获取客户列表
        getCustomersList(page){
          debugger;
          var smData={
            buid:this.curuid,
            page:page,
            consume_times:this.form.consume_times,
            shop_id:this.form.shop_id,
            key:this.form.key,
          };
          this.api.request({
            url:this.api.customers_list,
            method:'post',
            data:qs.stringify(smData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.tableData=res.data.data.list;
              this.pagination.currentpage=res.data.data.page;
              this.pagination.total=parseInt(res.data.data.total_count);
              this.pagination.pagesize=res.data.data.per_page;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //获取会员列表
        getMembersList(page){
          var smData={
            buid:this.curuid,
            page:page,
            consume_times:this.form.consume_times,
            shop_id:this.form.shop_id,
            level_id:this.form.level_id,
            key:this.form.key,
          };
          this.api.request({
            url:this.api.members_list,
            method:'post',
            data:qs.stringify(smData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.tableData=res.data.data.list;
              this.pagination.currentpage=res.data.data.page;
              this.pagination.total=parseInt(res.data.data.total_count);
              this.pagination.pagesize=res.data.data.per_page;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
      }
    }
</script>

<style lang="less">
  .selectWidth{
    width:200px;
  }
  .lineMenu .el-radio-group{
    display: block;
    padding-left:70px;
    margin-top:-27px;
  }
  #userList{
    color:#606266;
    font-size:12px;
    padding-bottom:50px;
    .active{
      color:#f60;
    }
    .alignCenter{
      text-align: center;
    }
    .demo-form-inline{
      font-size:14px;
    }
    .lineMenu{
      margin-bottom: 10px;
    }
    .el-radio-button__inner{
      border:none;
      background: none;
      color:#409EFF;
      padding:0px 20px;
      height:40px;
      line-height: 39px;
    }
    .alignCenter{
      text-align: center;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      color:#fFF;
      background: #409EFF;
      border-radius:4px;
      height:40px;
      line-height: 39px;
      padding:0px 20px;
      text-align: center;
      box-shadow:none;
    }
  }
</style>
