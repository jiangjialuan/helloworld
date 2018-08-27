/**
 * Created by Administrator on 2018/4/3.
 */
import Mock from 'mockjs'
Mock.mock('/business/social_security/store',{
  data:{

  },
  state:{
    code:'10200',
    msg:'ok'
  }
});
Mock.mock('/business/social_security/getDetail',{
  data: {
    "bid": "86318",
    "desc": "<p><img src=\"http://sdkdemo.artqiyi.com/data/attachment/work_desc_img/2018-01-10/1515567847253127.jpg\" title=\"1515567847253127.jpg\" alt=\"6.jpg\"/></p><p>罢了咯啦咯考虑 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src=\"http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-01-19/4r/mh/70CB7B99-3EF5-01A3-A2F0-FBDDAFFEC5FE.jpg\" alt=\"(null)\"/>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img src=\"http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-01-19/42/fs/2F09BACD-AA7A-E851-CE8C-26F050C2F270.jpg\" alt=\"(null)\"/>\n &nbsp; &nbsp;<img src=\"http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-01-24/gc/vy/2F7B9E2F-A9C7-3975-C47E-0836C6A66328.jpg\" alt=\"(null)\"/>？ &nbsp; &nbsp;<img src=\"http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-01-24/5l/fw/7400E866-AB38-CF19-38E4-248860FA11E4.jpg\" alt=\"(null)\"/><img id=\"1516949707302\" src=\"http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-01-26/fu/ve/B7081DF3-B498-DFC4-22A8-6A34E3C52D65.jpg\" alt=\"\"/></p><p><br/></p>",
    "work_name": "社保局0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "goods_imgs": [
      "http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-04-03/j2/bz/31CFA3F2-342C-1B44-FDB9-663F680C7288.jpg",
      "http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-04-03/yk/bt/B347DBE3-A758-F023-D80E-2503189F80CC.jpg",
      "http://sdkdemo.artqiyi.com/data/attachment/work_cat/2018-04-03/3z/dv/850D180C-E103-84F2-5BE0-AED9A819969C.jpg"
    ]
  },
  state:{
    code:10200,
    msg:'ok'
  }
});
Mock.mock('/business/social_security/city_list_data',{
  "data|10":[
    {
      'id|+1': 1,
      "city": Mock.Random.province()+Mock.Random.city(),
      "month_service_charge|1-10000": 1,
      "sell_earning|1-100": 1,
      "parent_earning|1-100": 1,
      "grandpa_earning|1-100": 1,
      "reserve_service_charge|1-10000": 0
    },
  ],
  state:{
    code:'10200',
    msg:'ok'
  }
});
Mock.mock('/business/social_security/get_city_seeting?id=1',{
  data:{
    "id": "171",
    "city":  Mock.Random.province()+Mock.Random.city(),
    "month_service_charge": 1,
    "sell_earning|1-100": 1,
    "parent_earning|1-100": 1,
    "grandpa_earning|1-100": 1,
    "reserve_service_charge": 12,
    "social_security_setting": [
      {
        "id": "493",
        "assurance_type": "1",
        "cardinal_number": 1,
        "rate": 1
      }
    ],
    "accumulation_fund_setting": [
      {
        "id": "499",
        "assurance_type": "公积金",
        "cardinal_number": 100,
        "rate": 1.1
      }
    ]
  },
  state:{
    code:'10200',
    msg:'ok'
  }
});
