<template>
<div id="goodsManage">
  <div class="publishBtn">
    <el-button  type="primary" @click="goodShelf()" v-if="userinfo.is_sub_shop&&userinfo.sync_flag">从总店上架</el-button>
    <el-button  type="primary" @click="goodEdit()" >发布新商品</el-button>
  </div>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane v-for="(item,index) in tabs" :label="item" :name="'tab'+index"  :key="'index'+index"></el-tab-pane >
  </el-tabs>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input  placeholder="商品名称" v-model="form.wname"></el-input>
      </el-form-item>
      <el-form-item label="商品来源">
        <el-select placeholder="请选择" v-model="form.source">
          <el-option label="全部" value="all"></el-option>
          <el-option label="自有商品" value="anchor"></el-option>
          <el-option label="主店商品" value="parent"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker
          v-model="form.dataValue"
          type="daterange"
          :editable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="getSaleList(1)">筛选</el-button>
      </el-form-item>
    </el-form>
    <div class="tablePanel" v-if="saleGoods.length>0">
      <el-button @click="sticksBatch()" v-if="activeName=='tab0'?true:false">批量置顶</el-button>
      <el-button @click="depotSaleFun()" v-else>批量上架</el-button>
      <el-button @click="delBatch()">批量删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: auto"
      @sort-change="sortChange"
      @selection-change="selectChange"
      :data="saleGoods"
    >
      <el-table-column
        type="selection"
        width="30">
      </el-table-column>
      <el-table-column
        label="商品" width="240"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="goods-content">
            <div class="goods-img">
              <img :src="scope.row.image"  >
              <span class="parentIcon" v-if="scope.row.is_custom==6">总店</span>
            </div>
            <div class="goods-info">
              <p class="wname">{{scope.row.wname}}</p>
              <p class="price">￥{{scope.row.price.min==scope.row.price.max?scope.row.price.min:scope.row.price.min+" - ￥"+scope.row.price.max}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="小程序链接" v-if="activeName=='tab0'?true:false">
        <template slot-scope="scope">
          <div>pages/mall/detail?goods_id={{scope.row.bid}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center"
        prop="sale_num"
        label="总销量"  sortable="custom"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="创建时间" prop="updatetime"  sortable="custom">
      </el-table-column>
      <el-table-column
        label="排序" >
        <template slot-scope="scope">
          <el-button type="text" @click="goodsSort(scope.row.bid,'up',scope.$index)">上移</el-button>
          <el-button type="text"  @click="goodsSort(scope.row.bid,'down',scope.$index)">下移</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.is_custom==1||scope.row.is_custom==2" @click="saleGoodsEidt(scope.row.bid)">编辑</el-button>
          <el-button type="text" @click="depotSaleFun(scope.row.bid)" v-if="scope.row.is_custom!=6">{{['下架','上架'][scope.row.sell]}}</el-button>
          <el-button type="text" v-if="scope.row.overhead==1&&activeName=='tab0'" @click="sticksBatch(scope.row.bid,0)">取消置顶</el-button>
          <el-button type="text" v-if="scope.row.overhead==0&&activeName=='tab0'" @click="sticksBatch(scope.row.bid,1)">置顶</el-button>
          <el-button type="text" @click="delBatch(scope.row.bid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block textCenter p10">
      <el-pagination
        :page-size="pagination.per_page"
        layout="total,  prev, pager, next, jumper"
        :total="pagination.total_count"
        :current-page="pagination.page"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>

  <selectGood :requestOption="requestOption" hasAdd="no" ref="goodref" :version="versionData" :propSelect="alertSelectGoods" @comfirm="selectGoodsComfirm"></selectGood>
</div>
</template>

<script>
  import qs from 'qs';
  import selectGood from '../../../components/selectgoods.vue'
    export default {
      components:{
        qs,
        selectGood
      },
      data() {
        return {
          activeName:'tab0',
          pagination:{
            page:1,
            total_count:0,
            total_page:0,
            per_page:20
          },
          form:{
            wname:'',
            status:'sale',
            dataValue:[],
            source:'',
            brand_id:'',
            gtid:'',
            orderby:'',
            order:''
          },
          tabs:['在售商品','仓库中的商品'],
          saleGoods:[],
          selectGoods:[],
          userinfo:JSON.parse(sessionStorage.getItem('userinfo')),
          curuid:sessionStorage.getItem('curuid'),
          hassubshop:sessionStorage.getItem('hassubshop'),
          versionData:{
            hassocial:'',
            hasService:'',
            hasSubscribe:'',
            hasConsultation:'',
            hasfictitious:'',
            hasReal:''
          },
          alertSelectGoods:[],
          version:sessionStorage.getItem('version'),
          requestOption:{
            url:'/business/goods/parent_shop_goods_data',
            buid:sessionStorage.getItem('curuid')
          }
        }
      },
      created(){
        this.getSaleList(1);
        this.hassocial();
        this.hasService();
        this.hasSubscribe();
        this.hasConsultation();
        this.hasfictitious();
        this.hasReal();
      },
      methods: {
        //从总店上架
        goodShelf(){
          this.$refs['goodref'].open();
        },
        //选择商品确定触发事件
        selectGoodsComfirm(selectGoods){
          debugger;
          const loading = this.$loading({
            lock: true,
            text: '正在同步~~',
          });
          var smData={
            buid:this.curuid,
            bids:'',
          }
          var arr=[];
          selectGoods.forEach(item=>{
            arr.push(item.goods_id);
          });
          smData.bids=arr.join(',')

          this.api.request({
            url:this.api.sell_parent_goods,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({type:'success',message:'上架成功！'});
              this.form.wname='';
              this.form.dataValue=[];
              this.form.source='';
              this.form.brand_id='';
              this.form.gtid='';
              this.form.orderby='';
              this.form.order='';
              this.form.status='sale';
              this.activeName='tab0';
              this.pagination.page=1;
              this.pagination.total_count=0;
              this.pagination.total_page=0;
              this.pagination.per_page=20;
              this.selectGoods=[];
              this.getSaleList(1);
              loading.close();
            }else{
              loading.close();
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //tab切换触发事件
        handleClick(tab){
          this.form.wname='';
          this.form.dataValue=[];
          this.form.source='';
          this.form.brand_id='';
          this.form.gtid='';
          this.form.orderby='';
          this.form.order='';
          if(tab.name=='tab0'){
            this.form.status='sale';
          }else{
            this.form.status='depot';
          }
          this.pagination.page=1;
          this.pagination.total_count=0;
          this.pagination.total_page=0;
          this.pagination.per_page=20;
          this.selectGoods=[];
          this.getSaleList(1)
        },
        //发布新商品
        goodEdit(){
            this.$router.push({
              path:'/mall/goodAdd/'
            })
        },
        //获取在售商品列表
        getSaleList(page){
            var smData=JSON.parse(JSON.stringify(this.form));
            if(this.form.dataValue==undefined||this.form.dataValue.length==0){
              smData.from='';smData.to='';
            }else{
              smData.from=this.form.dataValue[0];
              smData.to=this.form.dataValue[1];
            }
            delete smData.dataValue;
            smData.page=page;
            smData.buid=this.curuid;
            this.api.request({
              url:this.api.salegoods,
              params:smData
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.saleGoods=res.data.data.list;
                this.pagination.page=res.data.data.page;
                this.pagination.total_count=res.data.data.total_count;
                this.pagination.total_page=res.data.data.total_page;
                this.pagination.per_page=res.data.data.per_page;
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
        },
        //页码改变时触发函数
        pageChange(page){
          this.getSaleList(page);
        },
        //编辑商品
        saleGoodsEidt(bid){
          this.$router.push({path:'/mall/goodEdit/'+bid})
        },
        //上架，下架商品
        depotSaleFun(bid){
          var smData={};
          smData.buid=this.curuid;
          if(bid==undefined){
            smData.status='sale';
            smData.ids=[];
            if(this.selectGoods.length<=0){
              this.$message.error("请选择商品！");
            }else {
              this.selectGoods.forEach((item) => {
                smData.ids.push(item.bid);
              });
              this.depotSaleRequest(smData,this.form.status);
            }

          }else{
            smData.ids=bid;
            if(this.form.status=='sale'){
              smData.status="depot";
              this.$confirm('确定要下架该商品？下架商品，可在“仓库中的商品”管理', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(()=>{
                this.depotSaleRequest(smData,this.form.status);
              });
            }else{
              smData.status='sale';
              this.depotSaleRequest(smData,this.form.status);
            }
          }
        },
        depotSaleRequest(smData,type){

          if(type=='sale'){
            var message="下架成功！";
            var loadtxt="下架";
          }else{
            var message="上架成功！";
            var loadtxt="上架";
          }
          var loading = this.$loading({
            lock: true,
            text: '正在'+loadtxt+'商品，请稍候~~',
            background: 'rgba(255, 255, 255, 0.7)'
          });
          this.api.request({
            url:this.api.goodsChangeStatus,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              loading.close();
              this.$message({
                type:"success",
                message:message
              });

              this.getSaleList(this.pagination.page);
            }else{
              loading.close();
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //列表排序
        sortChange(row){
          this.form.orderby=row.prop;
          if(row.order=='ascending'){
            this.form.order="asc";
          }else{
            this.form.order="desc"
          }
          this.getSaleList(1);
        },
        //上移下移排序
        goodsSort(id,type,index){
          var  flag='';
          if(this.saleGoods[index].overhead==0&&index>0&&type=='up'){
            if(this.saleGoods[parseInt(index)-1].overhead==1){
              //this.$message.error('您已经排在最前面了！');
              flag='非置顶商品品中您已经排在最前面了！';
            }
          }
          if(this.saleGoods[index].overhead==1&&type=='down'){
            if(this.saleGoods[parseInt(index)+1].overhead==0){
              //this.$message.error('');
              flag='置顶商品中您已经排在最后面了！';
            }
          }
          if(index==0&&type=='up'&&this.pagination.page==1){
            //this.$message.error('您已经排在最前面了！');
            flag='您已经排在最前面了！';
          }
          if(index==this.saleGoods.length-1&&type=='down'&&this.pagination.page==this.pagination.total_page){
            //this.$message.error('您已经排在最后面了！');
            flag='您已经排在最后面了！';
          }
          if(flag==''){
            this.sortRequest(id,type,index);
          }else{
            this.$message.error(flag);
          }
        },
        sortRequest(id,type,index){
          var smData={
            buid:parseInt(this.curuid),
            bid:parseInt(id),
            sort_type:type
          }
          this.api.request({
            url:this.api.goods_sort,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.selectGoods=[];
              this.getSaleList(this.pagination.page);
              this.$message({
                type:'success',
                message:'排序成功！'
              });
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //选择商品触发事件
        selectChange(select){
          this.selectGoods=select;
        },
        //置顶/取消置顶商品事件
        sticksBatch(id,type){
          var smData={};
          smData.buid=this.curuid;
          smData.json=[];
          if(id==undefined){
            if(this.selectGoods.length<=0){
              this.$message.error("请选择商品！");
            }else{
              this.selectGoods.forEach((item)=>{
                smData.json.push({
                  bid:item.bid,
                  overhead:"1"
                });
              });
              smData.json=JSON.stringify(smData.json);
              this.stricksRequest(smData,1);
            }
          }else{
            smData.json.push({bid:id,overhead:type});
            smData.json=JSON.stringify(smData.json);
            this.stricksRequest(smData,type);
          }
        },
        //strickBatchRequest
        stricksRequest(smData,type){
          var message=type==1?'置顶成功！':'取消置顶成功！'
          this.api.request({
            url:this.api.updateOverhead,
            method:"post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({
                type:'success',
                message:message
              });
              this.getSaleList(1);
            }else{
              this.$message.error(res.data.state.msg);
            }
          })
        },
        //批量删除
        delBatch(id){
          var smData={};
          smData.buid=this.curuid;
          smData.ids=[];
          if(id==undefined){
            if(this.selectGoods.length<=0){
              this.$message.error("请选择商品！");
            }else{
              smData.msg="批量删除成功！";
              this.selectGoods.forEach((item)=>{
                smData.ids.push(item.bid);
              });
              this.delBatchRequest(smData);
            }
          }else{
            smData.msg="删除成功！";
            smData.ids.push(id);
            this.delBatchRequest(smData);
          }
        },
        //delBatchRequest
        delBatchRequest(smData){
          this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            /*type: 'warning'*/
          }).then(()=>{
            var loading = this.$loading({
              lock: true,
              text: '正在删除商品，请稍候~~',
              background: 'rgba(255, 255, 255, 0.7)'
            });
            this.api.request({
              url:this.api.goodsDelete,
              method:"post",
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(smData)
            }).then((res)=>{
              loading.close();
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'删除成功！'
                });
                this.getSaleList(this.pagination.page);
              }else{
                loading.close();
                this.$message.error(res.data.state.msg);
              }
            });
          });

        },
        hassocial(){
          if(this.version.indexOf('社保')>=0){
            this.versionData.hassocial=true;
          }else{
            this.versionData.hassocial=false;
          }
        },
        hasService(){
          //服务
          if(this.version.indexOf('美业')>=0){
            this.versionData.hasService=true;
          }else{
            this.versionData.hasService=false;
          }
        },
        hasSubscribe(){
          //预约
          if(this.version.indexOf('美业')>=0){
            this.versionData.hasSubscribe=true;
          }else{
            this.versionData.hasSubscribe=false;
          }
        },
        hasConsultation(){
          //咨询
          if(this.version.indexOf('标准')>=0){
            if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
              this.versionData.hasConsultation = false;
            }else
              this.versionData.hasConsultation=true;
          }else if(this.version.indexOf('尊享')>=0){
            if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
              this.versionData.hasConsultation = false;
            }else
              this.versionData.hasConsultation=true;
          }else if(this.version.indexOf('美业')>=0){
            if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
              this.versionData.hasConsultation = false;
            }else
              this.versionData.hasConsultation=true;
          }else if(this.version.indexOf('社保')>=0){
            if(!this.userinfo.sync_flag&&this.userinfo.is_sub_shop) {
              this.versionData.hasConsultation = false;
            }else
              this.versionData.hasConsultation=true;
          }else{
            this.versionData.hasConsultation=false;
          }
        },
        hasfictitious(){
          //虚拟
          if(this.version.indexOf('标准')>=0){
            this.versionData.hasfictitious=true;
          }else if(this.version.indexOf('尊享')>=0){
            this.versionData.hasfictitious=true;
          }else if(this.version.indexOf('美业')>=0){
            this.versionData.hasfictitious=true;
          }
          else if (this.version.indexOf('社保') >= 0){
            this.versionData.hasfictitious=true;
          }
          else{
            this.versionData.hasfictitious=false;
          }
        },
        hasReal(){
          //实物
          if(this.version.indexOf('标准')>=0){
            this.versionData.hasReal=true;
          }else if(this.version.indexOf('尊享')>=0){
            this.versionData.hasReal=true;
          }else if(this.version.indexOf('美业')>=0){
            this.versionData.hasReal=true;
          }else{
            this.versionData.hasReal=false;
          }
        },
      },
    }
</script>

<style lang="less">
#goodsManage{
  td{
    .el-button+.el-button{
      margin-left:0px;
      margin-right:10px;
    }
  }
  .publishBtn{
      position:absolute;
      top:65px;
      right:0px;
    z-index: 99;
  }
  .tablePanel{
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
  }
  .textCenter{
    text-align: center;
  }
  .p10{
    padding:10px;
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
}
</style>
