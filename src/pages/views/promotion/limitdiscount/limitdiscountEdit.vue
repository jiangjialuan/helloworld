<template>
<div id="limitdiscountEdit">
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="活动名称" prop="name" :rules="[{ required: true, message: '请输入活动名称', trigger: 'change'}]">
      <div v-if="userinfo.edit_flag&&from_parent==0"><el-input class="per60" v-model="form.name" :maxlength="20"></el-input> {{form.name.length}} / 20</div>
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
    <el-form-item label="活动商品" required="">
      <p v-if="userinfo.edit_flag&&from_parent==0">&nbsp;<el-button type="primary" size="mini" @click="open">选择商品</el-button></p>
    </el-form-item>
    <el-row class="rules" :style="userinfo.edit_flag&&from_parent==0?'':'margin-top: -45px;'">
      <table class="el-table el-table--border per60" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
        <tr>
          <th class="is-leaf" width="252"><div class="cell">商品</div></th>
          <th class="is-leaf" width="180"><div class="cell">设置打折</div></th>
          <th class="is-leaf" width="80"><div class="cell">折后价</div></th>
          <th class="is-leaf" width="80"><div class="cell">优惠金额</div></th>
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
          <td class="alignCenter">
            <el-form-item :prop="'activity_goods.' + goodidx + '.discount'" :rules="{validator: goodDiscount, trigger: 'change'}" label-width="0px">
              打折<el-input size="mini" type="number" v-model="good.discount" v-if="userinfo.edit_flag&&from_parent==0" ></el-input><span v-else>{{good.discount}}</span>折
            </el-form-item>
          </td>
          <td class="alignCenter">
            <p v-if="good.discount==''">自动计算</p>
            <p class="price" v-else>{{(good.discount*good.price/10).toFixed(2)}}</p>
          </td>
          <td class="alignCenter">
            <p  v-if="good.discount==''">自动计算</p>
            <p class="price" v-else>{{(good.price-good.discount*good.price/10).toFixed(2)}}</p>
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
        name: "limitdiscountEdit",
      data(){
          return {
            form:{
              id:this.$route.params.id?this.$route.params.id:'',
              name:'',
              data:[],
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
          this.$router.push('/promotion/limitdiscount');
        },
          //折扣验证
        goodDiscount(rule,value,callback){
          var arr=rule.field.split('.');
          if(value==''||value==undefined){
            callback(new Error('不能为空'))
          }else if(1<=parseFloat(value)&&parseFloat(value)<10){
            callback()
          }else{
            callback(new Error('请输入1~10之间的数字'));
          }

        },
        //打开选择商品弹框
        open(){
          this.$refs['selectGoods'].open();
        },
        //弹框确认事件
        selectGoodsComfirm(val){
          var arr=val;
          if(arr.length>0){
            this.form.activity_goods=[];
            for(var i=0;i<arr.length;i++){
              if(!arr[i].discount){
                arr[i].discount='';
              }
              if(!arr[i].id){
                arr[i].id='';
              }
              var obj={
                id:arr[i].id,
                discount:arr[i].discount,
                price:arr[i].price,
                image:arr[i].image,
                goods_name:arr[i].goods_name,
                goods_id:arr[i].goods_id,
                is_custom:arr[i].is_custom,
              };
              this.form.activity_goods.push(obj)
            }
          }

        },
        //表单验证
        valicateForm(){
          return new Promise((resolve,reject)=>{
            this.$refs['form'].validate((valid)=>{
              if(valid){
                if(this.form.activity_goods.length<=0){
                  this.$message.error('请选择参加活动的商品！');
                }else{
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
                var obj={
                  id:this.form.activity_goods[i].id,
                  bid:parseInt(this.form.activity_goods[i].goods_id),
                  discount:parseFloat(this.form.activity_goods[i].discount)
                }
                activetyDetail.push(obj);
              }
            }
            var smData={};
            smData.id=this.form.id;
            smData.buid=this.curuid;
            smData.name=this.form.name;
            smData.begin_time=this.form.data[0];
            smData.end_time=this.form.data[1];
            smData.activity_goods=JSON.stringify(activetyDetail);
            this.api.request({
              url:this.api.discount_store,
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
                this.$router.push({path:'/promotion/limitdiscount'});
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
        //获取限时折扣详情
        getDetail(id){
          var smData={
            buid:this.curuid,
            id:id
          }
          this.api.request({
            url:this.api.discount_detail_data,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.form.data=[res.data.data.begin_time,res.data.data.end_time];
              this.form.name=res.data.data.name;
              this.form.activity_goods=res.data.data.activity_goods;
              this.from_parent=res.data.data.from_parent;
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

<style lang="less">
  #limitdiscountEdit{
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
      padding-left:80px;
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
