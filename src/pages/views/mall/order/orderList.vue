<template>
<div id="transactionOrder">
  <el-tabs v-model="orderType" @tab-click="orderChange">
    <el-tab-pane label="交易订单" name="first">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input v-model="search.sn" placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="search.shipping_sn" placeholder="运单号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="search.status">
            <el-option label="全部" value="all"></el-option>
            <el-option label="待付款" value="nopay"></el-option>
            <el-option label="已付款" value="nosend"></el-option>
            <el-option label="待确认" value="sended"></el-option>
            <el-option label="已完成" value="ok"></el-option>
            <el-option label="已关闭" value="close"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            type="daterange"
            v-model="search.time"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单来源">
          <el-select v-model="search.order_source">
            <el-option label="全部" value="all"></el-option>
            <el-option label="合伙人订单" value="agent"></el-option>
            <el-option label="自营订单" value="self"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="买家">
          <el-input v-model="search.consignee"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary"  @click="getList(1)">筛选</el-button>
          <el-button type="primary" @click="exportOrder">导出订单</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeIndex" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待付款" name="nopay"></el-tab-pane>
        <el-tab-pane label="已付款" name="nosend"></el-tab-pane>
        <el-tab-pane label="待确认" name="sended"></el-tab-pane>
        <el-tab-pane label="已完成" name="ok"></el-tab-pane>
        <el-tab-pane label="已关闭" name="close"></el-tab-pane>
      </el-tabs>
      <div class="line"></div>
      <div>
        <table style="width:100%;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <th class="th" width="17%" style="min-width:266px;">商品</th>
            <th class="th" width="9%">单价/数量</th>
            <th class="th" width="9%">下单时间↓</th>
            <th class="th" width="10%" >收货人/预约信息<span v-if="hassocial()">/参保人</span></th>
            <th class="th" width="10%">订单状态</th>
            <th class="th" width="10%">佣金概况</th>
            <th class="th" width="10%">优惠/赠品</th>
            <th class="th" width="10%">实付金额</th>
            <th class="th" width="15%">备注</th>
          </tr>
        </table>
        <el-card v-if="tableData.length>0" class="box-card" shadow="never" v-for="(item,index) in tableData" :key="'order'+index" >
          <div slot="header" class="clearfix">
        <span>
          <span class="goods-type" :class="[['distribution','custom','','agency','private','private'][item.is_custom]]">
              {{['分销','定制','','代售','代理','拼团'][item.is_custom]}}
          </span>
        </span>
            <span>订单编号：{{item.sn}} {{item.f_sn?'（'+item.f_sn+'）':''}}</span>
            <label v-if="item.free_sign" class="red">（{{item.free_sign}}）</label>
            <el-button style="float: right; padding: 3px 0" type="text"  @click="goDetail(item.order_id)">查看详情</el-button>
          </div>
          <table style="width:100%;" cellspacing="0" cellpadding="0" border="0" class="el-table--border">
            <tr v-for="(gooditem,idx) in item.goods" :key="'good'+idx" v-if="idx<5">
              <td class="td" width="17%">
                <div class="cell">
                  <div class="goods-header">
                    <div class="goods-image">
                      <img alt="" :src="gooditem.image" width="60" height="60">
                      <span class="parentIcon"  v-if="item.goods_order_type==4">总店</span>
                    </div>
                    <div class="goods-info">
                      <p class="goods-info-title">{{ gooditem.photo_name }}</p>
                      <p class="attr">{{gooditem.sku_attr.indexOf('一米精通')!=-1?gooditem.sku_attr:''}}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="td" width="9%">
                <div class="cell">
                  <p v-if="item.type!='subscribe'">￥<span class="active">{{gooditem.goods_price}}</span></p>
                  <p>
                    数量：{{gooditem.num}}
                    <span v-if="item.type =='social_security'">个月</span>
                    <span v-else-if="item.type =='subscribe'">人</span>
                    <span v-else>件</span>
                  </p>
                </div>
              </td>
              <td class="td" width="9%" v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell">{{item.createtime}}</div>
              </td>
              <td class="td" width="10%" v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell">
                  <p class="name">{{item.consignee || "客户电话："}}</p>
                  <p class="tel">{{item.mobile || ""}}</p>
                  <p class="address">
                    <span v-if="item.type =='social_security'">{{item.identity_card_number || ""}}</span>
                    <!--<span v-else>{{item.province || ""}} {{item.city || ""}}</span>-->
                    <span v-else>{{item.full_address||''}}<i v-if="item.full_address&&item.type=='goods'&&(item.zhuangtai == '待付款'||item.zhuangtai == '已付款，待发货'||item.zhuangtai == '已成团，待发货')"  class="el-icon-edit" @click="editAddress(index)" style="color:#409EFF;"></i></span>
                  </p>
                </div>
              </td>
              <td class="td" width="10%" v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell">
                  <p class="state"><span class="state-text">{{item.zhuangtai}}</span></p>
                  <p class="opera" v-if="item.zhuangtai == '待付款'">
                    <el-button type="text" @click="cancelOrder(index)">取消订单</el-button>
                  </p>
                  <p class="opera" v-if="(item.zhuangtai == '已发货，待买家确认' || item.zhuangtai == '已完成')&&item.is_my_goods == 'yes'">
                    <span v-if="item.is_goods == 1">运单号:{{item.shipping_sn}}</span>
                  </p>
                  <p v-else>{{item.pay_name}}</p>
                  <p class="opera" v-if="(item.zhuangtai == '已付款，待发货' || item.zhuangtai == '已成团，待发货')&&item.is_my_goods == 'yes'">
                    <el-button type="text" @click="sendGoods(index)">发货</el-button>
                  </p>
                  <p class="opera" v-if="(item.zhuangtai == '已付款，服务中' || item.zhuangtai == '已成团，商家服务中') && item.is_my_goods == 'yes'">
                    <el-button type="text"  @click="completeService(index)">完成服务</el-button>
                  </p>
                  <p class="opera" v-if="(item.zhuangtai=='已成团，待核销'||item.zhuangtai == '已付款，待核销') && item.is_my_goods == 'yes'">
                    <el-button type="text" @click="verification_order(index)">核销</el-button>
                  </p>
                  <p class="opera" v-if="item.zhuangtai == '已发货，待买家确认' && item.is_my_goods == 'yes'">
                    <el-button type="text" @click="modifyLogistics(index)">修改物流</el-button>
                  </p>
                  <p class="opera" v-if="item.zhuangtai == '已发货，待买家确认' && item.buy_type == 'yes' && item.buy_type_status == 'yes'">
                    <el-button type="text">确认收货</el-button>
                  </p>
                </div>
              </td>
              <td class="td" width="10%" v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell" v-if="item.is_custom == '3'">
                  <p>合伙人：{{item.agent_name}}</p>
                  <p>帐号：{{item.agent_account}}</p>
                  <p>分佣比例：{{item.proportion}}%</p>
                  <p>
                    <span v-if="item.type != 'subscribe'">总佣金：¥{{item.total_commission}}</span>
                    <span v-else>/</span>
                  </p>
                </div>
                <div class="cell" v-else-if="item.is_custom == '4'">
                  <p v-if="item.type != 'subscribe'">
                    总佣金：¥{{item.total_commission}}
                  </p>
                  <p v-else>
                    /
                  </p>
                </div>
                <div class="cell" v-else>/</div>
              </td>
              <td class="td" width="10%"  v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell">
                  <p class="opera" v-if="item.bonus>0">优惠减免：</p>
                  <p v-if="item.bonus>0">{{item.bonus}}</p>
                  <p class="opera" v-if="item.gift_goods_name!=''">赠品：</p>
                  <p v-if="item.gift_goods_name!=''">{{item.gift_goods_name}}</p>
                  <p class="opera" v-if="!(item.bonus>0||item.gift_goods_name!='')">/</p>
                </div>
              </td>
              <td class="td" width="10%" v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell">
                  <p class="icon-bean price" v-if="item.type != 'subscribe'">￥<span class="active">{{item.order_money}}</span></p>
                  <p class="icon-bean price" v-if="item.type == 'subscribe'">/</p>
                  <p v-if="item.type == 'social_security' || item.type == 'goods'">
                    <span v-if="item.type == 'social_security'">含服务费</span>
                    <span v-else>含运费</span>
                    <span>:</span>
                    <span v-if="item.type == 'social_security'">￥<span class="active">{{item.total_service_price}}</span></span>
                    <span v-else>￥<span class="active">{{item.shipping_fee}}</span></span>
                  </p>
                </div>
              </td>
              <td class="td" width="15%" v-if="idx==0" :rowspan="item.goods.length">
                <div class="cell" style="text-align:left;padding:12px 5px;">
                  <p>买家备注：{{item.remark==''?'无':item.remark}}</p>
                  <p>商家备注：
                    {{item.seller_remark}}
                    <el-button type="text" v-if="item.seller_remark==''" @click="editRemark(index)">新增备注</el-button>
                    <i v-else class="el-icon-edit" @click="editRemark(index)" style="color:#409EFF;"></i>
                  </p>
                </div>
              </td>
            </tr>
            <tr v-if="item.goods.length>5">
              <td class="td" colspan="10">剩余{{item.goods.length-5}}项未显示，<el-button type="text" @click="goDetail(item.order_id)">查看详情</el-button></td>
            </tr>
          </table>
        </el-card>
        <div v-if="tableData.length<=0" class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
      </div>
      <div class="block alignCenter">
        <el-pagination
          @current-change="getList"
          :page-size="pagination.per_page"
          layout="total,  prev, pager, next, jumper"
          :total="pagination.total_count">
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="售后订单" name="second">
      <el-form :inline="true" :model="search2" class="demo-form-inline">
        <el-form-item label="运单号">
          <el-input v-model="search2.rs_sn" placeholder="运单号"></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            type="daterange"
            v-model="search2.time"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退款联系人">
          <el-input v-model="search2.rc_person" placeholder="退款联系人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="getList2(1)">筛选</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="search2.status" type="card" @tab-click="handleClick2">
        <el-tab-pane label="全部" name="refund"></el-tab-pane>
        <el-tab-pane label="退款中" name="refunding"></el-tab-pane>
        <el-tab-pane label="退款成功" name="refunded"></el-tab-pane>
        <el-tab-pane label="退款失败" name="refund_fail"></el-tab-pane>
      </el-tabs>
      <div>
        <div>
          <table style="width:100%;" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <th class="th" width="17%" >商品</th>
              <th class="th" width="9%">单价/数量</th>
              <th class="th" width="9%">下单时间↓</th>
              <th class="th" width="8%" >收货人</th>
              <th class="th" width="9%">退款联系人</th>
              <th class="th" width="9%">订单状态</th>
              <th class="th" width="9%">实付金额</th>
              <th class="th" width="10%">退款理由</th>
              <th class="th" width="15%">物流信息</th>
              <th class="th" width="8%">操作</th>
            </tr>
          </table st>
          <el-card v-if="tableData2.length>0" class="box-card" shadow="never" v-for="(item,index) in tableData2" :key="'order'+index" >
            <div slot="header" class="clearfix">
              <span>
                <span class="goods-type" :class="[['distribution','custom','','agency','private','private'][item.is_custom]]">
                    {{['分销','定制','','代售','代理','拼团'][item.is_custom]}}
                </span>
              </span>
              <span>订单编号：{{item.sn}} {{item.f_sn?'（'+item.f_sn+'）':''}}</span>
              <label v-if="item.free_sign" class="red">（{{item.free_sign}}）</label>
              <el-button style="float: right; padding: 3px 0" type="text"  @click="goDetail(item.order_id)">查看详情</el-button>
            </div>
            <table style="width:100%;" cellspacing="0" cellpadding="0" border="0" class="el-table--border" >
              <tr v-for="(gooditem,idx) in item.goods" :key="'good'+idx" v-if="idx<5">
                <td class="td" width="17%">
                  <div class="cell">
                    <div class="goods-header">
                      <div class="goods-image">
                        <img alt="" :src="gooditem.image" width="60" height="60">
                        <span class="parentIcon"  v-if="item.goods_order_type==4">总店</span>
                      </div>
                      <div class="goods-info">
                        <p class="goods-info-title">{{ gooditem.photo_name }}</p>
                        <p class="attr">{{gooditem.sku_attr.indexOf('一米精通')!=-1?gooditem.sku_attr:''}}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="td" width="9%">
                  <div class="cell">
                    <p v-if="item.type!='subscribe'">￥<span class="active">{{gooditem.goods_price}}</span></p>
                    <p>
                      数量：{{gooditem.num}}
                      <span v-if="item.type =='social_security'">个月</span>
                      <span v-else-if="item.type =='subscribe'">人</span>
                      <span v-else>件</span>
                    </p>
                  </div>
                </td>
                <td class="td" width="9%" v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">{{item.createtime}}</div>
                </td>
                <td class="td" width="8%" v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">
                    <p class="name">{{item.consignee || "客户电话："}}</p>
                    <p class="tel">{{item.mobile || ""}}</p>
                    <p class="address">
                      <span v-if="item.type =='social_security'">{{item.identity_card_number || ""}}</span>
                      <span v-else>{{item.full_address||''}}<i v-if="item.full_address&&item.type=='goods'&&(item.zhuangtai == '待付款'||item.zhuangtai == '已付款，待发货'||item.zhuangtai == '已成团，待发货')"  class="el-icon-edit" @click="editAddress(index)" style="color:#409EFF;"></i></span>
                    </p>
                  </div>
                </td>
                <td class="td" width="9%" v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">
                    <p>{{item.refund_contact_person}}</p>
                    <p>{{item.refund_contact_phone}}</p>
                  </div>
                </td>
                <td class="td" width="9%" v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">
                    <p class="state"><span class="state-text">{{item.zhuangtai}}</span></p>
                    <p class="opera" v-if="item.zhuangtai == '待付款'">
                      <el-button type="text" @click="cancelOrder(index)">取消订单</el-button>
                    </p>
                    <p class="opera" v-if="(item.zhuangtai == '已发货，待买家确认' || item.zhuangtai == '已完成')&&item.is_my_goods == 'yes'">
                      <span v-if="item.is_goods == 1">运单号:{{item.shipping_sn}}</span>
                    </p>
                    <p v-else>{{item.pay_name}}</p>
                    <p class="opera" v-if="(item.zhuangtai == '已付款，待发货' || item.zhuangtai == '已成团，待发货')&&item.is_my_goods == 'yes'">
                      <el-button type="text" @click="sendGoods(index)">发货</el-button>
                    </p>
                    <p class="opera" v-if="(item.zhuangtai == '已付款，服务中' || item.zhuangtai == '已成团，商家服务中') && item.is_my_goods == 'yes'">
                      <el-button type="text"  @click="completeService(index)">完成服务</el-button>
                    </p>
                    <p class="opera" v-if="(item.zhuangtai=='已成团，待核销'||item.zhuangtai == '已付款，待核销') && item.is_my_goods == 'yes'">
                      <el-button type="text" @click="verification_order(index)">核销</el-button>
                    </p>
                    <p class="opera" v-if="item.zhuangtai == '已发货，待买家确认' && item.is_my_goods == 'yes'">
                      <el-button type="text" @click="modifyLogistics(index)">修改物流</el-button>
                    </p>
                    <p class="opera" v-if="item.zhuangtai == '已发货，待买家确认' && item.buy_type == 'yes' && item.buy_type_status == 'yes'">
                      <el-button type="text">确认收货</el-button>
                    </p>
                  </div>
                </td>
                <td class="td" width="9%" v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">
                    <p class="icon-bean price" v-if="item.type != 'subscribe'">￥<span class="active">{{item.order_money}}</span></p>
                    <p v-if="item.type == 'social_security' || item.type == 'goods'">
                      <span v-if="item.type == 'social_security'">含服务费</span>
                      <span v-else>含运费</span>
                      <span>:</span>
                      <span v-if="item.type == 'social_security'">￥<span class="active">{{item.total_service_price}}</span></span>
                      <span v-else>￥<span class="active">{{item.shipping_fee}}</span></span>
                    </p>
                  </div>
                </td>

                <td class="td" width="10%" v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">{{item.refund_reason}}</div>
                </td>
                <td class="td" width="15%"  v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">
                    <p>物流公司名称:{{item.refund_shipping_name?item.refund_shipping_name:'无'}}</p>
                    <p>物流单号:{{item.refund_shipping_sn?item.refund_shipping_sn:'无'}}</p>
                  </div>
                </td>
                <td class="td" width="8%"  v-if="idx==0" :rowspan="item.goods.length">
                  <div class="cell">
                    <div v-if="item.support_refund==1">
                      <p v-if="item.refund_result==0||item.refund_result==2"><el-button type="text" @click="refund(item.order_id)">退款</el-button></p>
                      <div class="opera" v-else-if="item.refund_result==1">
                        <p>退款成功</p>
                        <p><span v-if="item.refund_type==0">人工退款</span><span v-if="item.refund_type==1"> 自动退款</span></p>
                      </div>
                    </div>
                    <div v-else>
                      <p v-if="item.refund_result==0||item.refund_result==2"><el-button type="text" @click="refundAlert(item.order_id)">退款</el-button></p>
                      <p v-if="item.refund_result==0||item.refund_result==2"><el-button type="text" @click="refundComfirm(item.order_id)">标记为已退款</el-button></p>
                      <div class="opera" v-else-if="item.refund_result==1">
                        <p>退款成功</p>
                        <p><span v-if="item.refund_type==0">人工退款</span><span v-if="item.refund_type==1"> 自动退款</span></p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="item.goods.length>=5">
                <td class="td" colspan="10">剩余{{item.goods.length-5}}项未显示，<el-button type="text" @click="goDetail(item.order_id)">查看详情</el-button></td>
              </tr>
            </table>
          </el-card>
          <div v-if="tableData2.length<=0" class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
        </div>
        <div class="block alignCenter">
          <el-pagination
            @current-change="getList2"
            :page-size="pagination2.per_page"
            layout="total,  prev, pager, next, jumper"
            :total="pagination2.total_count">
          </el-pagination>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!--修改物流-->
  <el-dialog title="发货" :visible.sync="logisticsVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
    <div>
      <table style="width:100%;" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <th class="th" >商品</th>
          <th class="th" width="150">单价/数量</th>
        </tr>
      </table>
      <div  style="max-height: 200px;overflow:auto;">
        <el-card  class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>订单编号：{{logistics.sn}} {{logistics.f_sn?'（'+logistics.f_sn+'）':''}}</span>
            <label v-if="logistics.free_sign" class="red">（{{logistics.free_sign}}）</label>
          </div>
          <table style="width:100%;" cellspacing="0" cellpadding="0" border="0" class="el-table--border">
            <tr v-for="(gooditem,idx) in logistics.goods" :key="'good'+idx">
              <td class="td" >
                <div class="cell">
                  <div class="goods-header">
                    <div class="goods-info">
                      <p class="goods-info-title" :class="gooditem.photo_name.length>23?'trickleOut':''">{{ gooditem.photo_name }}</p>
                      <p class="goods-info-title">{{gooditem.sku_attr}}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="td" width="150">
                <div class="cell">
                  <p>{{gooditem.num}}</p>
                </div>
              </td>
            </tr>
          </table>
        </el-card>
      </div>
      <el-form :model="logistics" label-width="80px" ref="logisticsForm">
        <el-form-item label="收货地址" >
          <label>{{logistics.full_address}}</label>
        </el-form-item>
        <el-form-item label="物流公司" :prop="logistics.shipping_name=='其他'?'shipping_logistics':'shipping_name'" :rules="[{required: true, message: '请输入物流公司', trigger: 'change'}]">
          <el-select v-model="logistics.shipping_name" placeholder="请选择一个物流公司">
            <el-option label="申通速递" value="申通"></el-option>
            <el-option label="圆通速递" value="圆通"></el-option>
            <el-option label="中通快递" value="中通"></el-option>
            <el-option label="顺丰速递" value="顺丰"></el-option>
            <el-option label="优速快递" value="优速"></el-option>
            <el-option label="韵达快递" value="韵达"></el-option>
            <el-option label="天天快递" value="天天"></el-option>
            <el-option label="德邦物流" value="德邦"></el-option>
            <el-option label="百世快递" value="百世"></el-option>
            <el-option label="邮政包裹" value="邮政包裹"></el-option>
            <el-option label="EMS" value="EMS"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
          <el-input v-if="logistics.shipping_name=='其他'" style="width:217px;" v-model="logistics.shipping_logistics"></el-input>
        </el-form-item>
        <el-form-item label="运单号码" prop="shipping_sn" :rules="[{required: true, message: '请输入运单号码', trigger: 'blur'},{validator: Alphanumeric, trigger: 'blur'}]">
          <el-input style="width:217px;" v-model="logistics.shipping_sn"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="logisticsVisible = false">取 消</el-button>
      <el-button type="primary" @click="logisticsComfirm">确 定</el-button>
    </div>
  </el-dialog>
  <!--修改地址-->
  <el-dialog title="修改地址" :visible.sync="addressVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
    <div>
      <el-form :model="address" label-width="80px" ref="address">
        <el-form-item label="所在地区" required="">
          <p>
            <el-cascader
              expand-trigger="hover"
              placeholder="请选择所在地区"
              :options="region"
              v-model="address.refund_region"
              :props="propData"
            >
            </el-cascader>
          </p>
        </el-form-item>
        <el-form-item label="详细地址" prop="refund_address" :rules="[{ required: true, message: '请输入详细地址', trigger: 'blur'}]">
          <p><el-input class="per60" v-model="address.refund_address"></el-input></p>
        </el-form-item>
      </el-form>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="addressVisible = false">取 消</el-button>
      <el-button type="primary" @click="addressComfirm">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import qs from 'qs';
    export default {
        data:function(){
            return {
              screeHeight:window.innerHeight,
              permission:JSON.parse(sessionStorage.getItem('permission')),
              version:sessionStorage.getItem('version'),
              orderType:'first',
              search:{
                sn:'',
                shipping_sn:'',
                status:'',
                time:'',
                consignee:'',
                f_sn:'',
                order_source:'',
              },
              checkAll:[],
              checkedOrder:[],
              search2:{
                rc_person:'',
                rs_sn:'',
                time:'',
                status:'refund'
              },
              addressVisible:false,
              address:{
                refund_address:'',
                refund_region:[],
                order_id:''
              },
              propData:{
                label:'name',
                value:'id',
                children:'child'
              },

              activeIndex2:'',
              pagination2:{
                page:1,
                total_count:0,
                total_page:0,
                per_page:20
              },
              tableData2:[],
              pagination:{
                page:1,
                total_count:0,
                total_page:0,
                per_page:20
              },
              region:[],
              curuid:sessionStorage.getItem('curuid'),
              currentpage:1,
              activeIndex:'all',
              tableData: [],
              logisticsVisible:false,
              logistics:{}
            }
        },
      created(){
        this.getList(1);
        this.getRegion();
      },
      methods:{
          //修改地址确认
        addressComfirm(){
          this.$refs['address'].validate((valid)=>{
            if(valid){
              var smData={};
              smData.buid=this.curuid;
              smData.order_id=this.address.order_id;
              smData.address=this.address.refund_address;
              smData.province=this.address.refund_region[0];
              smData.city=this.address.refund_region[1];
              smData.district=this.address.refund_region[2];
              this.api.request({
                url:this.api.update_order_address,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                    this.addressVisible=false;
                    this.$message({
                      type:'success',
                      message:"修改成功！"
                    });
                    if(this.orderType=='first'){
                      this.getList(this.pagination.page);
                    }else{
                      this.getList2(this.pagination2.page)
                    }
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });
            }
          });
        },

          //修改地址
        editAddress(index){
          this.addressVisible=true;
          if(this.orderType=='first'){
            this.address.refund_address=this.tableData[index].address;
            this.address.order_id=this.tableData[index].order_id;
            this.address.refund_region=[this.tableData[index].province_id,this.tableData[index].city_id,this.tableData[index].district_id]
          }else{
            this.address.refund_address=this.tableData2[index].address;
            this.address.order_id=this.tableData2[index].order_id;
            this.address.refund_region=[this.tableData2[index].province_id,this.tableData2[index].city_id,this.tableData2[index].district_id]
          }
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
        //不支持退款的退款弹框
        refundAlert(id){
          this.$confirm('请复制订单号登录微信商户号进入退款页面进行手动退款', '提示', {
            cancelButtonText: '关闭',
            showConfirmButton:false,
          }).then().catch();
        },
        //不支持退款的退款确认
        refundComfirm(id){
          this.$confirm('此操作将对订单进行退款确认，请确保订单已完成退款，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            var smData={};
            smData.buid=this.curuid;
            smData.order_id=id;
            this.api.request({
              url:this.api.refund_sign,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.getList2(this.pagination2.page);
                this.$message({
                  type:'success',
                  message:'退款成功！'
                });
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },
          //退款操作处理
        refund(id){
          this.$confirm('此操作将一键退款, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            var smData={};
            smData.buid=this.curuid;
            smData.order_id=id;
            this.api.request({
              url:this.api.refund,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.getList2(this.pagination2.page);
                this.$message({
                  type:'success',
                  message:'退款成功！'
                });
              }else{
                this.$message.error('退款失败！请确保微信商户号余额充足！其他问题请联系一米！');
              }
            });
          }).catch();
        },
          //交易订单与售后订单切换发事件
        orderChange(tab){
          if(this.orderType=='first'){
            this.getList(1);
          }else{
            this.getList2(1);
          }
        },
        //checked全选
        handleCheckAllChange(val){
          this.checkedOrder = val ? this.tableData2 : [];
        },
        //checked改变触发事件
        handleCheckedOrderChange(value){
          let checkedCount = value.length;
          this.checkedOrder=value;
          this.checkAll = checkedCount === this.tableData2.length;
        },
          //去详情
        goDetail(id){
          this.$router.push({path:'/mall/orderDetail/'+id});
        },
          //数字与字母组合
        Alphanumeric(rule,value,callback){
          var reg=/^[0-9a-zA-Z]+$/;
          if(!reg.test(value)){
            callback(new Error('请输入正确的运单号码'))
          }else{
            callback()
          }
        },
          //选项卡切换触发事件
        handleClick(tab){
          this.search.status=tab.name;
          this.getList(1);
        },
        handleClick2(tab){
          this.getList2(1);
        },
          //是否有社保权限
        hassocial(){
          if(this.version.indexOf('社保')>0){
            return true;
          }else{
            return false;
          }
        },
        //售后订单列表
        getList2(page){
          this.checkedOrder=[];
          var smData={};
          this.pagination2.page=page;
          smData.search=this.search2;
          smData.p=this.pagination2.page;
          smData.buid=this.curuid;
          if(this.search2.time==''||this.search2.time==null){
            smData.begin_time='';
            smData.end_time='';
          }else{
            smData.begin_time=this.search2.time[0];
            smData.end_time=this.search2.time[1];
          }
          delete smData.time;
          this.api.request({
            url:this.api.after_sale_order,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){

              this.tableData2=res.data.data.data;
              this.pagination2.total_count=res.data.data.total;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });

        },
         //订单列表
        getList(page){
          var smData={};
          this.pagination.page=page;
          smData.search=this.search;
          smData.p=this.pagination.page;
          smData.buid=this.curuid;
          if(this.search.time==''||this.search.time==null){
            smData.begin_time='';
            smData.end_time='';
          }else{
            smData.begin_time=this.search.time[0];
            smData.end_time=this.search.time[1];
          }
          if(this.search.status!=''){
            this.activeIndex=this.search.status;
          }
          delete smData.time;
          this.api.request({
            url:this.api.get_order_list_data,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.tableData=res.data.data.data;
              this.pagination.total_count=res.data.data.total;
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //点击修改物流
        modifyLogistics(index){
          if(this.$refs['logisticsForm'])
          this.$refs['logisticsForm'].resetFields();
          var arr=['申通','圆通','中通','顺丰','优速','韵达','天天','德邦','百世','邮政包裹','EMS','其他'];
          var obj=JSON.parse(JSON.stringify(this.tableData[index]));
          if(arr.indexOf(this.tableData[index].shipping_name)==-1){
            var str=obj.shipping_name;
            obj.shipping_name='其他';
            obj.shipping_logistics=str;
          }else{
            obj.shipping_logistics='';
          }
          this.logistics=obj;
          this.logisticsVisible=true;
        },
        //修改物流确认触发事件
        logisticsComfirm(){
          this.$refs['logisticsForm'].validate((valid)=>{
            if (valid) {
              var smData={};
              smData.buid=this.curuid;
              smData.order_id=this.logistics.order_id;
              if(this.logistics.shipping_name=='其他'){
                smData.shipping_name=this.logistics.shipping_logistics;
              }else{
                smData.shipping_name=this.logistics.shipping_name;
              }
              smData.shipping_sn=this.logistics.shipping_sn;
              if(this.logistics.status=='nosend') var message='发货成功！';
              else var message='物流修改成功!';
              this.api.request({
                url:this.api.shipping_order,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.$message({
                    type:'success',
                    message:message
                  });
                  this.getList(this.pagination.page);
                  this.logisticsVisible=false;
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });

            }
          });

        },
        //点击发货
        sendGoods(index){
          if(this.$refs['logisticsForm'])
          this.$refs['logisticsForm'].resetFields();
          var obj=JSON.parse(JSON.stringify(this.tableData[index]));
          obj.shipping_name='';
          obj.shipping_logistics='';
          this.logistics=obj;
          this.logisticsVisible=true;
        },
        //点击完成服务
        completeService(index){
          this.$confirm('确认已经完成服务了吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            var smData={};
            smData.buid=this.curuid;
            smData.order_id=this.tableData[index].order_id;
            this.api.request({
              url:this.api.finish_order,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.getList(this.pagination.page);
                this.$message({
                  type:'success',
                  message:'服务已完成，待买家确认！'
                });
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();

        },
        //取消订单
        cancelOrder(index){
          this.$confirm('确认取消订单吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
           var smData={buid:this.curuid};
            smData.order_id=this.tableData[index].order_id;
            this.api.request({
              url:this.api.cancel_order,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'取消成功！'
                });
                this.getList(this.pagination.page);
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },
        //核销订单
        verification_order(index){
          this.$confirm('确认核销吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            var smData={};
            smData.buid=this.curuid;
            smData.order_id=this.tableData[index].order_id;
            this.api.request({
              url:this.api.verification_order,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'核销成功'
                });
                this.getList(this.pagination.page);
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },
        //备注验证
        remarkValidator(val){
          if(val==''||val==undefined||val==null){
            return false;
          }else{
            return true;
          }
        },
        //编辑商家备注
        editRemark(index){
          this.$prompt('请输入商家备注', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: this.remarkValidator,
            inputErrorMessage: '备注不能为空'
          }).then(({ value }) => {
            var smData={
              buid:this.curuid,
              order_id:this.tableData[index].order_id,
              seller_remark:value
            }
            this.api.request({
              url:this.api.update_seller_remark,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'商家备注修改成功！'
                });
                this.tableData[index].seller_remark=value;
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },
        //导出订单
        exportOrder(){
          var smData={};
          smData.search=this.search;
          smData.p=this.pagination.page;
          smData.buid=this.curuid;
          this.api.request({
            url:this.api.export_orders,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            responseType:'arraybuffer',
            data:qs.stringify(smData)
          }).then((res)=>{
            let blob=new Blob([res.data],{type:"application/vnd.ms-excel"});
            let objectUrl=URL.createObjectURL(blob);
            var fileName='订单列表'+Date.parse(new Date())+'.xlsx';
            if(navigator.userAgent.indexOf("Firefox")>0){
              window.location.href=objectUrl;
            }else{
              if ('download' in document.createElement('a')) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
              }else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
              }
            }
          });
        }
      }
    }
</script>

<style lang="less">
  #transactionOrder{
    background: #fff;
    font-size:12px;
    .goods-image {
      width: 60px;
      height: 60px;
      display: inline-block;
      position: relative;
      .parentIcon {
        display: inline-block;
        width: 32px;
        height: 18px;
        line-height: 18px;
        border-radius: 1px;
        background: rgba(0, 0, 0, 0.5);
        font-size: 10px;
        position: absolute;
        bottom: 3px;
        right: 3px;
        color: #fff;
        text-align: center;
      }
    }
    .el-icon-edit{
     cursor:pointer;
    }
    .el-table--border::after, .el-table--group::after{
      width:0px;
    }
    .el-card__header .el-checkbox__label{
      display: none;
    }
    .alignCenter{
      text-align: center;
    }
    .goods-info-title{
      text-align: left;
      position: relative; line-height: 20px; max-height: 40px;overflow: hidden;
      width:180px;
      &.trickleOut::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;
        background: -webkit-linear-gradient(left, transparent, #fff 55%);
        background: -o-linear-gradient(right, transparent, #fff 55%);
        background: -moz-linear-gradient(right, transparent, #fff 55%);
        background: linear-gradient(to right, transparent, #fff 55%);
      }
    }
    td .active{
      color:#f60;
      line-height: 40px;
      font-size:16px;
    }
    .goods-type {
      width: 40px;
      height: 20px;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      line-height: 20px;
      border-radius: 3px;
      color: #fff;
      &.private{
        background-color: #d9534f;
      }
      &.agency{
        background-color: #4dff3e;
      }
      &.custom{
        background-color: #FF0099;
      }
      &.distribution{
        background-color: #FF9900;
      }
    }
    label.red{color: #FD4747; padding: 0 15px;}
    .th{
      line-height: 23px;
      border-bottom: 1px solid #ebeef5;
      background: #fff;
      padding: 12px 0px;
      font-size: 14px;
      color: #909399;
    }
    .td{
      line-height: 23px;
      border-bottom: 1px solid #ebeef5;
      background: #fff;
      padding: 12px 0px;
      font-size: 14px;
      color: #909399;
      text-align: center;
      p{
        word-break: break-all;
      }
    }
    .box-card{
      margin-bottom: 10px;
      &.is-never-shadow{
        box-shadow:none;
      }
      .el-card__header{
        background: #f8f8f8;
        padding:10px 20px;
      }
    }
    .el-card__body{
      padding:0px;
    }
    .goods-header {
      display: flex;
      flex-direction: row;
      align-content: center;
      .goods-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
      }
    }
    .goods-info{
      width:100%;
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

</style>
