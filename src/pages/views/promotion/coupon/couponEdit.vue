<template>
    <div id="couponEdit">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="优惠券名称" prop="name" :rules="[{ required: true, message: '请输入活动名称', trigger: 'change'}]">
          <div v-if="userinfo.edit_flag&&from_parent==0"><el-input class="per60" v-model="form.name" style="width:250px;" :maxlength="10"></el-input> {{form.name.length}} / 10</div>
          <div v-else>{{form.name}}</div>
        </el-form-item>
        <el-form-item label="生效时间" prop="data" :rules="[{ required: true, message: '请选择日期', trigger: 'change'}]">
          <div v-if="userinfo.edit_flag&&from_parent==0">
            <el-date-picker
              v-model="form.data"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
          <div v-else>{{form.data[0]}} 至 {{form.data[1]}}</div>
        </el-form-item>
        <el-form-item label="发放数量" prop="quantity" :rules="[{ required: true, message: '请输入发放数量', trigger: 'change'}]">
          <div v-if="userinfo.edit_flag&&from_parent==0"><el-input style="width:250px;" class="per60"  v-model="form.quantity"  type="number"></el-input> </div>
          <div v-else>{{form.quantity}}</div>
        </el-form-item>
        <el-form-item label="门槛限制">
          <div v-if="userinfo.edit_flag&&from_parent==0">
          <el-radio v-model="form.type" label="1">不限</el-radio>
          <el-radio v-model="form.type" label="2">消费满 <el-input type="number" style="width:100px;" size="mini" v-model="form.min_order_money"></el-input> 元可用</el-radio>
          </div>
          <div v-else>
            <span v-if="form.type==1">不限</span>
            <span v-if="form.type==2">消费满{{form.min_order_money}}元可用</span>
          </div>
        </el-form-item>
        <el-form-item label="优惠券金额" prop="quota" :rules="[{ required: true, message: '请输入优惠券金额', trigger: 'change'}]">
          <div v-if="userinfo.edit_flag&&from_parent==0">
            <el-input v-model="form.quota" class="per60" style="width:250px;" type="number"></el-input> 元
          </div>
          <div v-else>
              {{form.quota}}元
          </div>
        </el-form-item>
        <el-form-item label="领取次数" prop="per_receive_number"  :rules="[{ required: true, message: '请输入领取次数', trigger: 'change'}]">
          <div v-if="userinfo.edit_flag&&from_parent==0">
            <el-input v-model="form.per_receive_number" style="width:250px;" :disabled="true" class="per60" type="number"></el-input> 次
          </div>
          <div v-else>
            {{form.per_receive_number}}次
          </div>
        </el-form-item>
        <el-form-item label="适用范围" required="">
          <p v-if="userinfo.edit_flag&&from_parent==0">&nbsp;<el-button type="primary" size="mini" @click="open">选择商品</el-button></p>
        </el-form-item>
        <el-row class="rules" :style="userinfo.edit_flag&&from_parent==0?'':'margin-top: -45px;'">
          <table class="el-table el-table--border per60" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
            <tr>
              <th class="is-leaf" width="252"><div class="cell">商品</div></th>
              <th class="is-leaf" width="80" v-if="userinfo.edit_flag&&from_parent==0"><div class="cell">操作</div></th>
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
                    <p class="wname">￥{{good.price}}</p>
                  </div>
                </div>
              </td>
              <td class="alignCenter" v-if="userinfo.edit_flag&&from_parent==0"><el-button type="text" @click="cancelGoods(goodidx)">取消参加</el-button></td>
            </tr>
            <tr v-if="form.activity_goods.length<=0">
              <td colspan="5" class="alignCenter">暂时没有商品参加活动~</td>
            </tr>
          </table>
        </el-row>
      </el-form>
      <selectGood :version="version" ref="selectGoods" :requestOption="requestOption" :propSelect="form.activity_goods" @comfirm="selectGoodsComfirm"></selectGood>
      <div class="footerSubmit">
        <el-button type="primary" @click="submitform" v-if="userinfo.edit_flag&&from_parent==0">立即发布</el-button>
        <el-button type="primary" @click="goBack" v-else>返回</el-button>
      </div>
    </div>
