<template>
  <div id="orderDetail">
    <div id="order_detail" class="main-cont order-detail wx-main-cont">
      <div class="header">
        <h2>
          <span>订单编号：{{formData.sn}}</span>
          <span class="f-sn" v-if="formData.f_sn">({{formData.f_sn}})</span>
        </h2>
      </div>
      <div class="main">
        <div class="order-item order-data clearfix">
          <div class="order-info">
            <h2 class="title">订单信息</h2>
            <div class="inner form-box">
              <div class="group">
                <p class="item">
                  <span class="label">买　　家：</span>{{formData.username}}
                </p>
                <p class="item">
                  <span class="label">下单时间：</span>{{formData.createtime||''}}
                </p>
              </div>
              <div class="group" v-if="formData.type!='subscribe'">
                <p class="item">
                  <span class="label">付款方式：</span>{{formData.pay_name}}
                </p>
                <p class="item">
                  <span class="label">付款时间：</span>{{formData.pay_time!=0?formData.pay_time:''}}
                </p>
                <p class="item">
                  <!--<span class="label" id="payTitle" v-if="formData.zhuangtai == '待付款'||formData.zhuangtai == '已取消'">应付金额：</span>
                  <span class="label" id="payTitle" v-else-if="formData.zhuangtai == '已付款，待发货'
                  || formData.zhuangtai == '已付款，服务中'
                  || formData.zhuangtai == '已付款，待成团'
                  || formData.zhuangtai == '已付款，待核销'
                  || formData.zhuangtai == '服务完成，待买家确认'
                  || formData.zhuangtai == '已发货'
                  || formData.zhuangtai == '已完成'
                  || formData.zhuangtai=='已退款'
                  || formData.zhuangtai=='退款失败'
                  || formData.zhuangtai=='已发货，待买家确认'
                  || formData.zhuangtai=='退款中'
                  || formData.zhuangtai == '已核销，订单完成'
                  || formData.zhuangtai == '已成团，待核销'
                  ||formData.zhuangtai == '赠送待处理' ">实付金额：</span>-->
                  <span class="label" id="payTitle">{{formData.pay_status=='yes'?'实付金额':'应付金额'}}</span>
                  <span class="icon-bean">{{formData.order_money}}</span>
                </p>
              </div>
              <div class="group" v-if="formData.type=='goods'">
                <div v-if="formData.is_goods==1">
                  <p class="item">
                    <span class="label">收 货  人：</span>
                    <span class="name">{{formData.consignee}}</span>
                  </p>
                  <p class="item">
                    <span class="label">联系方式：</span>
                    <span class="tel">{{formData.mobile}}</span>
                  </p>
                  <p class="item">
                    <span class="label">收货地址：</span>
                    <span class="shipping-address">{{formData.full_address}}</span>
                  </p>
                  <p class="item">
                    <span class="label">买家留言：</span>
                    <span class="shipping-address">{{formData.remark}}</span>
                  </p>
                </div>
                <div v-else>
                  <p class="item">
                    <span class="label">联系方式：</span>
                    <span class="name">{{formData.mobile}}</span>
                  </p>
                  <p class="item">
                    <span class="label">备注信息：</span>
                    <span class="shipping-address">{{formData.remark}}</span>
                  </p>
                </div>
              </div>
              <div class="group" v-else-if="formData.type=='service_packages'">
                <p class="item">
                  <span class="label">联系方式：</span>
                  <span class="name">{{formData.mobile}}</span>
                </p>
                <p class="item">
                  <span class="label">预约时间：</span>
                  <span class="tel">{{formData.subscribe_time}}</span>
                </p>
                <p class="item">
                  <span class="label">使用期限：</span>
                  <span class="tel">{{formData.use_begin_time}} 至 {{formData.use_end_time}}</span>
                </p>
                <p class="item">
                  <span class="label">备注信息：</span>
                  <span class="shipping-address">{{formData.remark}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="order-state" v-if="formData.type=='goods' || formData.type=='virtual_goods' || formData.type=='service_packages'">
            <h2 class="title">订单状态</h2>
            <div class="inner">
              <div class="state-box" style="margin-top:0px;">
                <p class="state alignCenter">订单状态：<span class="strong state-text">{{formData.zhuangtai}}</span></p>
                <p class="opera alignCenter" v-if="formData.zhuangtai=='待付款'"><el-button size="mini" type="primary" @click="cancelOrder(formData.order_id)">取消订单</el-button></p>
                <div v-else-if="formData.zhuangtai=='已付款，待发货'||formData.zhuangtai=='已发货'||formData.zhuangtai=='已完成'">
                  <p class="pay-method">{{formData.pay_name}}</p>
                </div>
              </div>
              <div class="logis-axis" id="orderFlowDom" v-if="formData.type=='goods' && formData.is_goods == '1'">
                <h3 class="title">物流跟踪</h3>
                <p class="state" id="orderFlowCompany">物流公司：<span class="strong state-text">{{formData.shipping_name}}</span></p>
                <p class="state" id="orderFlowNumber">运货单号：<span class="strong state-text">{{formData.shipping_sn}}</span></p>
                <ul class="axis-list">
                  <li class="item" v-for="(item,index) in formData.wuliu">
                    <p class="time">{{item.time}}</p>
                    <p class="desc">{{item.context}}</p>
                  </li>
                </ul>
              </div>
              <div class="inner" v-if="formData.type=='virtual_goods'">
                <ul class="logis-axis" id="virtual_goods">
                  <li><span class="tab">客户手机：</span><span class="tabCont">{{formData.mobile}}</span></li>
                  <li><span class="tab">备注：</span><span class="tabCont">{{formData.remark}}</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="order-state" v-else-if="formData.type=='social_security'">
            <h2 class="title">参保信息</h2>
            <div class="inner">
              <ul class="logis-axis" id="social_security">
                <li><span class="tab">参保人：</span><span class="tabCont">{{formData.consignee}} {{formData.identity_card_number}}</span></li>
                <li><span class="tab">联系电话：</span><span class="tabCont">{{formData.mobile}}</span></li>
                <li><span class="tab">缴纳城市：</span><span class="tabCont">{{formData.buy_city}}</span></li>
                <li><span class="tab">户籍性质：</span><span class="tabCont">{{formData.family_register}}</span></li>
                <li><span class="tab">社保基数：</span><span class="tabCont">{{formData.social_security_lowest}}</span></li>
                <li><span class="tab">是否在该城市办过社保：</span><span class="tabCont">{{formData.buied_social_security==0?'否':'是'}}</span></li>
                <li v-if="formData.buy_accmulation_fund==1"><span class="tab">公积金基数：</span><span class="tabCont">{{formData.accmulation_fund_number}}</span></li>
                <li><span class="tab">缴纳时间：</span><span class="tabCont">{{formData.from_time}}起，共{{formData.num}}个月</span></li>
                <li v-if="formData.buy_accmulation_fund==0"></li>
                <li>
                  <span class="tab">身份证照片：</span>
                  <span class="tabCont" style="width:100%;display: block;">
                      <img :src="formData.identity_card_front"  @click="viewBig(formData.identity_card_front)"/>
                      <img :src="formData.identity_card_reverse"  @click="viewBig(formData.identity_card_reverse)"/>
                  </span>
                </li>
              </ul>
              <div class="viewBig" :class="bigsrc==''?'hidden':''" @click="viewBig()" >
                <img :src="bigsrc"/>
              </div>
            </div>
          </div>
          <div class="order-state" v-else-if="formData.type=='subscribe'">
            <h2 class="title">在线预约</h2>
            <div class="inner">
              <ul class="logis-axis" id="subscribe">
                <li><span class="tab">预约技师：</span><span class="tabCont">{{formData.goods[0].photo_name}}</span></li>
                <li><span class="tab">客户电话：</span><span class="tabCont">{{formData.mobile}}</span></li>
                <li><span class="tab">预约时间：</span><span class="tabCont">{{formData.subscribe_time}}</span></li>
                <li><span class="tab">预约项目：</span><span class="tabCont">{{formData.goods[0].sku_attr}}</span></li>
                <li><span class="tab">到店人数：</span><span class="tabCont">{{formData.num}}</span></li>
                <li><span class="tab">客户备注：</span><span class="tabCont">{{formData.remark}}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="goods-wrap" v-if="formData.type!='subscribe'">
          <table style="width:100%;" cellspacing="0" cellpadding="0" border="0" class="el-table el-table--border">
            <thead style="background-color: #f8f8f8;">
            <tr>
              <th class="is-leaf alignCenter" ><div class="cell">商品</div></th>
              <th class="is-leaf alignCenter"><div class="cell">单价</div></th>
              <th class="is-leaf alignCenter" ><div class="cell">数量</div></th>
              <th class="is-leaf alignCenter"><div class="cell">小计</div></th>
              <th class="is-leaf alignCenter" ><div class="cell">{{formData.type=='goods'?'运费':'服务费'}}</div></th>
            </tr>
            </thead>

            <tr v-for="(item,index) in formData.goods">
              <td>
                <div class="cell">
                  <div class="goods-content">
                    <div class="goods-img">
                      <img :src="item.image"  >

                    </div>
                    <div class="goods-info">
                      <p v-if="item.sign"><span class="oneY" >{{item.sign}}</span></p>
                      <p v-if="item.seckill_name">{{item.seckill_name}}</p>
                      <p >{{item.photo_name}}</p>
                      <p >{{item.sku_attr}}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="alignCenter">
                <div class="cell">{{item.goods_price}}</div>
              </td>
              <td class="alignCenter">
                <div class="cell">{{item.num}}</div>
              </td>
              <td class="alignCenter">
                <div class="cell">{{item.total_price}}</div>
              </td>
              <td :rowspan="formData.goods.length" v-if="index==0" class="alignCenter">
                <div class="cell">
                  <p v-if="formData.type=='goods'">{{formData.shipping_fee}}</p>
                  <p v-else>{{item.service_price*item.num}}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td class="cell" colspan="6">
                <p>
                  <span class="left">优惠减免：<span class="icon-bean price">{{formData.bonus}}</span>
                    <span v-if="formData.gift_goods_name!=''">赠品：{{formData.gift_goods_name}}</span>
                  </span>
                  <span class=" right total-price">应收总金额：<span class="icon-bean price">{{formData.order_money}}</span></span>
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import qs from 'qs';
    export default{
        data: function () {
            return {
              order_id:this.$route.params.id,
              curuid:sessionStorage.getItem('curuid'),
              formData:{},
              bigsrc:'',
            }
        },
      created(){
         this.get_order_detail();
      },
        methods: {
          //取消订单
          cancelOrder(id){
            this.$confirm('确认取消订单吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              const loading = this.$loading({
                lock: true,
                text: '正在取消~~',
              });
              var smData={buid:this.curuid};
              smData.order_id=id;
              this.api.request({
                url:this.api.cancel_order,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  loading.close();
                  this.$message({
                    type:'success',
                    message:'取消成功！'
                  });
                  this.get_order_detail();
                }else{
                  loading.close();
                  this.$message.error(res.data.state.msg);
                }
              });
            }).catch();
          },
          //放大身份证照
          viewBig(src){
            if(src)
            this.bigsrc=src;
            else
              this.bigsrc='';
          },
          //获取订单详情
          get_order_detail(){
            this.api.request({
              url:this.api.get_order_detail,
              params:{
                buid:this.curuid,
                order_id:this.order_id
              }
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.formData=res.data.data;
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          },
        }
    }
