<template>
<div id="memberSetup">
  <el-row v-if="tableData.length>0&&!userinfo.is_sub_shop" >
    <el-button class="mybutton" type="primary" style="float:right; "  @click="editMemberGrade()">添加会员等级</el-button>
  </el-row>
  <div>
    <el-row :gutter="24" style="margin: 0px !important;" class="alignCenter">
      <el-col :span="6" v-for="(item,index) in tableData" :key="'index'+index" v-if="tableData.length>0">
        <el-card class="box-card" >
          <p class="alignCenter">{{item.name}}</p>
          <p  class="alignCenter"><img :src="item.level_pic" width="60" height="60"/></p>
          <p  class="alignCenter">需要积分{{item.need_points}}</p>
          <div class="detail">
            <p>正价折扣 <span class="active">{{item.goods_discount}}折</span></p>
            <p v-if="!userinfo.is_sub_shop">会员人数 <span>{{item.members}}</span></p>
          </div>
          <p  class="alignCenter btn" v-if="!userinfo.is_sub_shop">
            <el-button type="text" @click="editMemberGrade(item.id,index)">编辑</el-button>
            <el-button type="text" @click="delMemberGrace(item.id)" v-if="index!=0">删除</el-button>
          </p>
        </el-card>
      </el-col>
      <div class="box-card photos" v-if="tableData.length<=0">

        <el-button v-if="!userinfo.is_sub_shop" class="mybutton" type="primary"   @click="editMemberGrade()">添加会员等级</el-button>
        <p v-if="!userinfo.is_sub_shop"><span>暂无等级,点击添加等级</span></p>
        <p v-if="userinfo.is_sub_shop">暂无等级</p>
      </div>

    </el-row>
  </div>
  <!--等级设置-->
  <el-dialog title="等级设置" :visible.sync="dialogFormVisible">
    <el-form :model="form" ref="form"  label-width="100px">
      <el-form-item label="等级名称"  prop="name" :rules="{ required: true, message: '请输入等级名称', trigger: 'blur'}">
        <el-input v-model="form.name" :maxlength="10" auto-complete="off" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="所需积分"  prop="need_points" :rules="{ required: true, validator:optionsRules, trigger: 'blur'}">
        <el-input v-model="form.need_points" :disabled="form.is_default==1?true:false" style="width:200px;" type="number" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="会员折扣" class="discount"  prop="goods_discount" :rules="[{validator:numberFege, trigger: 'blur',required: true}]">
        <p>所有商品均享&nbsp;<el-input v-model="form.goods_discount" type="number" auto-complete="off"></el-input>&nbsp;折</p>
      </el-form-item>
      <p style="padding-left:100px;">会员折扣在正价基础上打折，不与其他优惠同时使用。</p>
    </el-form>
    <div slot="footer" class="dialog-footer alignCenter">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="member_store">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "memberSet",
      data(){
          return {
            curuid:sessionStorage.getItem('curuid'),
            tableData:[],
            dialogFormVisible:false,
            form:{
              id:'',
              buid:sessionStorage.getItem('curuid'),
              name:'',
              need_points:'',
              goods_discount:'',
              is_default:0,
            },
            needPointsDisable:false,
            userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
          }
      },
      created(){
          this.getList();
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
          //会员折扣验证0-10数字区间
        numberFege(rule,value,callback){
          if(value==''){
            callback(new Error('会员折扣不能为空'))
          }else if(parseFloat(value)<=0||parseFloat(value)>10){
            callback(new Error('请输入大于0小于等于10的数字'))
          }else{
            callback()
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
              this.tableData=res.data.data
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //添加会员等级
        editMemberGrade(id,idx){
          if(this.$refs['form']!=undefined){
            this.$refs['form'].clearValidate();
            this.$refs['form'].resetFields();
          }
          if(id){
            this.form.id=id;
            this.getMemberDetail(id);
            this.dialogFormVisible=true;
          }else{
            if(this.tableData.length>=10){
              this.$message.error('最多只能添加10个等级！');
            }else{
              this.form.id='',
              this.form.name='',
              this.form.goods_discount='',
              this.form.need_points='';
              this.dialogFormVisible=true;
            }
          }

        },
        //获取会员等级详情
        getMemberDetail(id){
          this.api.request({
            url:this.api.member_detail_data,
            params:{
              buid:this.curuid,
              id:id,
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.form.name=res.data.data.name;
              this.form.goods_discount=res.data.data.goods_discount;
              this.form.need_points=res.data.data.need_points;
              this.form.is_default=res.data.data.is_default;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //保存会员等级
        member_store(){
          this.$refs['form'].validate((valid)=>{
            if(valid){
              var smData=JSON.parse(JSON.stringify(this.form));
              var comName,comNeed_points;
              this.tableData.forEach(item=>{
                if(item.name==this.form.name&&this.form.id!=item.id){
                  comName=item;
                }
                if(item.need_points==this.form.need_points&&this.form.id!=item.id){
                   comNeed_points=item;
                }
              });
              if(comName==undefined&&comNeed_points==undefined){
                this.api.request({
                  url:this.api.member_store,
                  method:'post',
                  headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                  data:qs.stringify(smData)
                }).then((res)=>{
                  if(res.data.state.code==10200){
                    this.$message({
                      type:'success',
                      message:'保存成功'
                    });
                    this.getList();
                    this.dialogFormVisible = false
                  }else{
                    this.$message.error(res.data.state.msg);
                  }
                });
              }else if(comName!=undefined){
                this.$message.error('等级名称已经存在！');
              }else if(comNeed_points!=undefined){
                this.$message.error('不同等级，积分不能相同！');
              }
            }
          });

        },
        //删除会员等级
        delMemberGrace(id){
          this.$confirm('此操作将永远删除此会员等级，是否继续？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            var smData={
              buid:this.curuid,
              id:id
            };
            this.api.request({
              url:this.api.member_del,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'删除成功！'
                });
                this.getList();
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          });

        }
      },
    }
</script>

<style lang="less">
#memberSetup{
  color:#606266;
  padding-bottom:50px;
  font-size:12px;
  .active{
    color:#f60;
    line-height: 40px;
    font-size:16px;
  }
  .el-col{
    margin-bottom: 25px;
  }
  .discount{
    .el-form-item__error{padding-left:90px;}

  }
.nodata{
  width:200px;
  height:150px;
  line-height: 150px;
}
  .el-slider__stop{
    width: 16px;
    height: 16px;
    border: 2px solid #c0c4cc;
    background-color: #fff;
    border-radius: 50%;
    -webkit-transition: .2s;
    transition: .2s;
    user-select: none;
    vertical-align: middle;
    display: inline-block;
    top:-7px;
  }
  .el-slider__runway.disabled .el-slider__bar{
    background-color: #409EFF;
  }
  .el-slider__runway.disabled .el-slider__button{
    border: 2px solid #409EFF;
  }
  .mybutton{
    clear:both;
  }
  .alignCenter{
    text-align: center;
  }
  .el-input{
    width:120px;
  }
  .box-card{
    .detail{
      p{
        display: flex;
        justify-content: space-between;
      }
    }
    .btn{
      display: flex;
      justify-content: space-between;
    }
    p{
      line-height: 36px;
      img{
        border-radius:60px;
        display: inline-block;
      }
    }
  }
  .photos {
    padding: 5px;
    /*width:125px;*/
    display: inline-block;
    margin-right: 20px;
    position: relative;
    margin-bottom: 20px;
    .addphotos{
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
      height: 160px;
      cursor: pointer;
      line-height: 160px;
      vertical-align: top;
      text-align: center;
      font-size: 24px;
      &.hasbg{
        width:150px;
        height:100px;
      }
    }
  }
}
</style>
