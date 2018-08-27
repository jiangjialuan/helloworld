<template>
    <div id="ruhuConsultation">
      <el-form v-model="questForm">
        <el-form-item label="是否启用积分计算工具">
          <el-radio label="1" v-model="questForm.open_score" @change="savePointSet">开启</el-radio>
          <el-radio label="0" v-model="questForm.open_score" @change="savePointSet">关闭</el-radio>
        </el-form-item>
      </el-form>
      <el-table :data="questData.list">
        <el-table-column label="手机号" prop="mobile_phone"></el-table-column>
        <el-table-column label="入户积分" prop="score"></el-table-column>
        <el-table-column label="积分计算时间" prop="updatetime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  type='text' @click="viewQuestDetail(scope.row.id)">查看问题回答详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="alignCenter">
        <el-pagination
          @current-change="getQuestList"
          :current-page.sync="questData.page"
          :page-size="questData.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="questData.total"
        ></el-pagination>
      </div>
      <el-dialog title="问卷积分回答" :visible.sync="questDetailVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
        <div style="max-height: 400px; overflow: auto;">
          <div v-for="(item,index) in questData.answer_json" class="questLine">
            <p>{{++index}}.{{item}}</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer center">
          <el-button @click="questDetailVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "ruhuConsultation",
      data(){
          return{
            questForm:{
              open_score:''
            },
            questData:{
              list:[],
              page:1,
              pagesize:10,
              total:0,
              answer_json:[],
              open_score:'0'
            },
            curuid:sessionStorage.getItem('curuid'),
            screeHeight:window.innerHeight,
            questDetailVisible:false,
          }
      },
      created(){
        this.getQuestList(1);
        this.getPointSet();
      },
      methods:{
        //获取积分设置工具详情
        getPointSet(){
          var smData={};
          smData.buid=this.curuid;
          this.api.request({
            url:this.api.getShopSet,
            params:smData,
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.questForm.open_score=res.data.data.open_score==0?'0':'1';
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //保存积分设置工具详情
        savePointSet(){
          var smData={
            buid:this.curuid,
            open_score:this.questForm.open_score
          };
          this.api.request({
            url: this.api.shopSet,
            method: 'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data: qs.stringify(smData)
          }).then((res) => {
            if (res.data.state.code == 10200) {
              this.$message({
                type: 'success',
                message: '设置成功！'
              });
            } else {
              this.$message.error(res.data.state.msg);
            }
          });
        },
//查看问答详情
        viewQuestDetail(id){
          this.api.request({
            url:this.api.get_user_answer,
            params:{
              buid:this.curuid,
              id:id
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.questData.answer_json=res.data.data.answer_json;
              this.questDetailVisible=true;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //获取问卷列表数据
        getQuestList(page){
          this.api.request({
            url:this.api.answer_list_data,
            params:{
              buid:this.curuid,
              page:page
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.questData.list=res.data.data.list;
              this.questData.page=res.data.data.page;
              this.questData.pagesize=res.data.data.per_page;
              this.questData.total=res.data.data.total_count
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
      }
    }
</script>

<style lang="less" scoped>
  #ruhuConsultation{
    .alignCenter{
      text-align: center;
    }
    .questLine{
      margin-bottom:20px;
    }
  }

</style>
