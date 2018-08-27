<template>
<div id="rewardEdit">
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="活动名称" prop="name" :rules="[{ required: true, message: '请输入活动名称', trigger: 'change'}]">
      <div v-if="userinfo.edit_flag&&from_parent==0"><el-input class="per60" placeholder="活动名称" v-model="form.name" :maxlength="20" ></el-input> {{form.name.length}} / 20</div>
      <div v-else>{{form.name}}</div>
    </el-form-item>
    <el-form-item label="生效时间"  prop="data" :rules="[{ required: true, message: '请选择日期', trigger: 'change'}]">
      <el-date-picker v-if="userinfo.edit_flag&&from_parent==0"
        v-model="form.data"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <p v-else>{{form.data[0]}} 至 {{form.data[1]}}</p>
    </el-form-item>
    <el-form-item label="优惠设置">
    </el-form-item>
    <el-row class="rules per60">
      <table class="el-table el-table--border" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
        <tr>
          <th class="is-leaf"><div class="cell">层级</div></th>
          <th class="is-leaf"><div class="cell">优惠门槛</div></th>
          <th class="is-leaf" width="251"><div class="cell">优惠方式(可多选)</div></th>
          <th class="is-leaf" v-if="userinfo.edit_flag&&from_parent==0"><div class="cell">操作</div></th>
        </tr>
        <tr v-for="(item,index) in form.activity_detail" :key="'active'+index">
          <td class="alignCenter" width="40">{{index+1}}</td>
          <td class="alignCenter">
            <el-form-item :prop="'activity_detail.' + index + '.threshold_account'" :ref="'threshold_account'+index" :rules="{validator: numberValidate, trigger: 'change'}" label-width="0px">
              <p>满&nbsp;<el-input size="mini" type="number" :min="0" v-model="item.threshold_account"  v-if="userinfo.edit_flag&&from_parent==0"></el-input><span v-else>{{item.threshold_account}}</span>&nbsp;元</p>
            </el-form-item>
          </td>
          <td>

            <div class="cell" style="overflow:visible;">

              <div v-if="userinfo.edit_flag&&from_parent==0">
                <el-checkbox-group  v-model="item.checked"  @change="checkedChange" >
                  <p class="el-form-item__content" style="margin-bottom: 10px;" v-if="item.checked.indexOf('1')<0">
                    <el-checkbox label="1" >
                      <span>减</span>
                    </el-checkbox>
                    <el-input size="mini" type="number"  :min="0" v-model="item.privilege"></el-input>&nbsp;元
                  </p>
                  <el-form-item v-else :prop="'activity_detail.' + index + '.privilege'" :rules="{validator: privilege, trigger: 'change'}" label-width="0px" :ref="'privilege'+index">
                    <p style="margin-bottom: 10px;">
                      <el-checkbox label="1" >
                        <span>减</span>
                      </el-checkbox>
                      <el-input size="mini"  type="number" :min="0" v-model="item.privilege"></el-input>&nbsp;元
                    </p>
                  </el-form-item>
                  <p class="el-form-item__content" v-if="item.checked.indexOf('2')<0">
                    <el-checkbox label="2" >
                      <span>送</span>
                    </el-checkbox>
                    <el-input type="text"  size="mini" placeholder="赠品名称" v-model="item.gift_goods_name"></el-input>
                  </p>
                  <el-form-item v-else  :prop="'activity_detail.' + index + '.gift_goods_name'" :rules="{validator: gift_goods_name, trigger: 'change'}" label-width="0px">
                    <p><el-checkbox label="2" >
                      <span>送</span>
                    </el-checkbox>
                      <el-input type="text"  size="mini" placeholder="赠品名称" v-model="item.gift_goods_name"></el-input>&nbsp;&nbsp;&nbsp;
                    </p>
                  </el-form-item>
                </el-checkbox-group>
              </div>
              <div v-else>
                <p v-if="item.checked.indexOf('1')>=0">减{{item.privilege}}元</p>
                <p v-if="item.checked.indexOf('2')>=0">送{{item.gift_goods_name}}</p>
              </div>
            </div>
          </td>
          <td class="alignCenter" v-if="userinfo.edit_flag&&from_parent==0"><el-button type="text" v-if="form.activity_detail.length>1" @click="delActivegoods(index)">删除</el-button></td>
        </tr>
        <tr v-if="form.activity_detail.length<5">
          <td colspan="4" class="alignCenter" v-if="userinfo.edit_flag&&from_parent==0">
            <el-button type="text" @click="addActive">+新增一级优惠</el-button>
            <span>最多可设置五个层级 (每级优惠不累加)</span>
          </td>
        </tr>
      </table>
    </el-row>
    <el-form-item label="活动商品" required="">
      <!--<el-radio-group v-model="form.is_all_goods">
        <p><el-radio label="1">所有商品参加</el-radio></p>
        <p><el-radio label="0" style="margin-right:30px;">部分商品参加(已选择{{form.activity_goods.length}}个商品)</el-radio>
          <el-button :disabled="form.is_all_goods=='1'?true:false" size="mini" type="primary" @click="open">选择商品</el-button>
        </p>
      </el-radio-group>-->
      <p v-if="userinfo.edit_flag&&from_parent==0"><el-button  size="mini" type="primary" @click="open">选择商品</el-button></p>
      <!--&&form.is_all_goods=='0'-->
      <el-row v-if="form.activity_goods.length>0" style="padding-top:10px;">
        <table class="el-table el-table--border per60" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
          <tr>
            <th class="is-leaf"><div class="cell">商品</div></th>
            <th class="is-leaf"><div class="cell" v-if="userinfo.edit_flag&&from_parent==0">操作</div></th>
          </tr>
          <tr v-for="(good,goodidx) in form.activity_goods">
            <td>
              <div class="goods-content">
                <div class="goods-img">
                  <img :src="good.image"  >
                  <span class="parentIcon" v-if="good.sell==1">下架</span>
                  <span class="parentIcon" v-else-if="good.is_custom==6">总店</span>
                </div>
                <div class="goods-info">
                  <p class="wname">{{good.goods_name}}</p>
                  <p class="price">￥{{good.price}}</p>
                </div>
              </div>
            </td>
            <td class="alignCenter" v-if="userinfo.edit_flag&&from_parent==0"><el-button type="text" @click="cancelJoin(goodidx)">取消参加</el-button></td>
          </tr>
        </table>
      </el-row>
    </el-form-item>
  </el-form>
  <selectGood :version="goodData" :requestOption="requestOption" ref="selectGoods" :propSelect="form.activity_goods"  @comfirm="selectGoodsComfirm"></selectGood>
  <div class="footerSubmit">

    <el-button type="primary" @click="submitform" v-if="userinfo.edit_flag&&from_parent==0">立即发布</el-button>
    <el-button type="primary" @click="goback" v-else>返回</el-button>
  </div>