</template>

<script>
  import selectGood from '../../../../components/selectgoods.vue'
  import qs from 'qs';
    export default {
        name: "couponEdit",
      data(){
        return {
          form:{
            id:this.$route.params.id?this.$route.params.id:'',
            name:'',
            data:[],
            quantity:'',
            type:'2',
            quota:'',
            per_receive_number:'1',
            min_order_money:'',
            activity_goods:[]
          },
          requestOption:{
            is_self:true
          },
          curuid:sessionStorage.getItem('curuid'),
          version:{
            hasReal:true,
            hasfictitious:true,
          },
          userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
          from_parent:'',
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
      methods:{
        //goBack返回
        goBack(){
          this.$router.push('/promotion/coupon');
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
                var flag=true;
                if(this.form.type==2){
                  if(this.form.min_order_money==''){
                    flag=false;
                    this.$message.error('请输入门槛限制！');
                  }
                  if(parseInt(this.form.min_order_money)<parseInt(this.form.quota)){
                    flag=false;
                    this.$message.error('门槛金额必须大于优惠金额！');
                  }
                }
                if(this.form.activity_goods.length<=0){
                  flag=false;
                  this.$message.error('请选择参加活动的商品！');
                }
                if(flag){
                  resolve();
                }
              }
            });
          });
        },
        //提交表单
        submitform(){
          this.valicateForm().then(()=>{
            var loading = this.$loading({
              lock: true,
              text: '正在发布，请稍候~~',
            });
            var activetyDetail=[];
            if(this.form.activity_goods.length>0){
              for(var i=0;i<this.form.activity_goods.length;i++){
                activetyDetail.push(parseInt(this.form.activity_goods[i].goods_id));
              }
            }
            var smData={};
            smData.id=this.form.id;
            smData.buid=this.curuid;
            smData.name=this.form.name;
            smData.begin_time=this.form.data[0];
            smData.end_time=this.form.data[1];
            smData.goods_ids=activetyDetail.join(',');
            smData.min_order_money=this.form.min_order_money;
            smData.per_receive_number=this.form.per_receive_number;
            smData.quantity=this.form.quantity;
            smData.quota=this.form.quota;
            smData.type=this.form.type;
            this.api.request({
              url:this.api.coupon_store,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'保存成功！'
                });
                loading.close();
                this.$router.push({path:'/promotion/coupon'});
              }else{
                loading.close();
                this.$message.error(res.data.state.msg);
              }
            });
          });
        },
        //重置表单
        resetForm() {
          this.$refs['form'].resetFields();
        },
        //获取优惠券详情
        getDetail(id){
          var smData={
            buid:this.curuid,
            id:id
          }
          this.api.request({
            url:this.api.coupon_detail_data,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.form.data=[res.data.data.begin_time,res.data.data.end_time];
              this.form.name=res.data.data.name;
              this.form.activity_goods=res.data.data.coupon_goods;
              this.from_parent=res.data.data.from_parent;
              this.form.min_order_money=res.data.data.min_order_money;
              this.form.per_receive_number=res.data.data.per_receive_number;
              this.form.quantity=res.data.data.quantity;
              this.form.quota=res.data.data.quota;
              this.form.type=res.data.data.type;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //取水商品参加
        cancelGoods(index){
          this.form.activity_goods.splice(index,1);
        }
      }
    }
</script>

<style lang="less" scoped>
  #couponEdit{
    color:#606266;
    padding-bottom:50px;
    background: #fff;
    font-size:12px;
    td{
      word-break: break-all;
    }
    td .el-checkbox__label{
      display: none;
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
      /*position: static;*/
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
      padding-left:120px;
      margin:0px 0px 20px;
    }
    .price{
      color:#f60;
      font-size:16px;
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
        }
      }
    }
  }
</style>
