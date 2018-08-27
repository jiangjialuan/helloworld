<template>
<div id="setshop">
  <el-form  ref="form" label-width="150px" :model="form" class="demo-ruleForm">
    <el-form-item label="到店自提设置">
      <el-radio v-model="form.pickup_self" label="1">开启</el-radio>
      <el-radio v-model="form.pickup_self" label="0">关闭</el-radio>
      <div class="ts">
        <p><b>温馨提示：</b></p>
        <p>1.开启到店自提后，顾客可在线下单并到店提货，请提前打包好货品，无需物流发货；</p>
        <p>2.顾客到店后，需提供提货二维码供商家核销订单。</p>
      </div>
    </el-form-item>
    <el-form-item v-if="form.pickup_self==1" label="自提地址" prop="pickup_address" :rules="[{ required: true, message: '自提地址不能为空', trigger: 'blur'}]">
      <el-input class="per60" v-model="form.pickup_address"></el-input>
    </el-form-item>
    <el-form-item  v-if="form.pickup_self==1" label="联系电话" prop="pickup_phone" :rules="[{ required: true, message: '联系电话不能为空', trigger: 'blur'},{validator: validatephone, trigger: 'blur'}]">
      <el-input class="per60" v-model="form.pickup_phone"></el-input>
    </el-form-item>
    <el-form-item  v-if="form.pickup_self==1" label="营业时间" prop="work_time" :rules="[{ required: true, message: '营业时间不能为空', trigger: 'blur'}]">
      <el-input class="per60" v-model="form.work_time"></el-input>
    </el-form-item>
    <el-form-item label="退款设置">
      <span style="color:#409EFF;">退款金额中不包括商品的运费</span>
    </el-form-item>
    <el-form-item label="收货人" prop="refund_person" :rules="[{ required: true, message: '请输入收货人', trigger: 'blur'}]">
      <el-input class="per60" v-model="form.refund_person"></el-input>
    </el-form-item>
    <el-form-item label="沟通电话" prop="refund_phone" :rules="[{ required: true, message: '沟通电话不能为空', trigger: 'blur'},{validator: validatephone, trigger: 'blur'}]">
      <el-input class="per60" v-model="form.refund_phone"></el-input>
    </el-form-item>
    <el-form-item label="所在地区" required="">
      <p>
      <el-cascader
        expand-trigger="hover"
        placeholder="请选择所在地区"
        :options="region"
        v-model="form.refund_region"
        :props="propData"
        >
      </el-cascader>
    </p>
    </el-form-item>
    <el-form-item label="详细地址" prop="refund_address" :rules="[{ required: true, message: '请输入详细地址', trigger: 'blur'}]">
      <p><el-input class="per60" v-model="form.refund_address"></el-input></p>
    </el-form-item>
    <el-form-item label="自动退款" v-if="userinfo.support_refund==1">
      <el-checkbox v-model="form.refund_type">未发货订单发起退款，将于
      <el-select v-model="form.refund_deadline" size="mini" placeholder="请选择">
        <el-option label="1小时" :value="1"></el-option>
        <el-option label="6小时" :value="6"></el-option>
        <el-option label="12小时" :value="12"></el-option>
        <el-option label="1天" :value="24"></el-option>
        <el-option label="2天" :value="48"></el-option>
        <el-option label="3天" :value="72"></el-option>
        <el-option label="7天" :value="168"></el-option>
      </el-select>
        后自动退款</el-checkbox>
      <div class="ts">
        <p><b>温馨提示：</b></p>
        <p>1.选择未发货自动退款并选择时间后，在收到退款订单后的对应时间内将会自动退款（例如选择了1小时，在6月20日下午15：00收到的退款订单，将在6月20日下午15：00-16：00时间段内进行自动退款）</p>
        <p>2.选择未发货自动退款后，在退款过程中可在订单操作中可点击退款按钮进行手动退款。</p>
      </div>
    </el-form-item>

  </el-form>
  <div class="footerSubmit"><el-button type="primary" @click="submitForm">保存</el-button></div>