</div>
</template>

<script>
  import selectGood from '../../../../components/selectgoods.vue'
  import qs from 'qs';
    export default {
        name: "rewardEdit",
      data(){
        return {
          form:{
            id:this.$route.params.id?this.$route.params.id:'',
            name:'',
            data:'',
            activity_detail:[{checked:[],threshold_acount:'',id:'',privilege:'',gift_goods_name:''}],
            activity_goods:[],
            //is_all_goods:'1',
          },
          requestOption:{
            is_self:true
          },
          from_parent:'',
          curuid:sessionStorage.getItem('curuid'),
          userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
          goodData:{
            hasReal:true,
            hasfictitious:true,
          },
        }
      },
      components: {
        selectGood,
      },
      created(){
        if(this.form.id!=''){
          this.getDetail(this.form.id);
        }
      },
      mounted() {
      },
      methods: {
          //返回满减送列表
        goback(){
          this.$router.push({
            path:'/promotion/reward'
          });
        },
          checkedChange(){
            //this.$refs['form'].validate();
          },
          //数字验证
        numberValidate(rule,value,callback){
          var arr=rule.field.split('.');
          if(value==''||value==undefined){
            callback(new Error('不能为空'))
          }else if(parseFloat(value)<=0){
            callback(new Error('必须大于0'))
          }else{
            var prestr='',afterstr='';
            var pre=parseFloat(arr[1])-1;
            if(pre>=0&&this.form.activity_detail[pre]!=undefined){
              if(this.form.activity_detail[pre].threshold_account!=''){
                if(parseFloat(this.form.activity_detail[pre].threshold_account)<value){
                  if(this.$refs['threshold_account'+pre]!=undefined)
                  this.$refs['threshold_account'+pre][0].clearValidate();
                }else{
                  prestr='需大于上一级优惠门槛';
                  //(new Error('需大于上一级优惠门槛'))
                }
              }
            }
            var next=parseFloat(arr[1])+1;
            if(next<this.form.activity_detail.length&&this.form.activity_detail[next]!=undefined){
              if(this.form.activity_detail[next].threshold_account!=''){
                if(parseFloat(value)<parseFloat(this.form.activity_detail[next].threshold_account)){
                  if(this.$refs['threshold_account'+next]!=undefined)
                  this.$refs['threshold_account'+next][0].clearValidate();
                  //callback()
                }else{
                  afterstr='需小于下一级优惠门槛';
                  //callback(new Error('需小于下一级优惠门槛'))
                }
              }
            };
            if(value>parseFloat(this.form.activity_detail[arr[1]].privilege)){
              if(this.$refs['privilege'+arr[1]]!=undefined)
              this.$refs['privilege'+arr[1]][0].clearValidate();
            };
            if(prestr==''&&afterstr==''){
              callback();
            }else if(prestr!=''){
              callback(prestr);
            }else if(afterstr!=''){
              callback(afterstr);
            }
          }
        },
        //满减验证
        privilege(rule,value,callback){
          var arr=rule.field.split('.');
          var str=this.form.activity_detail[arr[1]].checked.find(item=>{
            return item=='1'
          });
          if(str!=undefined){
            if(value==''||value==undefined){
              callback(new Error('请输入买减金额！'));
            }else if(parseFloat(value)<=0) {
              callback(new Error('必须大于0'));
            }else if(parseFloat(value)>=parseFloat(this.form.activity_detail[arr[1]].threshold_account)){
                callback(new Error('减现金必须小于满减金额'))
            }else{
              callback()
            }
          }else{
            callback();
          }
        },
        //满送商品验证
        gift_goods_name(rule,value,callback){
          var arr=rule.field.split('.');
          if(this.form.activity_detail[arr[1]].checked.length<=0){
            callback(new Error('满减，满送至少选中其中一个！'))
          }else{
            var str=this.form.activity_detail[arr[1]].checked.find(item=>{
              return item=='2'
            });
            if(str!=undefined){
              if(value==''||value==undefined){
                callback(new Error('请输入赠送商品名称！'))
              }else{
                callback()
              }
            }else{
              callback()
            }
          }
        },
        //商品选择验证
        goodRadioValicate(rule,value,callback){
          if(value=='2'){
            if(this.form.activity_goods.length<=0){
              callback(new Error('请选择参加活动的商品！'))
            }else{
              callback()
            }
          }else{
            callback()
          }
        },
        //获取活动详情
        getDetail(id){
          var smData={
            id:id,
            buid:this.curuid
          }
          this.api.request({
            url:this.api.fullprivilege_detail_data,
            params:smData
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.form.id=res.data.data.id;
              this.form.name=res.data.data.name;
              this.form.data=[res.data.data.begin_time,res.data.data.end_time];
              if(res.data.data.activity_detail.length>0){
                res.data.data.activity_detail.forEach((item,i)=>{
                  res.data.data.activity_detail[i].checked=[];
                  if(parseFloat(item.privilege)!=0){
                    res.data.data.activity_detail[i].checked.push('1');
                  }
                  if(item.gift_goods_name!=''){
                    res.data.data.activity_detail[i].checked.push('2');
                  }
                });
                this.form.activity_detail=res.data.data.activity_detail;
              }
              this.from_parent=res.data.data.from_parent;
              this.form.activity_goods=res.data.data.activity_goods;
              //this.form.is_all_goods=res.data.data.is_all_goods;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //打开选择商品弹框
        open(){
          this.$refs['selectGoods'].open();
        },
        //弹框确认事件
        selectGoodsComfirm(val){
          this.form.activity_goods=val;
        },
        //表单验证
        valicateForm(){
          return new Promise((resolve,reject)=>{
            this.$refs['form'].validate((valid)=>{
              if(valid){

                //if(this.form.is_all_goods=='0'){
                  if(this.form.activity_goods.length<=0){
                    this.$message.error('请选择参加活动的商品！');
                  }else{

                    if(this.form.activity_detail.length>0){
                      for(var i=0;i<this.form.activity_detail.length;i++){
                        if(this.form.activity_detail[i].checked.length<=0){
                          this.$message.error('满减满送至少选择一种！');
                          reject();
                        }
                      }
                    }
                    resolve();
                  }
                /*}else{
                  resolve();
                }*/
              }
            });
          });
        },
        //提交表单
        submitform(){
          this.valicateForm().then(()=>{
            var activetyDetail=JSON.parse(JSON.stringify(this.form.activity_detail));

            for(var i=0;i<activetyDetail.length;i++){
              delete activetyDetail[i].checked;
              if(this.form.activity_detail[i].checked.indexOf('1')<0){
                activetyDetail[i].privilege=''
              }
              if(this.form.activity_detail[i].checked.indexOf('2')<0){
                activetyDetail[i].gift_goods_name=''
              }
            }

            var smData={
              buid:this.curuid,
              id:this.form.id,
              name:this.form.name,
              begin_time:this.form.data[0],
              end_time:this.form.data[1],
              activity_detail:JSON.stringify(activetyDetail),
             // is_all_goods:this.form.is_all_goods,
            };

            var goodsId=[];
            //if(this.form.is_all_goods=='0'){
              if(this.form.activity_goods.length>0){
                this.form.activity_goods.forEach(item=>{
                  goodsId.push(item.goods_id);
                })
              }
           // }
            smData.activity_goods_id=goodsId.join(',');
            var loading = this.$loading({
              lock: true,
              text: '正在发布，请稍候~~',
              background: 'rgba(255, 255, 255, 0.7)'
            });
            this.api.request({
              url:this.api.fullprivilege_store,
              params:smData
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'保存成功！'
                });
                this.$router.push({path:'/promotion/reward'});
              }else{
                this.$message.error(res.data.state.msg);
              }
              loading.close();
            });
          });
        },
        //清除表单验证效果
        clearForm() {
            if(this.$refs['form']!=undefined)
          this.$refs['form'].clearValidate();
        },
        //新增优惠活动
        addActive(){
          var obj={};
          obj.checked=[];
          obj.threshold_account='';
          obj.privilege='';
          obj.id='';
          obj.gift_goods_name='';
          this.form.activity_detail.push(obj);
        },
        //取消参加
        cancelJoin(index){
          this.form.activity_goods.splice(index,1);
        },
        //删除优惠门槛
        delActivegoods(index){
            this.form.activity_detail.splice(index,1)
        }
      }
    }
