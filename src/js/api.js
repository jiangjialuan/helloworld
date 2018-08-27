import axios from 'axios';
import {Message} from 'element-ui'

// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use(config => {// 处理请求之前的配置
  return config;
}, error => {// 请求失败的处理
  return Promise.reject(error);
});

// 响应拦截（配置请求回来的信息）
axios.interceptors.response.use(res => {// 处理响应数据
  if (res.data.state!=undefined&&res.data.state.code == 10400) {
    Message.error(res.data.state.msg);
  } else if (res.data.state!=undefined&&res.data.state.code == 10401) {
    Message.error(res.data.state.msg);
    sessionStorage.clear();
    location.replace("/login");
  }
    return res;

}, error => {// 处理响应失败
  return Promise.reject(error);
});

// var baseUrl='http://yimibackend';
//
// var baseUrl='http://test.yimizhibo.tv';
// // var baseUrl='http://localhost:8080';
//
// var domain=location.host.toString();
// if(domain.indexOf('test')>-1){
//   baseUrl='http://yimizhibo.tv';
// }

export default {
  login: `/api/v2/login`,//通过密码登录
  get_user_permission: `/api/v1/get_user_permission`,//获取用户权限
  getcode: `/api/v1/send_verification`,//获取手机登录验证码
  codeLogin: `/api/v1/phone_vercode_login`,//通过手机验证码登录
  complete_info: `/api/v1/complete_info`,//验证码登录完善资料按钮
  register_ticket: `/api/v1/register_ticket`,//获取短信验证凭证
  reset_password: `/api/v1/reset_password`,//修改或重置用户密码
  statistics_data: `/business/v1/statistics_data`,//商户概况
  my_earnings: `/business/v1/my_earnings`,//收益统计
  order_earnings: `/business/v1/order_earnings`,//订单收益明细
  redenvelope_earnings: `/business/v1/redenvelope_earnings`,//红包收益明细
  anchor_short_video: `/business/v1/anchor_short_video`,//主播短视频列表
  my_agency: `/api/v1/my_agency`,//合伙人管理-我的合伙人
  get_agency_groups: `/api/v1/get_agency_groups`,//合伙人管理-合伙人分组
  userinfo: `/api/v1/userinfo`,//取用户信息
  business_withdraw_log: `/business/v1/business_withdraw_log`,//提现管理
  get_agent_apply: `/business/v1/get_agent_apply`,//代理申请审核
  get_enterprise_card: `/business/v1/get_enterprise_card`,//获取企业名片
  save_enterprise_card: `/business/v1/save_enterprise_card`,//提交保存企业名片
  get_slideshow: `/business/v1/get_slideshow`,//获取首页轮播海报
  getAgentQrcode: `/weixin/authorization/getAgentQrcode`,//添加合伙人的小程序码
  bind_account_qrcode: `/api/v1/bind_account_qrcode`,//添加合伙人的小程序码
  add_agency_group: `/api/v1/add_agency_group`,//合伙人新增分组
  edit_agency_group: `/api/v1/edit_agency_group`,//合伙人编辑分组
  del_short_video: `/api/v1/del_short_video`,//短视频删除
  check_agent_apply: `/business/v1/check_agent_apply`,//代理申请通过拒绝审核
  confirm_remit: `/business/v1/confirm_remit`,//代理提现确认打款
  remove_agency: `/api/v1/remove_agency`,//删除合伙人
  bind_agency_group: `/api/v1/bind_agency_group`,//合伙人管理修改分组
  del_slideshow: `/business/v1/del_slideshow`,//删除轮播图
  business_applet_config: `/business/v1/business_applet_config`,//颜色风格
  save_applet_config: `/business/v1/save_applet_config`,//颜色风格
  upload_data_img: `/index/index/upload_data_img`,//上传图片
  save_slideshow: `/business/v1/save_slideshow`,//保存轮播图
  goods_list: `/api/v1/goods_list`,//获取商品列表
  sort_slideshow: `/business/v1/sort_slideshow`,//轮播图排序
  qiniu_upload_params:`/api/v1/qiniu_upload_params`,//七牛验证
  short_video_data:'/api/v1/short_video_data',//获取编辑短视频数据
  edit_short_video:'/api/v2/edit_short_video',//编辑短视频
  add_short_video:'/api/v2/add_short_video',//发布短视频
  get_order_notice:'/api/v1/get_order_notice?act=11',//获取消息提示
  get_business_agent:'/business/v1/get_business_agent',//代理列表
  upload_img: `/index/index/upload_img`,//上传图片二进制流
  save_clerk_info:'/business/v1/save_clerk_info',//保存职员信息
  clerk_info_list:'/business/v1/clerk_info_list',//获取职员列表
  get_clerk_info:'/business/v1/get_clerk_info',//编辑一条职员信息
  del_clerk_info:'/business/v1/del_clerk_info',//删除一条职员信息
  overhead:'/business/v1/overhead',//置顶一条职员信息
  save_enterprise_detail:'/business/v1/save_enterprise_detail',//新增/编辑企业详情
  getAccreditUrl:'/weixin/authorization/getAccreditUrl',//获取授权的跳转链接
  accredit:'/weixin/authorization/accredit',//授权
  group_buy_list_data:'/business/groupon/group_buy_list_data',//拼团列表
  grouponStore:'/business/groupon/store',//创建/编辑拼团
  grouponDel:'/business/groupon/del_groupbuy',//删除拼团
  getGoodsDetail:'/business/goods/getDetail',//获取商品详情
  grouponDetail:'/business/groupon/get_detail',//获取拼团详情
  goodsUpdate:'/business/goods/update',//修改商品详情
  goodsStore:'/business/goods/store',//保存商品详情
  save_applet_info:'/business/v1/save_applet_info',//保存当前小程序基本信息
  check_is_authorization:'/business/v1/check_is_authorization',//检查当前账号是否有已授权的小程序
  social_security_store:'/business/social_security/store',//社保服务保存
  social_security_getDetail:'/business/social_security/getDetail',//获取社保服务详情
  city_list_data:'/business/social_security/city_list_data',//获取社保服务城市列表
  get_city_seeting:'/business/social_security/get_city_seeting',//获取单个社保城市详情
  salegoods:'/business/goods/get',//获取在售商品列表
  updateOverhead:'/business/index/updateOverhead',//置顶商品
  goodsDelete:'/business/goods/delete',//删除商品
  goodsChangeStatus:'/business/goods/changeStatus',//上架/下架商品
  goodsGet:'/business/goods/get',//仓库中的商品
  getSubShop:'/business/shop/get_sub_shop',//获取平台分店接口
  switch_account:'/api/v1/switch_account',//切换平台接口
  save_navigation:'/business/v1/save_navigation',//navigation
  get_navigation:'/business/v1/get_navigation',//navigation
  del_navigation:'/business/v1/del_navigation',//navigation
  sort_navigation:'/business/v1/sort_navigation',//navigation
  goods_group_data:'/business/goods/goods_group_data',//navigation//获取商品分组
  goods_group_save:'/business/goods/goods_group_save',//新增/编辑商品分组
  goods_group_del:'/business/goods/goods_group_del',//删除商品分组
  goods_group_sort_child:'/business/goods/goods_group_sort_child',//二级分组排序
  goods_group_sort_parent:'/business/goods/goods_group_sort_parent',//一级分组排序
  bind_goods_group:'/business/goods/bind_goods_group',//分组绑定商品
  get_group_goods:'/business/goods/get_group_goods',//获取分组下编辑的商品
  del_group_goods:'/business/goods/del_group_goods',//分组删除绑定商品
  attr_goods:'/business/index/attr_goods/',//获取分类下规格
  get_enterprise_con_list:'/manapi/v1/get_enterprise_con_list',//获取加盟列表
  save_enterprise_config:'/manapi/v1/save_enterprise_config',//保存加盟设置
  get_enterprise_config:'/manapi/v1/get_enterprise_config',//获取加盟设置
  socialSave_setting:'/business/social_security/save_setting',//新增/编辑社保城市
  socialDel_setting:'/business/social_security/del_setting',//删除社保城市
  get_order_list_data:'/business/index/get_order_list_data',//订单列表
  getShopSet:'/business/index/getShopSet',//获取店铺设置数据
  shopSet:'/business/index/shopSet',//店铺设置保存
  showreel_list_data:'/business/goods_showreel/showreel_list_data',//获取员工作品集
  goods_showreel_store:'/business/goods_showreel/store',//新增/编辑员工作品集
  del_showreel:'/business/goods_showreel/del_showreel',//删除作品集
  showreel_image_list_data:'/business/goods_showreel_image/showreel_image_list_data',//获取作品集图片列表
  goods_showreel_image_store:'/business/goods_showreel_image/store',//保存作品集图片
  del_showreel_image:'/business/goods_showreel_image/del_showreel_image',//删除作品集图片
  fullprivilege_list_data:'/business/activity/fullprivilege_list_data',//满减送列表
  fullprivilege_detail_data:'/business/activity/fullprivilege_detail_data',//获取满减送详情
  fullprivilege_store:'/business/activity/fullprivilege_store',//保存满减送详情
  fullprivilege_del:'/business/activity/fullprivilege_del',//删除满减送
  discount_list_data:'/business/activity/discount_list_data',//获取限时折扣列表
  discount_store:'/business/activity/discount_store',//保存限时折扣详情
  discount_detail_data:'/business/activity/discount_detail_data',//获取限时折扣详情
  del_discount:'/business/activity/del_discount',//删除限时折扣
  shipping_order:'/business/index/shipping_order',//修改物流接口
  finish_order:'/business/index/finish_order',//服务完成接口
  cancel_order:'/business/index/cancel_order',//取消订单
  verification_order:'/business/index/verification_order',//核销完成
  update_seller_remark:'/business/order/update_seller_remark',//商家备注编辑
  get_region:'/region/region/get_region',//获取城市列表
  goods_album_list_data:'/business/goods_album/goods_album_list_data',//获取商品专题列表
  goods_album_store:'/business/goods_album/goods_album_store',//新建/保存商品专题
  goods_album_detail_data:'/business/goods_album/goods_album_detail_data',//获取商品专题详情
  del_goods_album:'/business/goods_album/del_goods_album',//删除商品专题
  export_orders:'/business/index/export_orders',//导出订单
  get_order_detail:'/business/index/get_order_detail',//获取订单详情
  refund:'/business/order/refund',//退款
  refund_sign:'/business/order/refund_sign',//不支持退款的退款确认调接口
  update_order_address:'/business/order/update_order_address',//修改订单地址
  after_sale_order:'/business/index/get_after_sale_order_list_data',//售后订单
  goods_album_sort:'/business/goods_album/goods_album_sort',//商品专题排序
  get_wx_qrcode:'/business/v1/get_wx_qrcode',
  member_list_data:'/business/member/member_list_data',//会员等级列表接口
  member_store:'/business/member/member_store',//保存会员等级
  member_detail_data:'/business/member/member_detail_data',//获取每一会员等级详情
  member_del:'/business/member/member_del',//删除会员等级
  points_detail_data:'/business/points/points_detail_data',//积分列表获取
  points_detail_store:'/business/points/points_detail_store',//保存积分列表接口
  sell_parent_goods:'/business/goods/sell_parent_goods',//选择总店商品上架
  goods_sort:'/business/goods/goods_sort',//商品排序
  customers_list:'/business/member/customers_list',//客户列表
  members_list:'/business/member/members_list',//会员列表
  get_user_member:'/business/member/get_user_member',//获取会员详情
  edit_user_member:'/business/member/edit_user_member',//编辑会员保存接口
  answer_list_data:'/business/question/answer_list_data',//社保问卷列表
  get_user_answer:'/business/question/get_user_answer',//社保问卷详情
  parent_short_video:'/business/v1/parent_short_video',//主店视频列表
  async_parent_short_video:'/business/v1/async_parent_short_video',//同步主店视频
  get_parent_goods_albums:'/business/goods_album/get_parent_goods_albums',//总店的商品专题列表
  async_parent_goods_album:'/business/goods_album/async_parent_goods_album',//同步总店商品确认
  get_parent_discount_activities:'/business/activity/get_parent_discount_activities',//总店限时折扣列表
  async_parent_discount_activity:'/business/activity/async_parent_discount_activity',//同步限时折扣确认
  get_parent_groupon:'/business/groupon/get_parent_groupon',//总店拼团列表
  async_parent_groupon:'/business/groupon/async_parent_groupon',//同步团购活动
  get_parent_fullprivilege_activities:'/business/activity/get_parent_fullprivilege_activities',//总店满减送列表
  async_parent_fullprivilege_activity:'/business/activity/async_parent_fullprivilege_activity',//同步总店满减送
  coupon_list_data:'/business/coupon/coupon_list_data',//优惠券列表
  coupon_store:'/business/coupon/coupon_store',//新增编辑优惠券
  coupon_detail_data:'/business/coupon/coupon_detail_data',//获取一条优惠券信息
  coupon_del:'/business/coupon/coupon_del',//删除优惠券

  request(data) {
    let reqData = data.data || {};
    let requestData = {
      url: data.url,
      data: reqData,
      method: data.method || 'GET',
      params:data.params||{},
      timeout:300000,
      onUploadProgress:data.onUploadProgress||null,
      headers: data.headers || '',
      responseType:data.responseType|| 'json'
    };
    return axios(requestData);
  },
  //photo_Server:'http://yimidemo.artqiyi.com'//测试服务器
  photo_Server:'http://yimi.artqiyi.com'//正式服务器
}

