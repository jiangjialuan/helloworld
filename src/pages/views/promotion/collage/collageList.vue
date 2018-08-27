<template>
  <div id="collageList">

    <div class="btns">
      <el-button  type="primary" @click="synchronization()" v-if="userinfo.is_sub_shop&&userinfo.sync_flag">从总店同步</el-button>
      <el-button  type="primary"  @click="createCollage()" v-if="userinfo.edit_flag">创建拼团</el-button>
    </div>
    <el-tabs style="position: relative" v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="拼团中" name="first">
        <el-table
          :data="collageListData1"
          stripe
          style="width: 100%">
          <el-table-column
            label="商品"
            width="240">
            <template slot-scope="scope">
              <div class="goods-content">
                <div class="goods-img">
                  <img :src="scope.row.image"  >
                  <!--<span class="parentIcon" v-if="scope.row.sell==1">下架</span>-->
                  <span class="parentIcon" v-if="scope.row.from_parent">总店</span>
                </div>
                <div class="goods-info">
                  <p :class="scope.row.wname.length>36?'more':''">{{scope.row.wname}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="拼团价/原价">
            <template slot-scope="scope">
              <p>￥<span  class="active">{{scope.row.group_price}}</span>/￥{{scope.row.price}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="活动时间">
            <template slot-scope="scope">
              <p><span>{{scope.row.begin_time}}至{{scope.row.end_time}}</span></p>
            </template>
          </el-table-column>
          <el-table-column
            label="拼团类型">
            <template slot-scope="scope">
            <p>{{scope.row.group_people}}人团</p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="createCollage(scope.row.bid,scope.row.id,scope.row.from_parent)" v-if="userinfo.edit_flag&&scope.row.from_parent==0">编辑</el-button>
              <el-button type="text" size="small" @click="createCollage(scope.row.bid,scope.row.id,scope.row.from_parent)" v-else>查看</el-button>
              <el-button type="text" size="small" @click="delCollage(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未开始" name="second">
        <el-table
          :data="collageListData2"
          stripe
          style="width: 100%">
          <el-table-column
            label="商品"
            width="240">
            <template slot-scope="scope">
              <div class="goods-content">
                <div class="goods-img">
                  <img :src="scope.row.image"  >
                  <!--<span class="parentIcon" v-if="scope.row.sell==1">下架</span>-->
                  <span class="parentIcon" v-if="scope.row.from_parent">总店</span>
                </div>
                <div class="goods-info">
                  <p :class="scope.row.wname.length>36?'more':''">{{scope.row.wname}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="拼团价/原价">
            <template slot-scope="scope">
              <p>￥<span  class="active">{{scope.row.group_price}}</span>/￥{{scope.row.price}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="活动时间">
            <template slot-scope="scope">
              <p><span>{{scope.row.begin_time}}至{{scope.row.end_time}}</span></p>
            </template>
          </el-table-column>
          <el-table-column
            label="拼团类型">
            <template slot-scope="scope">
              <p>{{scope.row.group_people}}人团</p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small"  @click="createCollage(scope.row.bid,scope.row.id,scope.row.from_parent)" v-if="userinfo.edit_flag&&scope.row.from_parent==0">编辑</el-button>
              <el-button type="text" size="small" @click="createCollage(scope.row.bid,scope.row.id,scope.row.from_parent)" v-else>查看</el-button>
              <el-button type="text" size="small" @click="delCollage(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage2"
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="total2">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已结束" name="third">
        <el-table
          :data="collageListData3"
          stripe
          style="width: 100%">
          <el-table-column
            label="商品"
            width="240">
            <template slot-scope="scope">
              <div class="goods-content">
                <div class="goods-img">
                  <img :src="scope.row.image"  >
                  <!--<span class="parentIcon" v-if="scope.row.sell==1">下架</span>-->
                  <span class="parentIcon" v-if="scope.row.from_parent">总店</span>
                </div>
                <div class="goods-info">
                  <p :class="scope.row.wname.length>36?'more':''">{{scope.row.wname}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="拼团价/原价">
            <template slot-scope="scope">
              <p>￥<span  class="active">{{scope.row.group_price}}</span>/￥{{scope.row.price}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="活动时间">
            <template slot-scope="scope">
              <p><span>{{scope.row.begin_time}}至{{scope.row.end_time}}</span></p>
            </template>
          </el-table-column>
          <el-table-column
            label="拼团类型">
            <template slot-scope="scope">
              <p>{{scope.row.group_people}}人团</p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delCollage(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="total3">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
      <div class="remarks">(如开启三级分销功能，正在拼团的商品，仅原价购买时支持分销分佣)</div>
      <div style="max-height: 400px;overflow-y:auto;">
        <el-form :model="form" ref="form">
          <el-row v-if="!form.bid" class="m-b-10">
            <el-button type="primary" @click="selectShop">选择商品</el-button>
          </el-row>
          <el-row v-else>
            <el-form-item label="商品名称" label-width="80px">
              <span style="margin-right:25px;">{{wname}}</span><el-button type="text" size="mini" v-if="form.id==''" @click="selectShop">修改商品</el-button>
            </el-form-item>
            <el-form-item label="商品图片" label-width="80px">
              <img :src="wImg" width="80" height="80"/>
            </el-form-item>
          </el-row>
          <el-row class="rules">
            <table class="el-table el-table--border" cellspacing="0" cellpadding="0" border="0" v-if="form.skus.length>0">
              <tr>
                <template v-for="(item,index) in thead" v-if="thead.length>0">
                <th class="is-leaf" width="120"><div class="cell"> {{item}}</div></th>
                </template>
                <th class="is-leaf" width="120"><div class="cell">拼团价（元）</div></th>
                <th class="is-leaf" width="100"><div class="cell">原价</div></th>
                <th class="is-leaf" width="240"><div class="cell">拼团限量</div></th>
              </tr>
              <tr v-for="(item, index) in form.skus" :key="item.key">
                <template v-for="(subItem,subIndex) in item.attrs" v-if="item.attrs.length>0">
                <td class="textCenter" >{{subItem.value}}</td>
                </template>
                <td class="textCenter">
                  <el-form-item :prop="'skus.'+index+'.group_price'" :rules="[{ required: true, message: '请输入价格', trigger: 'blur'},{validator: validateprice, trigger: 'blur'}]">
                    <el-input  size="mini" :min="0" type="number" v-model="item.group_price" style="width:80px;" v-if="userinfo.edit_flag&&from_parent==0"></el-input>
                    <span v-else>{{item.group_price}}</span>
                  </el-form-item>
                </td>
                <td class="textCenter">{{item.price}}</td>
                <td class="textCenter">
                  <p v-if="userinfo.edit_flag&&from_parent==0">
                    <el-form-item :prop="'skus.'+index+'.group_stock'" :rules="[{ required: true, message: '请输入库存', trigger: 'blur'},{validator: validateskus, trigger: 'blur'}]">
                    <el-input  size="mini" type="number" :min="0" v-model="item.group_stock" style="width:80px;"></el-input><span class="p10">库存 ：{{item.stock}}</span>
                    </el-form-item>
                  </p>
                  <p v-else>{{item.group_stock}}</p>
                </td>
              </tr>
            </table>
          </el-row>
          <el-form-item label="成团人数" label-width="80px" prop="group_people" :rules="[{ required: true, message: '请输入人数', trigger: 'blur'},{validator: validatePeople, trigger: 'blur'}]">
            <el-input-number style="width:200px;" type="number" v-model="form.group_people" :min="2" v-if="userinfo.edit_flag&&from_parent==0"></el-input-number>
            <span v-else>{{form.group_people}}</span>
          </el-form-item>
          <el-form-item label="活动时间" label-width="80px" prop="dataValue" :rules="[{ required: true, message: '请输入活动时间', trigger: 'blur'}]">
            <el-date-picker v-if="userinfo.edit_flag&&from_parent==0"
              v-model="form.dataValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期"
              :picker-options="form.id==''?pickerOptions:''">
            </el-date-picker>
            <div v-else>{{form.dataValue[0]}}至{{form.dataValue[1]}}</div>
          </el-form-item>
          <el-form-item label="是否模拟成团" label-width="100px"  >
            <el-switch
              v-model="form.simulation_flag"
              active-text="是"
              inactive-text="否" disabled>
            </el-switch>
            <div style="line-height: 22px; color: #aaa;">开启模拟成团后，该团6小时有效期结束时，人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。只有已付款参团的真实买家才会获得商品。</div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmCollageCreate" v-if="userinfo.edit_flag&&from_parent==0">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择商品-->
    <el-dialog title="选择商品" :visible.sync="dialogSelectGoodsVisible" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'"  ref="selectGoods">
      <el-tabs v-model="selectShopTab"  type="border-card" >
        <el-tab-pane v-for="(item,index) in goods" :label="item.title" :name="'tab'+index" :key="item.index" v-if="permissionFun(index)">
          <div class="tableList" @scroll.passive="getMore($event,index);">
            <div class="table" v-for="itemChild in item.list"  border style="width: 100%"  :ref="'multipleTable'+index">
              <div class="tableItem">
                <div class="goods-header">
                  <div class="goods-image">
                    <img alt="" :src="itemChild.image" width="60" height="60">
                    <span class="parentIcon" v-if="itemChild.is_custom==6">总店</span>
                  </div>
                  <div class="goods-info">
                    <p class="goods-info-title">{{ itemChild.goods_name }}</p>
                    <p class="goods-info-sub" v-if="index==0">价格：￥{{itemChild.price}}</p>
                    <p class="goods-info-sub" v-if="index==1">价格：￥{{itemChild.price}} 销量：{{itemChild.sale_num}}</p>
                    <p class="goods-info-sub" v-if="index==3">{{itemChild.desc}}</p>
                    <p class="goods-info-sub" v-if="index==4">服务费￥{{itemChild.price}}起</p>
                  </div>
                </div>
                <div class="radioBox">
                  <el-radio v-model="radioValue" :label="itemChild">&nbsp;</el-radio>
                </div>
              </div>
            </div>
            <div v-if="item.list.length<=0" class="textCenter p10">
              <p><span class="p10">暂时没有商品!</span> <el-button type="primary" size="small" @click="goaddshop()">去添加商品</el-button></p>
            </div>
            <el-row v-if="!item.has_next&&item.list.length>10">
              <el-col :span="24">
                <div>~已加载全部商品~</div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectGoodsComfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!--<selectGood :version="version" ref="selectGoods" :propSelect="selectGoods" @comfirm="selectGoodsComfirm"></selectGood>-->
    <!--从总店同步-->
    <collageCollection ref="collageCollection" @comfirm="selectCollageComfirm"></collageCollection>
  </div>
</template>
<script>
  import selectGood from '../../../../components/selectgoods.vue'
  import collageCollection from '../../../../components/collageCollection.vue'
  import qs from 'qs';
    export default{
      name: "collageList",
      data: function () {
            return {
              selectGoods:[],
              version:{
                hasReal:true,
                hasfictitious:true,
              },
              activeName:'first',
              screeHeight:window.innerHeight,
              collageListData1:[],
              collageListData2:[],
              collageListData3:[],
              dialogFormVisible:false,
              form:{
                bid:'',
                dataValue:[],
                group_people:2,
                skus:[],
                id:'',
               // status:true,
                simulation_flag:true,
              },
              from_parent:'',
              options:[
                {
                    label:'拼团中',
                    value:1
                },
                {
                  label:'未开始',
                  value:2
                },
                {
                  label:'已结束',
                  value:3
                }
              ],
              wname:'',
              wImg:'',
              thead:[],
              rowsData:[],
              userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
              curuid:sessionStorage.getItem('curuid'),
              currentPage1:1,
              total1:0,
              currentPage2:1,
              total2:0,
              currentPage3:1,
              total3:0,
              dialogTitle:'创建拼团',
              dialogSelectGoodsVisible:false,
              goods: [{list:[],selectGoods:[]},{list:[],selectGoods:[]},{list:[],selectGoods:[]},{list:[],selectGoods:[]},{list:[],selectGoods:[]}],
              selectShopTab:'tab0',
              radioValue:'',
              goodDetailData:{},
              pickerOptions:{
                disabledDate(time) {
                  return time.getTime() < Date.now() - 8.64e7;
                }
              },
            }
        },
      /*components: {
        selectGood,
      },*/
        created:function(){
          var permissionArr=eval(sessionStorage.getItem('permission'));
          var flag;
          permissionArr.forEach(item=>{
            if(item==3) flag=item;
          });

          if(flag!=undefined){
            this.permission=true;
          }else{
            this.permission=false;
          }
          for (var i = 0; i < 5; i++) {
            if(i==0) this.goods[i].title='实物商品';
            if(i==1) this.goods[i].title='虚拟商品';
            if(i==2) this.goods[i].title='在线咨询';
            if(i==3) this.goods[i].title='在线预约';
            if(i==4) this.goods[i].title='社保公积金';
            this.goods[i].has_next = true;
            this.goods[i].currentPage = 1;
          }
          this.group_buy_list_data(1);
          this.group_buy_list_data(2);
          this.group_buy_list_data(3);
        },
      components:{
        selectGood,
        collageCollection,
      },
      methods: {
        //点击从总店同步
        synchronization(){
          this.$refs['collageCollection'].open();
        },
        //点击同步确认事件
        selectCollageComfirm(selectList){
          const loading = this.$loading({
            lock: true,
            text: '正在同步~~',
          });
          var smData={
            buid:this.curuid,
            ids:selectList.join(',')
          }
          this.api.request({
            url:this.api.async_parent_groupon,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({
                type:'success',
                message:'同步成功！'
              });
              if(this.activeName=='first'){
                this.group_buy_list_data(1);
              }else if(this.activeName=='second'){
                this.group_buy_list_data(2);
              }else if(this.activeName=='third'){
                this.group_buy_list_data(3);
              }
              loading.close();
            }else{
              loading.close();
              this.$message.error(res.data.state.msg);
            }
          })
        },
        //验证价格跟库存
        validateprice (rule, value, callback){
            var arr=rule.field.split('.');
            var price=parseFloat(this.form.skus[arr[1]].price);
          if (parseFloat(value) <0) {
            callback(new Error('价格大于等于0'))
          } else if(value>price) {
            callback(new Error('拼团价不能大于原价'))
          }else{
            callback()
          }
        },
        validateskus(rule,value,callback){
          var reg = /^[1-9]\d*$/;
          var arr=rule.field.split('.');
          var stock=parseFloat(this.form.skus[arr[1]].stock);
          if (parseFloat(value) <=0) {
            callback(new Error('数量必须大于0'))
          }else if(value>stock){
            callback(new Error('拼团数量不能大于总库存'))
          }
          else if(!reg.test(value)) {
            callback(new Error('库存必须为整数'))
          }
          else{
            callback()
          }
        },
        validatePeople(rule,value,callback){
          var reg = /^[1-9]\d*$/
          if (parseFloat(value) <2) {
            callback(new Error('成团人数必须大于2'))
          }
          else if(!reg.test(value)) {
            callback(new Error('成团人数必须为整数'))
          }
          else{
              callback()
          }
        },
        //权限控制
        permissionFun(index){
          if(this.permission){
            if(index==2||index==4) return true;
          }else{
            if(index==0||index==1) return true;
          }
        },
        //tab切换
        handleClick(tab){
          if(this.activeName=='first'){
            this.group_buy_list_data(1);
          }else if(this.activeName=='second'){
            this.group_buy_list_data(2);
          }else if(this.activeName=='third'){
            this.group_buy_list_data(3);
          }
        },
        //获取拼团列表
        group_buy_list_data(status){
          var page;
          if(status==1){
            page=this.currentPage1;
          }else if(status==2){
            page=this.currentPage2;
          }else if(status==3){
            page=this.currentPage3;
          }
          this.api.request({
            url:this.api.group_buy_list_data,
            params:{
              group_status:status,
              page:page,
              per_page:10,
              buid:this.curuid
            }
          }).then((res)=>{
            if(res.data.state.code=10200){
              if(status==1){
                this.collageListData1=res.data.data.list;
                this.total1=res.data.data.total_count;
                this.currentPage1=res.data.data.page;
              }else if(status==2){
                this.collageListData2=res.data.data.list;
                this.total2=res.data.data.total_count;
                this.currentPage2=res.data.data.page;
              }else if(status==3){
                this.collageListData3=res.data.data.list;
                this.total3=res.data.data.total_count;
                this.currentPage3=res.data.data.page;
              }
            }else{
              this.$message.error(res.data.state.msg);
            }
          })
        },
        //创建/编辑拼团弹框打开
        createCollage(bid,id,from_parent){
          if(this.$refs['form']){
            this.$refs['form'].resetFields();
            this.form.dataValue='';
            this.form.group_people='';
            this.form.skus=[];
            this.form.simulation_flag=true;
          }
          if(id==undefined||id==''||id==null){
            this.form.bid='';
            this.form.id='';
            this.from_parent='';
            //this.form.status=true;
            this.radioValue='';
            this.dialogFormVisible=true;
          }else{
            this.form.bid=bid;
            this.form.id=id;
            this.from_parent=from_parent;
            this.selectGoodsComfirm(bid).then(()=>{
              var smData={
                id:parseInt(id),
                buid:this.curuid
              }
              this.api.request({
                url:this.api.grouponDetail,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData),
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.form.group_people=res.data.data.group_people;
                  this.form.dataValue=[res.data.data.begin_time,res.data.data.end_time];
                  //this.form.status=res.data.data.status==1?true:false;
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });
            }).catch();
          }
        },
        //创建/编辑拼团弹框确认
        comfirmCollageCreate(){
          this.$refs['form'].validate((valid) => {
            if (valid) {
              if(this.form.skus.length<1){
                this.$message.error('请完善信息后提交！');
              }else if(this.form.dataValue[0]==this.form.dataValue[1]) {
                this.$message.error('拼团开始时间与结束时间不能相同！');
              }else{
                var loading = this.$loading({
                  lock: true,
                  text: '正在发布拼团，请稍候~~',
                  /*spinner: 'el-icon-loading',*/
                  background: 'rgba(255, 255, 255, 0.7)'
                });
                var smData={};
                smData.bid=this.form.bid;
                smData.id=this.form.id;
                smData.group_people=this.form.group_people;
                smData.begin_time=this.form.dataValue[0];
                smData.end_time=this.form.dataValue[1];
                //smData.group_status=this.form.group_status;
                //smData.status=this.form.status?1:0;
                smData.buid=this.curuid;
                smData.simulation_flag=this.form.simulation_flag?1:0;
                this.savaGoodsDetail().then(()=>{
                  this.api.request({
                    url:this.api.grouponStore,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                    data:qs.stringify(smData),
                    method:'post'
                  }).then((res)=>{
                    loading.close();
                    if(res.data.state.code==10200){
                      if(this.activeName=='first'){
                        this.group_buy_list_data(1);
                      }else if(this.activeName=='second'){
                        this.group_buy_list_data(2);
                      }else if(this.activeName=='third'){
                        this.group_buy_list_data(3);
                      }
                      this.$message({
                        type:'success',
                        message:'保存成功！'
                      });
                      this.dialogFormVisible = false;
                    }else{
                      loading.close();
                      this.$message.error(res.data.state.msg);
                    }

                  });
                }).catch((res)=>{
                  loading.close();
                  this.$message.error(res);
                });
              }
            }else {
              this.$message.error('请完善信息后提交！');
            }
          });
        },

        //删除拼团
        delCollage(id){
          var smData={id:id,buid:this.curuid};
          this.$confirm('此操作将永久删除该拼团, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var loading = this.$loading({
              lock: true,
              text: '正在删除拼团，请稍候~~',
              background: 'rgba(255, 255, 255, 0.7)'
            });
            this.api.request({
              url:this.api.grouponDel,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData),
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                if(this.activeName=='first'){
                  this.group_buy_list_data(1);
                }else if(this.activeName=='second'){
                  this.group_buy_list_data(2);
                }else if(this.activeName=='third'){
                  this.group_buy_list_data(3);
                }
                loading.close();
              }else{
                loading.close();
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },

        //点击选择/修改商品
        selectShop(id){
          this.addGoods();
          this.dialogSelectGoodsVisible=true;
          //this.$refs['selectGoods'].open();
        },

        //商品弹框--打开弹框
        addGoods(){
          if(this.permission){ this.selectShopTab='tab2';}
          if(this.goods[0].list.length<=0){
            this.getGoods(1, 1)
          }
          if(this.goods[1].list.length<=0) {
            this.getGoods(2, 1)
          }
          if(this.goods[2].list.length<=0) {
            this.getGoods(3, 1)
          }
          if(this.goods[3].list.length<=0) {
            this.getGoods(4, 1)
          }
          if(this.goods[4].list.length<=0) {
            this.getGoods(5, 1)
          }
          this.dialogSelectGoodsVisible = true;
        },

        //商品弹框--获取商品列表
        getGoods(type, cureentPage){
          return new Promise((resolve, reject) => {
            var index = parseInt(type - 1);
            if (this.goods[index].has_next) {
              this.api.request({
                url: this.api.goods_list,
                params: {
                  "act": 11,
                  "page": cureentPage,
                  "goods_type": type,
                  is_self:true,
                },
              }).then(res => {
                if (res.data.state.code == 10200) {
                  this.goods[index].has_next = res.data.data.has_next;
                  this.goods[index].currentPage = parseInt(this.goods[index].currentPage + 1);
                  if (this.goods[index].list.length > 0) {
                    this.goods[index].list = this.goods[index].list.concat(res.data.data.list);
                  } else {
                    this.goods[index].list = res.data.data.list;
                  }
                  resolve(index);
                } else {
                  this.$message.error(res.data.state.msg);
                }
              }).catch(err => {
                this.$message.error(err);
              })
            }
          });
        },


        //商品弹框--滚动至底部加载更多商品
        getMore(e, type){
          var _type = parseInt(type + 1);
          var currentPage = parseInt(this.goods[type].currentPage);
          if(e.srcElement!=undefined){
            if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
              if (this.goods[type].has_next) {
                this.getGoods(_type, currentPage);
              }
            }
          }else{
            //解决火狐不兼容e.srcElement
            if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
              if (this.goods[type].has_next) {
                this.getGoods(_type, currentPage);
              }
            }
          }

        },

        //获取商品详情的接口/选择商品弹框确认事件
        selectGoodsComfirm(bid){
          return new Promise((resolve,reject)=>{
            var url;
            if(bid){
              url=this.api.getGoodsDetail+'/'+bid;
            }else{
              url=this.api.getGoodsDetail+'/'+this.radioValue.goods_id;
            }
            this.api.request({
              url:url,
              params:{
                buid:this.curuid
              }
            }).then((res)=>{
              if(res.data.state.code==10200){
                if(this.form.id==''){
                  res.data.data.skus.forEach((item)=>{
                    item.group_price=0.00;
                    item.group_stock=0;
                  })
                }
                this.form.skus=res.data.data.skus;
                this.generateTableByAttrs(res.data.data.attr_names);
                this.setThead(res.data.data.attr_names);
                this.form.bid=res.data.data.bid;
                this.wname=res.data.data.wname;
                this.wImg=res.data.data.image.split(',')[0];
                this.getGoodDetailFun(res.data.data);
                if(bid){
                  this.dialogFormVisible = true;
                }else{
                  this.dialogSelectGoodsVisible=false;
                }
                resolve();
              }else{
                this.$message.error(res.data.state.msg);
                reject();
              }
            })
          }).catch(()=>{
            reject();
          });
        },

        //商品详情数据
        getGoodDetailFun(res){
          this.goodDetailData.gtid=res.gtid;
          this.goodDetailData.work_name=res.wname;
          this.goodDetailData['goods_imgs[]']=res.image.split(',')[0];
          this.goodDetailData.attr_value_imgs=res.attr_value_imgs;
          this.goodDetailData.skus=this.form.skus;
          this.goodDetailData.shipping=res.shipping;
          this.goodDetailData.shipping_type=res.shipping_type;
          this.goodDetailData.shipping_tpl_id=res.shipping_tpl_id;
          this.goodDetailData.desc=res.desc;
          this.goodDetailData.sell_earning=res.sell_earning;
          this.goodDetailData.parent_earning=res.parent_earning;
          this.goodDetailData.grandpa_earning=res.grandpa_earning;
          this.goodDetailData.sell=res.sell;
          this.goodDetailData.goods_type=res.goods_type;
          this.goodDetailData.bid=res.bid;
          this.goodDetailData.am_worktime=res.am_worktime;
          this.goodDetailData.pm_worktime=res.pm_worktime;
          this.goodDetailData.moblie_phone=res.moblie_phone;
          this.goodDetailData.rank=res.rank;
          this.goodDetailData.work_year=res.work_year;
          this.goodDetailData.address=res.address;
          this.goodDetailData.rest_time=res.rest_time;
          this.goodDetailData.interval_time=res.interval_time;
        },

        //保存商品详情
        savaGoodsDetail(){
          var smData=this.goodDetailData;
          smData.buid=this.curuid;
          smData.act=11;
          return new Promise((resolve,reject)=>{
            this.api.request({
              url:this.api.goodsUpdate,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              params:{},
              data:qs.stringify(smData)
            }).then(res=>{
              if(res.data.state.code==10200){
                resolve()
              }else{
                reject(res.data.state.msg);
              }
            }).catch(()=>{
              reject('保存商品失败！')
            });
          });
        },

        //设置thead
        setThead(attrs){
          var validAttrs = attrs.filter(function(attr) {
            return attr.values.length > 0;
          });
          this.thead = validAttrs.map(function(attr) {
            return attr.attr_name;
          });
        },

        //设置rowspan
        setRowspan(rowsData,attrs) {
          var tmpAttrValue;
          var tmpIndex;
          var rowsData=rowsData;
          for (var col = 0; col < attrs.length; col++) {
            for (var row = 0; row < rowsData.length; row++) {
              // 从某列往下遍历
              // 如果有设置参考的值，则比较是否相同，如果相同，累加rowspan值
              if (tmpAttrValue && tmpAttrValue == rowsData[row].attrs[col].value) {
                rowsData[tmpIndex].attrs[col].rowspan += 1;
              } else {
                // 如果不同，则设置新的参考值
                rowsData[row].attrs[col].rowspan = 1;
                tmpAttrValue = rowsData[row].attrs[col].value;
                tmpIndex = row;
              }
            }
          }
          rowsData.forEach((item,i)=>{
            // this.form.skus[i].attrs=item.attrs;
          });
        },

        // 根据规格生成表格
        generateTableByAttrs(attrs) {
          var validAttrs = attrs.filter(function(attr) {
            return attr.values.length > 0;
          });
          var len = 1; // 表格行数
          validAttrs.forEach(function(attr) {
            len *= attr.values.length;
          });
          // 创建表格
          this.rowsData = new Array(len);
          for (var i = 0; i < len; i++) {
            this.rowsData[i] = {
              attrs: [],
            };
          }
          this.fillTable(this.rowsData, validAttrs);
          this.setRowspan(this.rowsData, validAttrs);
        },

        //当前页码数发生变化时触发事件
        handleCurrentChange(page){
          if(this.activeName=='first'){
            this.currentPage1=page;
            this.group_buy_list_data(1);
          }else if(this.activeName=='second'){
            this.currentPage2=page;
            this.group_buy_list_data(2);
          }else if(this.activeName=='third'){
            this.currentPage3=page;
            this.group_buy_list_data(3);
          }
        },

        // 添加规格数据到表格中
        fillTable(rows, attrs) {
          // 每种规格的最大索引值
          var colMaxIndexs = attrs.map(function(attr) {
            return attr.values.length;
          });
          var colIndexs = attrs.map(function() {
            return 0;
          });

          for (var i = 0; i < rows.length; i++) {
            // 依次加入各规格到一行中
            for (var k = 0; k < attrs.length; k++) {
              this.rowsData[i].attrs.push({
                attrId: attrs[k].attr_id,
                value: attrs[k].values[colIndexs[k]].gav_name
              });
            }
            // 添加最后一种规格的索引值，如果越界则重置并进一
            var j = colIndexs.length - 1;
            colIndexs[j] += 1;
            while (j > 0 && colIndexs[j] >= colMaxIndexs[j]) {
              colIndexs[j] = 0;
              colIndexs[j - 1] += 1;
              j = j - 1;
            }
          }
        },

        //去添加商品
        goaddshop(){
            this.$router.push({path:'/mall/goodsManage'});
        }
      }
    }
</script>
<style lang="less">
  #collageList{
    position: relative;
    .btns{
      text-align: right;
      position:absolute;
      right:0px;
      z-index: 2;
    }
    .goods-image{
      position: relative;
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
    .mybutton{
      position: absolute; z-index: 999;
      right:0px;
      top:0px;
    }
    .remarks{
      color: #999;
      position: absolute;
      top: 16px;
      left: 100px;
    }
    .goods-info .more {
      &{
        height:65px;
        overflow: hidden;
      }
      &::after{
        content:"...";
        font-weight:bold;
        position:absolute;
        bottom:10px;
        right:0;
        padding:0 10px 1px 45px;
        background:url(../../../../img/ellipsis_bg.png) repeat-y;
      }

    }
    .el-dialog{
      margin-bottom:0px !important;
    }
    .p10{
      padding:10px;
    }
    td div{
      margin-bottom: 0px;
      .el-input__inner{
        padding:0px 5px;
      }
      .el-form-item__error{
        width:100%;
        position: relative;
      }
    }
    td{
      &:last-child{
        .el-form-item__error{
          left:-45px;
        }
      }
    }
    .el-dialog{
      min-width:750px;
    }
    .pagination{
      padding:10px 0px;
      text-align: center;
    }
    .tableItem{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-right:20px;
    }
    .m-b-10{
      margin-bottom: 10px;
    }
    .textCenter{
      text-align: center;
    }
    .tableList{
      height: 320px;
      overflow-y: auto;
      overflow-x:hidden;
      &:first-child{
        border-top:1px solid #ebeef5;
      }

    }
    td .active{
      color:#f60;
      line-height: 20px;
      font-size:16px;
      &.bold{
        font-weight:bold;
      }
    }
    .rules{
      margin-bottom: 20px;
    }
    .radioBox{
    }
    .tableItem{
      padding:10px 10px 3px;
       border-left:1px solid #ebeef5;
      border-right:1px solid #ebeef5;
      border-bottom:1px solid #ebeef5;
    }
    .goods-header {
      display: flex;
      flex-direction: row;
      align-content: center;
      max-width:500px;
      .goods-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
        overflow: hidden;
        .goods-info-title{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
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
        display: inline-flex;
        width:160px;
        p{
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          line-clamp: 3;
          box-orient: vertical;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
