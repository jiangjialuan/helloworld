<template>
  <el-dialog id="selectg" :title="title==undefined?'选择商品':title" :visible.sync="dialogSelectGoodsVisible"  :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
    <el-tabs v-model="activeName"  type="border-card"  @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in goods" :label="item.title" :name="'tab'+index" :key="item.index">
        <div class="tableList" @scroll.passive="getMore($event);">
          <table class="el-table el-table--border"  cellspacing="0" cellpadding="0" border="0">
            <tr  v-for="(childitem,idx) in item.list" :key="'childitem'+idx">
              <td>
                <div class="goods-header">
                  <div class="goods-image">
                    <img alt="" :src="childitem.image" width="60" height="60">
                    <span class="parentIcon" v-if="childitem.is_custom==6">总店</span>
                  </div>
                  <div class="goods-info">
                    <p class="goods-info-title">{{ childitem.goods_name }}</p>
                    <!--<p class="goods-info-sub" v-if="index==0">价格：￥{{childitem.price | priceFilter}}</p>
                    <p class="goods-info-sub" v-if="index==1">价格：￥{{childitem.price | priceFilter}} 销量：{{childitem.sale_num}}</p>-->
                    <p class="goods-info-sub" v-if="childitem.type=='goods'">价格：￥{{childitem.price | priceFilter}}</p>
                    <p class="goods-info-sub" v-if="childitem.type=='virtual_goods'">价格：￥{{childitem.price | priceFilter}}</p>
                    <p class="goods-info-sub" v-if="childitem.type=='subscribe'">{{childitem.desc}}</p>
                    <p class="goods-info-sub" v-if="childitem.type=='social_security'">服务费￥{{childitem.price | priceFilter}}起</p>
                    <p class="goods-info-sub" v-if="childitem.type=='service_packages'">服务费￥{{childitem.price | priceFilter}}起</p>
                  </div>
                </div>
              </td>
              <td width="55" class="alignCenter" >
                <el-checkbox-group v-model="selectGoods">
                  <el-checkbox :label="childitem.goods_id" :disabled="checkboxIsDisabled(childitem.goods_id)"></el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr v-if="!item.has_next&&item.list.length>10">
              <td class="alignCenter" colspan="2">已加载全部商品</td>
            </tr>
            <tr v-if="item.list.length<=0">
              <td class="alignCenter" colspan="2" v-if="hasAdd=='no'">暂时没有商品</td>
              <td class="alignCenter" colspan="2" v-else>您还没有商品哦~~去<el-button type="text" @click="goAddShop">添加商品</el-button></td>
            </tr>
          </table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogSelectGoodsVisible = false">取 消</el-button>
      <el-button type="primary" @click="selectGoodsComfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        activeName:'tab0',
        screeHeight:window.innerHeight,
        dialogSelectGoodsVisible:false,
        goods: [],
        selectGoods:[],
      }
    },
    props: {
      version:{},
      propSelect:{},
      requestOption:{},
      limit:'',
      title:'',
      hasAdd:'',
    },
    filters:{
      priceFilter(value){
        if(value!=undefined){
          if(value instanceof Object){
            return '￥'+value.min==value.max?value.min:value.min+" - ￥"+value.max
          }else{
            return value
          }
        }else{
          return ;
        }
      }
    },
    watch: {
      version:{
        handler(newValue, oldValue) {
        },
        deep: true
      },
      propSelect:{
        handler(newValue, oldValue) {
          var arr=[];
          if(newValue.length>0){
            newValue.forEach(item=>{
              arr.push(item.goods_id);
            });
          }
          this.selectGoods=arr;
        },
        deep: true
      }
    },
    created(){
    },
    computed:{

    },
    mounted() {
      /*this.versionFun().then(len=>{
        if(len>0)
        this.getList();
      });*/
    },
    methods: {
      //判断checbox是否禁用
      checkboxIsDisabled(id){
        if(this.imit==''||this.limit==undefined||this.limit==null){
          return false;
        }else{
          if(this.selectGoods.length>=this.limit){
            if(this.selectGoods.indexOf(id)>=0){
              return false;
            }else{
              return true;
            }
          }else{
            return false;
          }
        }
      },
      //打开弹框
      open(){
        this.goods=[];
        this.versionFun().then(len=>{
          if(len>0)
            this.getList().then(()=>{
              this.dialogSelectGoodsVisible=true;
            });
        });

      },
      //版本控制
      versionFun(){
        return new Promise((resolve,reject)=>{
          if(this.version.hasReal){
            //实物
            var obj={
              has_next:true,
              currentPage:1,
              list:[],
              title:'实物商品',
              type:1
            };
            this.goods.push(obj);
          }
          if(this.version.hasfictitious){
            //虚拟
            var obj={
              has_next:true,
              currentPage:1,
              list:[],
              title:'虚拟商品',
              type:2
            };
            this.goods.push(obj);
          }
          if(this.version.hasConsultation){
            //咨询
            var obj={
              has_next:true,
              currentPage:1,
              list:[],
              title:'在线咨询',
              type:3
            };
            this.goods.push(obj);
          }
          if(this.version.hasSubscribe){
            //预约
            var obj={
              has_next:true,
              currentPage:1,
              list:[],
              title:'在线预约',
              type:4
            };
            this.goods.push(obj);
          }
          if(this.version.hasService){
            //服务
            var obj={
              has_next:true,
              currentPage:1,
              list:[],
              title:'服务预约',
              type:17
            };
            this.goods.push(obj);
          }
          if(this.version.hassocial){
            //社保
            var obj={
              has_next:true,
              currentPage:1,
              list:[],
              title:'社保公积金',
              type:5
            };
            this.goods.push(obj);
          }
          resolve(this.goods.length);
        });
      },
      //弹框选项卡触发事件
      handleClick(tab, event){
        if(this.goods[tab.index].list.length<=0)
          this.getList();
      },
      //去添加商品
      goAddShop(){
        this.$router.push({path:'/mall/goodAdd'})
      },
      //获取商品列表数据
      getList(){
        var index=parseInt(this.activeName.replace('tab',''));
        var type=this.goods[index].type;
        var has_next=this.goods[index].has_next;
        var cureentPage=this.goods[index].currentPage;
        return new Promise((resolve, reject) => {
          if (this.goods[index].has_next) {
            var smData={
              "act": 11,
              "page": cureentPage,
              "goods_type": type,
            };
            var url=this.api.goods_list;
            if(this.requestOption!=undefined){
              if(this.requestOption.buid!=undefined)
                smData.buid=this.requestOption.buid;
              if(this.requestOption.is_self!=undefined)
                smData.is_self=this.requestOption.is_self;
              if(this.requestOption.url!=undefined)
                url=this.requestOption.url
            }

            this.api.request({
              url: url,
              params: smData
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
      //下拉加载更多
      getMore(e){
        if(e.srcElement!=undefined){
          if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
            this.getList();
          }
        }else{
          if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
            this.getList();
          }
        }
      },
      //筛选选中的商品
      filterSelectGoods(val,oldselect,newselect){
        var selectedId=val;
        var preArr=[];
        var afterArr=[];
        if(selectedId.length>0){
          selectedId.forEach(item=>{
            if(oldselect.length>0){
              var preobj=oldselect.find(child=>{
                return item==child.goods_id;
              });
              if(preobj!=undefined){
                preArr.push(preobj);
              }else{

                if(newselect.length>0){
                  var afterobj=newselect.find(child=>{
                    return item==child.goods_id;
                  });
                }
                if(afterobj!=undefined){
                  afterArr.push(afterobj)
                }
              }
            }else{

              if(newselect.length>0){
                var afterobj=newselect.find(child=>{
                  return item==child.goods_id;
                });
              }
              if(afterobj!=undefined){
                afterArr.push(afterobj)
              }
            }
          });
          console.log(preArr,afterArr);
          return preArr.concat(afterArr)
        }
      },
      //选择商品确认事件
      selectGoodsComfirm(){
        if(this.selectGoods.length<=0){
          this.$message.error("请选择商品！");
        }else{
          var arr=[];
          this.selectGoods.forEach(item=>{
            for(var i=0;i<this.goods.length;i++){
              var str=this.goods[i].list.find(gitem=>{
                return gitem.goods_id==item;
              });
              if(str!=undefined){
                arr.push(str);
                break;
              }
            }
          });
          this.$emit('comfirm',this.filterSelectGoods(this.selectGoods,this.propSelect,arr));
          this.dialogSelectGoodsVisible=false;
        }
      }
    },

  }
</script>
<style lang="less">
#selectg{
  .tableList {
    max-height: 320px;
    overflow-y: auto;
  }
  .goods-info-title{
    word-wrap:break-word;
    max-width: 80%;
  }
  .alignCenter{
    text-align: center;
  }
  td{
    word-break: break-all;
  }
  td .el-checkbox__label{
    display: none;
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