</script>
<style lang="less" scoped>
  #orderDetail{
    color:#606266;
    font-size:13px;

    .main {
      margin: 0!important;
      color:#909399;
      .order-data {
        margin-bottom: 30px;
        overflow: hidden;
      }
      .order-info, .order-state {
        position: relative;
        padding-bottom: 1000px;
        margin-bottom: -1000px;
        background-color: #fff;
      }
      .order-info {
        width: 450px;
        float: left;
      }
      .order-state {
        margin-left: 470px;
      }
      .order-data .title {
        padding: 10px 15px;
        font-size: 13px;
        border-bottom: 1px solid #ddd;
      }
      .order-data .inner {
        padding: 10px 15px;
      }
      .form-box .group {
        margin-bottom: 20px;
      }
      .form-box .item {
        margin-bottom: 5px;
        padding-left: 80px;
        word-break: break-all;
      }
      .form-box .label {
        float: left;
        position: relative;
        margin-left: -80px;
      }
      .form-box .item:after {
        display: table;
        content: "";
        clear: both;
      }
      li {
        list-style: none;
      }
      .state-box p {
        margin-bottom: 10px;
      }
      .pay-method {
        color: #999;
      }
      .strong{
        color:#30a5ff;
      }
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
          &.wname{
            margin-bottom:10px;
          }
          &.price{
            color:#f60;
            line-height: 20px;
            font-size:16px;
          }
        }
      }
    }
    .price{
      color:#f60;
      line-height: 40px;
      font-size:16px;
    }
    .alignCenter{
      text-align: center;
    }
    .order-detail-table .cell~.cell{
      width:20%;
    }
    .logis-axis {
      margin: 20px 0;
    }
    .logis-axis .title {
      padding: 20px 0 10px !important;
      font-size: 13px !important;;
      border-top: 1px solid #ddd;
      border-bottom: none !important;;
    }
    .logis-axis .item {
      position: relative;
      margin-top: 12px;
      padding: 0 20px 0 50px;
      overflow: hidden;
    }
    .logis-axis .item:before {
      width: 7px;
      height: 7px;
      position: absolute;
      top: 4px;
      left: 0;
      z-index: 2;
      content: "";
      background-color: #ccc;
      border-radius: 50%;
      margin: 3px;
    }
    .logis-axis .item:after {
      width: 0;
      height: 100%;
      position: absolute;
      top: 16px;
      left: 6px;
      z-index: 1;
      content: "";
      border-left: 1px solid #ddd;
    }
    .logis-axis .time {
      width: 140px;
      float: left;
      color: #888;
    }
    .logis-axis .desc {
      margin-left: 200px;
      color: inherit;
      word-break: break-all;
    }
    .logis-axis .item:last-child .desc {
      color: #f60;
    }
    .logis-axis .item:last-child:before {
      background-color: #000;
    }
    #social_security,#subscribe{
      width:100%;
    }
    #social_security li,#subscribe li{
      display: inline-block;
      width:48%;
      text-align: left;
      line-height: 22px;
      margin-bottom:10px;
    }
    #social_security li .tab{
      margin-right:20px;
    }
    #social_security li img{
      vertical-align: middle;
      cursor: pointer;
      max-width:110px;
      max-height:150px;
    }
    .hidden{
      display:none;
    }
    .viewBig{
      position: fixed;
      top:0px;
      left:0px;
      right:0px;
      bottom:0px;
      background: rgba(0,0,0,0.4);
      text-align:center;
      line-height: 80vh;
      z-index: 99999;
    }
    .viewBig img{
      vertical-align: middle;
      max-width:100%;
    }
    .left{
      display: inline-block;
      float:left;
    }
    .right{
      display: inline-block;
      float:right;
    }
    .header {
      background: #fff;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      margin-bottom: 20px;
      padding: 0 20px;
      h2 {
        font-size: 18px;
        font-weight: 400;
      }
    }
  }
</style>