</div>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "setshop",
      data(){
          return {
            propData:{
              label:'name',
              value:'id',
              children:'child'
            },
            form:{
              pickup_self:'0',
              refund_person:'',
              refund_phone:'',
              refund_address:'',
              refund_type:false,
              refund_deadline:'',
              refund_region:[],
              pickup_phone:'',
              work_time:'',
              pickup_address:''
            },
            region:[],
            oldtime:'',
            curuid:sessionStorage.getItem('curuid'),
            userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
          }
      },
      created(){
          this.getRegion().then(()=>{
            this.setForm();
          });
      },
      computed:{
      },
      methods:{
        //电话号码验证
        validatephone(rule,value,callback){
          var re1=/^(1(3|4|5|6|7|8|9)[0-9]{9})$/;
          var re2=/^(0\d{2,3}-\d{7,8})$/;
          if(value==''){
            callback(new Error('沟通号码不能为空'))
          }else if(!re1.test(value)&&!re2.test(value)){
            callback(new Error('请输入正确的手机号或电话'))
          }else{
            callback()
          }
        },
        //禁止重复点击
        throttle(currenttime,time){
          if(this.oldtime==''){
            this.oldtime=currenttime;
            return true;
          }else{
            if(currenttime-this.oldtime<time){
              this.oldtime=currenttime;
              return false;
            }else{
              this.oldtime=currenttime;
              return true;
            }
          };
        },
        //表单验证
        formValidate(){
          return new Promise((resolve,reject)=>{
            this.$refs['form'].validate((valid)=>{
              if(valid){
                if(this.form.refund_region[0]==undefined||this.form.refund_region[0]==''||this.form.refund_region[0]=='0'){
                  this.$message.error("请选择所在地区！")
                }else{
                  if(this.form.refund_type){
                    if(this.form.refund_deadline==''){
                      this.$message.error("请设置自动退款时间！")
                    }else{
                      resolve();
                    }
                  }else{
                    resolve()
                  }
                }
              }
            });
          });
        },
          //设置店铺保存触发事件
        submitForm(){
          if(this.throttle(new Date().getTime(),2000)) {
            this.formValidate().then((res)=>{
              var smData = {};
              smData = JSON.parse(JSON.stringify(this.form));
              smData.refund_province=smData.refund_region[0];
              smData.refund_city=smData.refund_region[1];
              smData.refund_district=smData.refund_region[2];
              if(!smData.refund_type) {
                smData.refund_type='1';
                smData.refund_deadline='';
              }else{
                smData.refund_type='2';
              }
              smData.buid = this.curuid;
              delete smData.refund_region;
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
            });
          }
        },
        //获取店铺设置数据
        setForm(){
            var smData={};
            smData.buid=this.curuid;
            this.api.request({
              url:this.api.getShopSet,
              params:smData,
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.form.pickup_self=res.data.data.pickup_self==1?'1':'0';
                this.form.refund_address=res.data.data.refund_address;
                //this.form.refund_region=[JSON.stringify(res.data.data.refund_province),JSON.stringify(res.data.data.refund_city),JSON.stringify(res.data.data.refund_district)];
                if(typeof res.data.data.refund_province=='number'){
                  this.form.refund_region=[JSON.stringify(res.data.data.refund_province),JSON.stringify(res.data.data.refund_city),JSON.stringify(res.data.data.refund_district)];
                }else{
                  this.form.refund_region=[res.data.data.refund_province,res.data.data.refund_city,res.data.data.refund_district];
                }
                this.form.refund_type=res.data.data.refund_type=='1'?false:true;
                this.form.refund_person=res.data.data.refund_person;
                this.form.refund_phone=res.data.data.refund_phone;
                this.form.refund_deadline=res.data.data.refund_deadline==0?'':res.data.data.refund_deadline;
                this.form.pickup_phone=res.data.data.pickup_phone;
                this.form.work_time=res.data.data.work_time;
                this.form.pickup_address=res.data.data.pickup_address;
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
        },
        //获取省市县
        getRegion(){
          return new Promise((resolve,reject)=>{
            this.api.request({
              url:this.api.get_region
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.region=res.data.data;
                resolve();
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          })
        },
      }
    }
</script>

<style lang="less">
  .el-select-dropdown{
    z-index:10001 !important;
  }
 #setshop{
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
   .rules{
     padding-left:150px;
     margin:0px 0px 20px;
   }
   .per60{
     width:640px;
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
     z-index: 10000;
     margin:0px;
   }
 }
</style>
