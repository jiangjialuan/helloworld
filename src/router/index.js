import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);


const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/index'
  },
    {
      path: '/index',
      component: (resolve) => require(['../pages/website/index.vue'], resolve),
      meta: {common: true}
    },{
      path: '/xappIntroduce',
      component: (resolve) => require(['../pages/website/xappIntroduce.vue'], resolve),
      meta: {common: true}
    },
    {
      path: '/platform',
      component: (resolve) => require(['../pages/platform/platformList.vue'], resolve),
      meta: {common: true}
    }
    ,{
    path: '/login',
    component: (resolve) => require(['../pages/login.vue'], resolve)
  },
  {
    path: '/authorization',
    component: (resolve) => require(['../pages/views/wxProgram/authorization.vue'], resolve),
    meta: {common: true}
  },
   {
    path: '/system',
    component: (resolve) => require(['../pages/home.vue'], resolve),
    redirect: '/info',
    children: [
      {
      path: '/memberIntegral',
      component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
      name: '客户管理',
      meta: {common: true},
        children: [
          {
            path: '/memberIntegral/basicSetup',
            component: (resolve) => require(['../pages/views/memberIntegral/basicSetup.vue'], resolve),
            name: '基本设置',
            meta: {common: true},
          },
          {
            path: '/memberIntegral/memberSetup',
            component: (resolve) => require(['../pages/views/memberIntegral/memberSetup.vue'], resolve),
            name: '会员设置',
            meta: {common: true},
          },{
            path: '/memberIntegral/userList',
            component: (resolve) => require(['../pages/views/memberIntegral/userList.vue'], resolve),
            name: '会员列表',
            meta: {common: true},
          },

        ],
    },
      {
      path: '/info',
      component: (resolve) => require(['../pages/views/info.vue'], resolve),
      name: '概况'
    }, {
      path: '/earnings',
      component: (resolve) => require(['../pages/views/earnings.vue'], resolve),
      name: '我的收益',
    }, {
      path: '/mall',
      //component: (resolve) => require(['../pages/views/mall/mall.vue'], resolve),
      component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
      redirect: '/mall/shop',
      name: '我的店铺',
      children: [
        {
          path: '/mall/goodsManage',
          component: (resolve) => require(['../pages/views/mall/goodsManage.vue'], resolve),
          name: '商品管理',
        },
        {
          path: '/mall/goodEdit/:id',
          component: (resolve) => require(['../pages/views/mall/goodEdit.vue'], resolve),
          name: '编辑商品',
          meta: {common: true}
        },
        {
          path: '/mall/goodAdd',
          component: (resolve) => require(['../pages/views/mall/goodEdit.vue'], resolve),
          name: '发布新商品',
          meta: {common: true}
        },
        {
          path: '/mall/socialSecurityManage',
          component: (resolve) => require(['../pages/views/mall/socialSecurityManage.vue'], resolve),
          name: '社保服务管理',
          meta: {common: true}
        },
        {
          path: '/mall/ruhuConsultation',
          component: (resolve) => require(['../pages/views/mall/ruhuConsultation.vue'], resolve),
          name: '入户咨询',
          meta: {common: true}
        },
        {
          path: '/mall/goodGroup',
          component: (resolve) => require(['../pages/views/mall/goodGroup.vue'], resolve),
          name: '商品分组',
          meta: {common: true}
        },
        {
          path: '/mall/orderList',
          component: (resolve) => require(['../pages/views/mall/order/orderList.vue'], resolve),
          name: '交易订单',
          meta: {common: true}
        },{
          path: '/mall/orderDetail/:id',
          component: (resolve) => require(['../pages/views/mall/order/orderDetail.vue'], resolve),
          name: '订单详情',
          meta: {common: true}
        },
        {
          path: '/mall/setshop',
          component: (resolve) => require(['../pages/views/mall/setshop.vue'], resolve),
          name: '店铺设置',
          meta: {common: true}
        },
        {
          path: '/mall/photolist',
          component: (resolve) => require(['../pages/views/mall/workPhoto/workPhotos.vue'], resolve),
          name: '作品集',
          meta: {common: true}
        },
        {
          path: '/mall/photoDetail/:id',
          component: (resolve) => require(['../pages/views/mall/workPhoto/workPhotoDetail.vue'], resolve),
          name: '作品集详情',
          meta: {common: true}
        },
        ]
    },{
      path: '/shortVideo',
      component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
      name: '短视频管理',
      children: [{
        path: '/shortVideo',
        component: (resolve) => require(['../pages/views/shortVideo/shortVideo.vue'], resolve),
        name: '短视频'
      }, {
        path: '/shortVideo/shortVideoEdit/:id',
        component: (resolve) => require(['../pages/views/shortVideo/shortVideoEdit.vue'], resolve),
        name: '短视频编辑',
        meta: {common: true}
      }, {
        path: '/shortVideo/shortVideoEdit/',
        component: (resolve) => require(['../pages/views/shortVideo/shortVideoEdit.vue'], resolve),
        name: '短视频新增',
        meta: {common: true}
      }]
    }, {
      path: '/accountManage',
      component: (resolve) => require(['../pages/views/accountManage.vue'], resolve),
      name: '账户管理',
      meta: {common: true}
    },
      {
        path: '/agentManage',
        component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
        redirect: '/agentManage/agentList',
        name: '代理管理',
        children: [{
          path: '/agentManage/agentList',
          component: (resolve) => require(['../pages/views/agent/agentList.vue'], resolve),
          name: '代理列表',
          meta: {permission: '2'}
        }, {
          path: '/agentManage/agentApply',
          component: (resolve) => require(['../pages/views/agent/agentApply.vue'], resolve),
          name: '代理申请审核',
          meta: {permission: '2'}
        }, {
          path: '/agentManage/agentWithdraw',
          component: (resolve) => require(['../pages/views/agent/agentWithdraw.vue'], resolve),
          name: '代理提现',
          meta: {permission: '2'}
        }]
      },{
        path: '/promotion',
        component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
        name: '营销中心',
        children: [
          {
            path: '/promotion/collageList',
            component: (resolve) => require(['../pages/views/promotion/collage/collageList.vue'], resolve),
            name: '拼团管理',
            meta:{common:true}
          },{
            path: '/promotion/reward',
            component: (resolve) => require(['../pages/views/promotion/reward/reward.vue'], resolve),
            name: '满减/送',
            meta:{common:true}
          },
          {
            path: '/promotion/rewardAdd',
            component: (resolve) => require(['../pages/views/promotion/reward/rewardEdit.vue'], resolve),
            name: '新增满减/送',
            meta:{common:true}
          },
          {
            path: '/promotion/rewardEdit/:id',
            component: (resolve) => require(['../pages/views/promotion/reward/rewardEdit.vue'], resolve),
            name: '编辑满减/送',
            meta:{common:true}
          },
          {
            path: '/promotion/limitdiscount',
            component: (resolve) => require(['../pages/views/promotion/limitdiscount/limitdiscount.vue'], resolve),
            name: '限时折扣',
            meta:{common:true}
          },
          {
            path: '/promotion/limitdiscountAdd',
            component: (resolve) => require(['../pages/views/promotion/limitdiscount/limitdiscountEdit.vue'], resolve),
            name: '新建限时折扣',
            meta:{common:true}
          },
          {
            path: '/promotion/limitdiscountEdit/:id',
            component: (resolve) => require(['../pages/views/promotion/limitdiscount/limitdiscountEdit.vue'], resolve),
            name: '编辑限时折扣',
            meta:{common:true}
          },
          {
            path: '/promotion/goodsTopic',
            component: (resolve) => require(['../pages/views/promotion/goodsTopic/goodsTopic'], resolve),
            name: '商品专题',
            meta:{common:true}
          },
          {
            path: '/promotion/goodsTopicAdd',
            component: (resolve) => require(['../pages/views/promotion/goodsTopic/goodsTopicEdit'], resolve),
            name: '发布商品专题',
            meta:{common:true}
          },
          {
            path: '/promotion/goodsTopicEdit/:id',
            component: (resolve) => require(['../pages/views/promotion/goodsTopic/goodsTopicEdit'], resolve),
            name: '编辑商品专题',
            meta:{common:true}
          },
          {
            path: '/promotion/coupon',
            component: (resolve) => require(['../pages/views/promotion/coupon/couponList'], resolve),
            name: '优惠券',
            meta:{common:true}
          },
          {
            path: '/promotion/couponAdd',
            component: (resolve) => require(['../pages/views/promotion/coupon/couponEdit'], resolve),
            name: '新增优惠券',
            meta:{common:true}
          },
          {
            path: '/promotion/couponEdit/:id',
            component: (resolve) => require(['../pages/views/promotion/coupon/couponEdit'], resolve),
            name: '编辑优惠券',
            meta:{common:true}
          },
        ]

      }, {
        path: '/wxProgram',
        component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
        redirect: '/wxProgram/wxProgram',
        name: '微信小程序',
        children: [{
          path: '/wxProgram/wxProgram',
          component: (resolve) => require(['../pages/views/wxProgram/wxProgram.vue'], resolve),
          name: '微信小程序申请',
          meta: {permission: '4'}
        }, {
          path: '/wxProgram/wxProgramDecoration',
          component: (resolve) => require(['../pages/views/wxProgram/wxProgramDecoration.vue'], resolve),
          name: '微信小程序装修',
          meta: {permission: '4'}
        }, {
          path: '/wxProgram/businessCard',
          component: (resolve) => require(['../pages/views/wxProgram/businessCard.vue'], resolve),
          name: '企业名片设置',
          meta: {permission: '4'}
        }, {
          path: '/wxProgram/employeeCard',
          component: (resolve) => require(['../pages/views/wxProgram/employeeCard.vue'], resolve),
          name: '员工名片设置',
          meta: {permission: '4'}
        },{
          path: '/wxProgram/wxAuthorization',
          component: (resolve) => require(['../pages/views/wxProgram/wxAuthorization.vue'], resolve),
          name: '小程序授权',
          meta: {permission: '4'}
        }]
      },
      {
        path: '/join',
        component: (resolve) => require(['../pages/views/transitPage.vue'], resolve),
        name: '加盟管理',
        redirect: '/join/joinlist',
        meta: {common: true},
        children: [
          {
            path: '/join/joinlist',
            component: (resolve) => require(['../pages/views/join/joinlist.vue'], resolve),
            name: '申请列表',
            meta: {common: true}
          },
          {
            path: '/join/joinset',
            component: (resolve) => require(['../pages/views/join/joinset.vue'], resolve),
            name: '申请页设置',
            meta: {common: true}
          },
        ]
      },

    ]
  }, {
    path: '*',   // 错误路由
    component: (resolve) => require(['../pages/views/error404.vue'], resolve),
    meta: {common: true}
  }]
});

router.beforeEach((to, from, next) => {
  //生成动态路由
  if (sessionStorage.getItem('userAccount')) {//登陆过
    if (to.path === '/login') {//登陆过，要去登录页？不让，必须先退出
      next({path: '/system'})
    } else {
      if(to.meta.common){
        return next();
      }else{
        if(to.name){
          const menues=JSON.parse(sessionStorage.getItem("menue"));
          if(menues!=undefined&&menues.length>0){
            for (var i=0;i<menues.length;i++){
              if(to.name==menues[i].title){
                return next();
              }
              else if(menues[i].subs){
                for (var j=0;j<menues[i].subs.length;j++){
                  if(to.name==menues[i].subs[j].title){
                    return next();
                  }
                }
              }
            }
            next('/error404')
          }else{
            sessionStorage.clear();
            next('/login')
          }
        }
      }
    }
  } else {//未登录
    if (to.path.indexOf('/login') !== -1) {// 不重定向白名单(必要)
      next()
    } else if(to.path.indexOf('/index') !== -1) {
      next()
    }else if(to.path.indexOf('/xappIntroduce') !== -1) {
      next()
    }else{
        next('/login')
    }
  }
});

export default router;
