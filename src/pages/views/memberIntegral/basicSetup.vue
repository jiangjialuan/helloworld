<template>
<div id="basicSetup">
  <el-form  ref="form" label-width="150px" :model="form">
    <el-form-item label="会员等级特权">
      <el-radio v-model="form.open_member" label="1">开启</el-radio>
      <el-radio v-model="form.open_member" label="0">关闭</el-radio>
      <div class="ts">
        <p><b>温馨提示：</b>会员等级特权开启时，会员设置才生效</p>
      </div>
    </el-form-item>
    <el-form-item label="积分设置">
    </el-form-item>
    <el-row class="rules">
      <table class="el-table per60 el-table--border" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
        <tr>
          <th class="is-leaf alignCenter"><div class="cell">积分获取</div></th>
          <th class="is-leaf alignCenter"><div class="cell">获得积分值<span class="need">*</span></div></th>
          <th class="is-leaf alignCenter"><div class="cell">日上限</div></th>
        </tr>
        <tr v-for="(item,index) in form.tableData">
          <td>
            <div class="cell">
              {{item.item_name}}
            </div>
          </td>
          <td>
            <div class="cell" style="overflow:visible;">
            <el-form-item :prop="'tableData.'+index+'.change_points'" :rules="[{ required: true, validator:optionsRules, trigger: 'change'}]" label-width="0px">
              <el-input  size="mini" :min="0" type="number" v-model="item.change_points"></el-input> 积分/元
            </el-form-item>
            </div>
          </td>
          <td>
            <div class="cell">无上限</div>
          </td>
        </tr>
      </table>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "memberIntegral",
      data(){
          return {
            curuid:sessionStorage.getItem('curuid'),
            form:{
              open_member:'',
              tableData:[],
            },

          }
      },
      created(){
          this.getMemberSet();
          this.getPoints();
      },
      methods:{
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
        //获取是否开启会员系统
        getMemberSet(){
          var smData={};
          smData.buid=this.curuid;
          this.api.request({
            url:this.api.getShopSet,
            params:smData,
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.form.open_member=res.data.data.open_member==0?'0':'1';
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },

        //保存会员系统是否开启
        saveMemberSet(){
          return new Promise((resolve, reject) => {
            var smData={
              buid:this.curuid,
              open_member:this.form.open_member
            };
            this.api.request({
              url: this.api.shopSet,
              method: 'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data: qs.stringify(smData)
            }).then((res) => {
              if (res.data.state.code == 10200) {
                resolve();
              } else {
                this.$message.error(res.data.state.msg);
                reject();
              }
            });
          });
        },
        //积分列表的获取
        getPoints(){

          var smData={
            buid:this.curuid,
          }
          this.api.request({
            url:this.api.points_detail_data,
            params:smData
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.form.tableData=res.data.data;
              console.log(res.data.data);
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //保存积分列表
        savePoints(){
          return new Promise((resolve, reject) => {
          var smData={
            item_id:[],
            item_name:[],
            change_points:[],
          };
          this.form.tableData.forEach((item)=>{
            smData.item_id.push(item.item_id);
            smData.item_name.push(item.item_name);
            smData.change_points.push(item.change_points);
          });

          this.api.request({
            url:this.api.points_detail_store+'?buid='+this.curuid,
            method: 'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data: qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              resolve();
            }else{
              this.$message.error(res.data.state.msg);
              reject();
            }
          });
          });
        },
        //点击保存触发事件
        onSubmit(){
          this.$refs['form'].validate((valid)=>{
            if(valid){
              Promise
                .all([this.saveMemberSet(),this.savePoints()]).then(()=>{
                this.$message({
                  type:'success',
                  message:'保存成功！'
                });
              });
            }
          })

        }
      },
    }
</script>

<style lang="less">
#basicSetup{
  color:#606266;
  padding-bottom:55px;
  background: #fff;
  font-size:12px;
  .ts{
    background: #F2F6FC;
    border-radius: 4px;
    padding: 20px;
    margin: 5px 0;
    box-sizing: border-box;
    font-size: 14px;
    width:640px;
  }
  .per60{
    width:640px;
  }
  td{
    padding:20px 0px;
  }
  td .el-form-item__error{
    text-align: center;
    width:80%;
  }
  td .el-input{
    width:120px;
  }
  .alignCenter{
    text-align: center;
  }
  .el-table td {
    text-align: center;
  }
  td .el-form-item{
    margin-bottom: 0px;
  }
  .need{
    color:#f56c6c;
  }
  .rules{
    padding-left:150px;
    margin:-50px 0px 20px;
  }
}
</style>