</script>

<style lang="less">
#rewardEdit{
  color:#606266;
  padding-bottom:50px;
  background: #fff;
  font-size:12px;

  td{
    word-break: break-all;
  }
  td .el-input{
    width:120px;
  }
  .list-group{
    display: inline-block;
  }
  td .el-form-item{
    margin:0px;
  }
  td .el-form-item__error{
    text-align: center;
    width:100%;
    top:35px;
    left:-5px;
   /* position: static;*/
  }
  .alignCenter{
    text-align: center;
  }
  .footerSubmit {
    background-color: rgba(0, 0, 0, 0.4);
    height: 50px;
    line-height: 50px;
    position: fixed;
    left: 260px;
    right: 0;
    bottom: 0;
    text-align: center;
    z-index: 1999;
    margin:0px;
  }
  .per60{
    width:640px;
  }
  .rules{
    padding-left:80px;
    margin:-50px 0px 20px;
  }
  .goods-content{
    width:240px;
    display: flex;
    .goods-img{
      width:60px;
      height:60px;
      margin-right:10px;
      display: inline-block;
      position: relative;
      img{
        width:60px;
        height:60px;
      }
      .parentIcon{
        display: inline-block;
        width:32px;
        height:18px;
        line-height: 18px;
        border-radius:1px;
        background: rgba(0,0,0,0.5);
        font-size:10px;
        position: absolute;
        bottom:3px;
        right:3px;
        color:#fff;
        text-align: center;
      }
    }

    .goods-info{
      width:160px;
      justify-content: center;
      display: flex;
      flex-direction: column;
      p{
        overflow : hidden;
        text-overflow: ellipsis;
        align-items: center;
        justify-content: center;
        line-height: 20px;
        &.wname{
          margin-bottom: 10px;
        }
        &.price{
          color:#f60;
          font-size:16px;
        }
      }
    }
  }

}
</style>
