<template>
  <div id="shortVideo">
    <!--头-->
    <el-row :gutter="24" style="width:900px; display: none;">
      <el-col :span="12">
        <el-card shadow="never">
          <p class="alignCenter">
            <label class="left"><span class="active bold">{{yesterday_sv_order_num}}</span>数量</label>
            <label class="right">金额￥<span class="active bold">{{yesterday_sv_order_amount}}</span></label>
          </p>
          <p class="alignCenter">昨日新增实付订单</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <p class="alignCenter">
            <label class="left"><span class="active bold">{{online_short_video}}</span>投放中</label>
            <label class="right">下线<span class="active bold">{{offline_short_video}}</span></label>
          </p>
          <p class="alignCenter">短视频总数</p>
        </el-card>
      </el-col>
    </el-row>
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
      <el-form-item label="状态:">
        <el-select v-model="filterCriteria.status" placeholder="请选择">
          <el-option label="全部" value="2"></el-option>
          <el-option label="下线" value="0"></el-option>
          <el-option label="上线" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称:">
        <el-input v-model="filterCriteria.title" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="shortVideo(1)">筛选</el-button>
      </el-form-item>
    </el-form>
    <!--操作-->
    <div class="alignCenter">
      <el-button style="float:left;margin-bottom: 10px;" @click="showDeleteVideoDialog=true">删除</el-button>
      <router-link  v-if="userinfo.edit_flag" style="float:right;" class="el-button primary"  :to="{ path: '/shortVideo/shortVideoEdit/'}">新增短视频</router-link>
      <el-button style="float:right;" v-if="userinfo.is_sub_shop&&userinfo.sync_flag" type="primary" @click="formHomeShop" >从总店同步</el-button>
    </div>
    <!--内容主体-->
    <el-table :data="shortVideoData" ref="shortVideoData" stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="视频信息" width="240">
        <template slot-scope="scope">
          <div class="goods-header">
            <div class="goods-img">
              <img :src="scope.row.cover"  >
              <p class="imgUptxt">{{scope.row.length | sec_to_time}}</p>
            </div>
            <div class="goods-info">
              <p>{{scope.row.title}}</p>
              <p>上传于:{{scope.row.create_time}}</p>
              <p>
                <span>点赞{{scope.row.thumbsup_number}}</span>
                <span>评论{{scope.row.remark_count}}</span>
              </p>

            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="视频来源" align="center">
        <template slot-scope="scope">
          <!--<p>{{scope.row.uid==curuid?'自主':'代售'}}</p>-->
          <p>{{scope.row.from==1?'自主':'总店'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="商品" prop="goods_count"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <p>{{scope.row.status==1?'上线':'下线'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="链接">
        <template slot-scope="scope">
          <p>h5链接:<a :href="scope.row.url" class="activeLink" target="_blank">{{scope.row.url}}</a></p>
          <p>小程序链接：pages/video/detail?sid={{scope.row.id}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link v-if="userinfo.edit_flag" :to="{ path: '/shortVideo/shortVideoEdit/'+scope.row.id }" class="activeLink">编辑</router-link>
          <el-button v-else type="text" @click="viewVideoDetail(scope.row.id)">查看</el-button>
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
      @current-change="shortVideo">
    </el-pagination>
    <!--删除二次确认-->
    <el-dialog
      title="提示"
      :visible.sync="showDeleteVideoDialog"
      width="300px"
      center>
      <p style="text-align: center">此操作将永久删除该视频, 是否继续?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="showDeleteVideoDialog=false">取 消</el-button>
        <el-button type="primary" @click="deleteVideo">确 定</el-button>
      </span>
    </el-dialog>
    <!--从总店同步-->
    <videoCollect ref="videoCollect" @comfirm="selectVideoComfirm"></videoCollect>
  </div>
</template>

<script>
  import videoCollect from '../../../components/homeShopVideoCollection.vue'
  import qs from 'qs';
  export default {
    data() {
      return {
        hassubshop:sessionStorage.getItem('hassubshop'),
        yesterday_sv_order_num: JSON.parse(sessionStorage.getItem('statisticsData')).yesterday_sv_order_num,
        yesterday_sv_order_amount: JSON.parse(sessionStorage.getItem('statisticsData')).yesterday_sv_order_amount,
        yesterday_sv_redenvelope_num: JSON.parse(sessionStorage.getItem('statisticsData')).yesterday_sv_redenvelope_num,
        yesterday_sv_redenvelope_earnings: JSON.parse(sessionStorage.getItem('statisticsData')).yesterday_sv_redenvelope_earnings,
        online_short_video: JSON.parse(sessionStorage.getItem('statisticsData')).online_short_video,
        offline_short_video: JSON.parse(sessionStorage.getItem('statisticsData')).offline_short_video,
        uid: JSON.parse(sessionStorage.getItem('userinfo')).uid,
        userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
        curuid:sessionStorage.getItem('curuid'),
        filterCriteria: {
          date_picker: '',
          status: '2',
          title: ''
        },
        shortVideoData: [],
        showHideSwitch: true,//合伙人短视频显示隐藏
        currentPage: sessionStorage.getItem("agentWithdrawPage") == null ? 1 : parseInt(sessionStorage.getItem("agentWithdrawPage")),
        total_count: 0,
        total_page: 0,
        showDeleteVideoDialog: false,
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
    components:{
      videoCollect,
    },
    mounted() {
      // 初始化主播短视频列表,合伙人短视频显示
      this.showHide()
    },
    filters:{
        //时长转成时分秒
      sec_to_time: function(s) {
        var t;
        if(s > -1){
          var hour = Math.floor(s/3600);
          var min = Math.floor(s/60) % 60;
          var sec = s % 60;
          if(hour < 10) {
            t = '0'+ hour + ":";
          } else {
            t = hour + ":";
          }

          if(min < 10){t += "0";}
          t += min + ":";
          if(sec < 10){t += "0";}
          t += sec;
        }
        return t;
      }
    },
    methods: {
      //查看短视频 详情
      viewVideoDetail(id){
        this.$router.push('/shortVideo/shortVideoEdit/'+id);
      },
      //从总店同步
      formHomeShop(){
        this.$refs['videoCollect'].open();
      },
      //同步确认按钮
      selectVideoComfirm(val){
        this.$confirm('同步视频中带有商品，若商铺中没有该商品，将会从总店自动同步该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var smData={
            buid:this.curuid,
            video_ids:val.join(',')
          };
          var loading = this.$loading({
            lock: true,
            text: '正在同步，请稍候~~',
            background: 'rgba(255, 255, 255, 0.7)'
          });
          this.api.request({
            url:this.api.async_parent_short_video,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData),
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.shortVideo(1);
              this.$message({
                type:'success',
                message:'同步成功！'
              });

            }else{
              this.$message.error(res.data.state.msg);
            }
            loading.close();
          });
        }).catch();

      },
      // 获取短视频列表
      shortVideo(page) {
        if (this.filterCriteria.date_picker == null) this.filterCriteria.date_picker = "";
        this.api.request({
          url: this.api.anchor_short_video,
          data: {
            act: 11,
            from_time: this.filterCriteria.date_picker[0],
            end_time: this.filterCriteria.date_picker[1],
            status: this.filterCriteria.status,
            title: this.filterCriteria.title,
            page: page
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.shortVideoData = res.data.data.list;
            this.total_count = res.data.data.total_count;
            this.total_page = res.data.data.total_page;
            this.currentPage = page;
            sessionStorage.setItem("shortVideoPage", page);
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //合伙人短视频显示隐藏
      showHide() {
        this.api.request({
          url: this.api.complete_info,
          data: {
            act: 11,
            pull_video: this.showHideSwitch == true ? 1 : 0
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.shortVideo(this.currentPage)
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
          } else if (res.data.state.code == 10401) {
            this.$message.error(res.data.state.msg);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      },
      //删除短视频
      deleteVideo() {
        var svid = '';
        this.$refs.shortVideoData.selection.forEach(row => {
          svid += ',' + row.id
        });
        this.api.request({
          url: this.api.del_short_video,
          data: {
            act: 11,
            svid: svid.substr(1)
          },
          method: 'post'
        }).then(res => {
          if (res.data.state.code == 10200) {
            this.shortVideo(this.currentPage);
            this.$message.success(res.data.state.msg);
            this.showDeleteVideoDialog = false;
          } else if (res.data.state.code == 10400) {
            this.$message.error(res.data.state.msg);
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
  #shortVideo{
    font-size:12px;
    color:#303133;
    .primary{
      color: #fff;
      background-color: #409EFF;
      border-color: #409EFF;
    }
    .el-card{
      label{
        padding:0px 20px;
        color:#999;
        display:inline-block;
        width:38%;
        height:20px;
        line-height: 20px;
      }
      span{
        padding:0px 5px;
      }
      .left{
        border-right:1px solid #e6e6e6;
        text-align: right;
      }
      .right{
        text-align: left;
      }
    }

    .alignCenter{
      text-align: center;
    }
    .tag{
      color:#909399;
    }
    p{
      line-height: 26px;
    }
    .active{
      color:#f60;
      line-height: 20px;
      font-size:16px;
      &.bold{
        font-weight:bold;
      }
    }
    .el-form-item label{
      font-size:12px;
    }
    .el-pagination{
      text-align: center;
      padding:10px;
    }
    .el-table,span{
      font-size:12px;
    }
    .el-button{
      font-size:12px;
    }
    .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
      font-size:12px;
    }
    .goods-header{
      width:240px;
      line-height: 78px;
      .goods-img{
        width:60px;
        height:60px;
        margin-right:10px;
        display: inline-block;
        position: relative;
        text-align: center;
        background:#222;
        vertical-align: middle;
        .imgUptxt{
          background: rgba(0,0,0,0.4);
          color:#fff;
          position:absolute;
          bottom:0px;
          left:0px;
          right:0px;
          text-align: center;
          line-height: 1;
        }
        img{
          max-width:60px;
          max-height:60px;
        }
      }
      .goods-info{
        display: inline-block;
        width:160px;
        vertical-align: middle;
      }
    }
    .activeLink{
      color:#409EFF;
    }
    /*块1---头部*/
    .el-row {
      /*margin-left: 12px;*/
      /*margin-right: 12px;*/
      padding: 24px;
    }

    .el-col {
      border-radius: 4px;
    }
  }

</style>
