<template>
  <div id="partnerManage">
    <!--别人是我的合伙人-->
    <div class="partnerCode">
      <div class="codeImg"><img :src="this.api.bind_account_qrcode+'?act=11&size=2'"/></div>
      <div class="codeTxt">
        <h3>邀请二维码</h3>
        <p class="tag">邀请他人扫码，即可成为您的合伙人</p>
      </div>
    </div>
    <div style="background: white;text-align: center" v-if="pageHeaderShow == 1">
      <div>你当前是<span style="font-size: 24px;">{{myPartnerInfo}}</span>的合伙人</div>
      <div>你当前的分成比例为 <span style="font-size: 24px;">销售额*{{myPartnerProportion}}%</span></div>
      <el-button type="primary" @click="deletePartner('fireMe')">解除合伙人</el-button>
    </div>

    <!--tab及内容-->
    <el-tabs v-model="activeName" v-if="pageHeaderShow !=1" @tab-click="handleClick">
      <!--我的合伙人tab-->
      <el-tab-pane label="我的合伙人" name="first">
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
          <el-form-item label="账号:">
            <el-input v-model="filterCriteria.mobile_phone" placeholder="账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="昵称:">
            <el-input v-model="filterCriteria.name" placeholder="昵称" clearable></el-input>
          </el-form-item>
          <el-form-item label="名称:">
            <el-input v-model="filterCriteria.realname" placeholder="名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属分组:">
            <el-select v-model="filterCriteria.agency_group_id" clearable filterable placeholder="请选择">
              <el-option v-for="item in partnerGroupingData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="partnerManage(1)">筛选</el-button>
          </el-form-item>
        </el-form>
        <!--内容主体-->
        <el-table :data="myPartnerData" stripe>
          <el-table-column label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.head_pic">
            </template>
          </el-table-column>
          <el-table-column prop="mobile_phone" label="账号"></el-table-column>
          <el-table-column prop="name" label="昵称"></el-table-column>
          <el-table-column prop="realname" label="真实姓名"></el-table-column>
          <el-table-column prop="bindtime" label="添加日期"></el-table-column>
          <el-table-column label="分成比例">
            <template slot-scope="scope">
              <p>{{scope.row.groupProportion}}%</p>
            </template>
          </el-table-column>
          <el-table-column label="所属分组">
            <template slot-scope="scope">
              <div v-if="showGroupContent">
                <span>{{scope.row.groupName}}</span>
                <el-button type="primary" size="small" @click="showGroupContent = false">修改分组</el-button>
              </div>
              <div v-if="!showGroupContent">
                <el-select v-model="selectedChangeGroupData" filterable placeholder="请选择">
                  <el-option v-for="item in partnerGroupingData" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
                <el-button type="primary" size="small" @click="changeGroup(scope.$index,scope.row)">保存</el-button>
                <el-button type="info" size="small" @click="showGroupContent = true">取消</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deletePartner(scope.row)">删除合伙人</el-button>
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
          @current-change="partnerManage">
        </el-pagination>
      </el-tab-pane>

      <!--合伙人分组tab-->
      <el-tab-pane label="合伙人分组" name="second">
        <!--新建分组-->
        <el-button type="primary" @click="showDialog">新建分组</el-button>
        <span class="tag">通过分组，您可以批量管理合伙人分成比例</span>
        <!--内容主体-->
        <el-table :data="partnerGroupingData" stripe>
          <el-table-column prop="name" label="分组名称"></el-table-column>
          <el-table-column prop="proportion" label="分成比例"></el-table-column>
          <el-table-column prop="user_count" label="人数"></el-table-column>
          <el-table-column prop="desc" label="描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" :id="scope.row.id" @click="showDialog(scope.$index,scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--对话框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="">
      <el-form :model="dialogForm">
        <el-form-item label="分组名称:" label-width="100px">
          <el-input v-model="dialogForm.name" style="width: 300px"></el-input>
          <span>最多6个字</span>
        </el-form-item>
        <el-form-item label="分成比例:" label-width="100px">
          <span>销售额X</span>
          <el-input v-model="dialogForm.proportion" style="width: 300px"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="分组描述:" label-width="100px">
          <el-input v-model="dialogForm.desc" type="textarea" autosize></el-input>
          <span>(0/100)</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="agencyGroupSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="showPermissionChangeDialog"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :show-close=false
      width="25%"
      center>
      <span>您的权限发现变动，请刷新获取最新界面。（点击确认后即将刷新）</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="PermissionChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first',
        pageHeaderShow: JSON.parse(sessionStorage.getItem('userinfo')).is_agency,
        myPartnerInfo: JSON.parse(sessionStorage.getItem('userinfo')).agency_user,
        myPartnerProportion: JSON.parse(sessionStorage.getItem('userinfo')).proportion,
        filterCriteria: {
          date_picker: '',
          mobile_phone: '',//账号
          name: '',//昵称
          realname: '',//名称
          agency_group_id: ''//所属分组
        },
        myPartnerData: [],
        partnerGroupingData: [],
        currentPage: sessionStorage.getItem("partnerManagePage") == null ? 1 : parseInt(sessionStorage.getItem("partnerManagePage")),
        total_count: 0,
        total_page: 0,
        activeName2:'first',
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
        },
        dialogTitle: '',
        dialogVisible: false,
        dialogForm: {
          id: '',
          name: '',
          proportion: '',
          desc: ''
        },
        showGroupContent: true,
        selectedChangeGroupData: '',
        showPermissionChangeDialog: false
      }
    },
    mounted() {
      // 获取合伙人分组,获取我的合伙人列表在这个方法的回调里
      this.partnerGrouping();
    },
    methods: {
      handleClick(tab, event) {
      },
      // 获取合伙人分组列表
      partnerGrouping() {
        this.api.request({
          url: this.api.get_agency_groups + '?act=11'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.partnerGroupingData = res.data.data;
            this.partnerManage(this.currentPage);
          } else if (res.data.state.code == 10401) {
            this.showPermissionChangeDialog = true;
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      // 获取我的合伙人列表
      partnerManage(page) {
        if (this.filterCriteria.date_picker == null) this.filterCriteria.date_picker = "";
        this.api.request({
          url: this.api.my_agency,
          data: {
            act: 11,
            from_time: this.filterCriteria.date_picker[0],
            end_time: this.filterCriteria.date_picker[1],
            mobile_phone: this.filterCriteria.mobile_phone,
            name: this.filterCriteria.name,
            realname: this.filterCriteria.realname,
            agency_group_id: this.filterCriteria.agency_group_id,
            page: page
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            res.data.data.list.forEach(my => {
              this.partnerGroupingData.forEach(group => {
                if (my.agency_group_id == group.id) {
                  my.groupProportion = group.proportion;
                  my.groupName = group.name;
                }
              })
            });
            this.myPartnerData = res.data.data.list;
            this.total_count = res.data.data.total_count;
            this.total_page = res.data.data.total_page;
            sessionStorage.setItem("partnerManagePage", page);
          } else if (res.data.state.code == 10400) {
            // this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.showPermissionChangeDialog = true;
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //合伙人分组弹框
      showDialog(index, row) {
        if (row) {
          this.dialogForm.id = row.id;
          this.dialogForm.name = row.name;
          this.dialogForm.proportion = row.proportion;
          this.dialogForm.desc = row.desc;
          this.dialogTitle = '编辑分组';
        } else {
          this.dialogForm = {};
          this.dialogTitle = '新建分组';
        }
        this.dialogVisible = true;
      },
      //合伙人分组表单提交
      agencyGroupSubmit() {
        if (this.dialogTitle == '新建分组') {
          this.api.request({
            url: this.api.add_agency_group,
            data: {
              act: 11,
              name: this.dialogForm.name,
              proportion: this.dialogForm.proportion,
              desc: this.dialogForm.desc
            },
            method: 'post'
          }).then(res => {
            if (res.data.state.code == 10200) {
              this.dialogVisible = false;
              this.partnerGrouping();
            } else if (res.data.state.code == 10401) {
              this.showPermissionChangeDialog = true;
              this.$message.error(res.data.state.msg);
            }
          })
        } else if (this.dialogTitle == '编辑分组') {
          this.api.request({
            url: this.api.edit_agency_group,
            data: {
              act: 11,
              name: this.dialogForm.name,
              proportion: this.dialogForm.proportion,
              desc: this.dialogForm.desc,
              id: this.dialogForm.id
            },
            method: 'post'
          }).then(res => {
            if (res.data.state.code == 10200) {
              this.dialogVisible = false;
              this.partnerGrouping();
            } else if (res.data.state.code == 10401) {
              this.showPermissionChangeDialog = true;
              this.$message.error(res.data.state.msg);
            }
          })
        }
      },
      //删除合伙人
      deletePartner(row) {
        var thisData = {
          act: 11,
          id: row.id
        };
        if (row == 'fireMe') {
          thisData = {
            act: 11
          }
        }
        this.api.request({
          url: this.api.remove_agency,
          data: thisData,
          method: 'post'
        }).then(res => {
          debugger;
          if (res.data.state.code == 10200) {
            this.$message.success(res.data.state.msg);
            this.partnerManage();
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.showPermissionChangeDialog = true;
            this.$message.error(res.data.state.msg);
          }
        })
      },
      //修改分组
      changeGroup(index, row) {
        this.api.request({
          url: this.api.bind_agency_group,
          data: {
            act: 11,
            uid: row.id,
            agency_group_id: this.selectedChangeGroupData
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.$message.success(res.data.state.msg);
            this.showGroupContent = true
            this.partnerManage();
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.showPermissionChangeDialog = true;
            this.$message.error(res.data.state.msg);
          }
        })
      },
      //合伙人权限变更
      PermissionChange() {
        location.reload()
      }
    }
  }
</script>

<style lang="less" scoped>
  #partnerManage{
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
