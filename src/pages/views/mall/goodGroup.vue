<template>
  <div id="goodGroup">
    <div style="text-align: right;"><el-button type="primary" @click="addFirstGroup">+ 添加新的分组</el-button></div>
    <el-table
      :data="tableList"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      style="width: auto">
      <el-table-column type="expand" width="40">
        <template slot-scope="props">
          <el-table v-if="props.row.child.length>0"
            :data="props.row.child" :show-header="false"
            style="width: 100%">
            <el-table-column class-name="rowName"
              label="分组名称" >
              <template slot-scope="scope">
                <img src="../../../img/u52.png" class="titleIcon"/>
                <label>{{scope.row.name}}</label>
              </template>
            </el-table-column>
            <el-table-column
              label="包含商品">
              <template slot-scope="scope">
                <label style="margin-right:10px;">{{scope.row.goods_num}}</label>
                <el-button type="text" @click="addClick(scope.row.id,props.row.id)">添加</el-button>
                <el-button type="text" @click="eidtGroup(scope.row.id,props.row.id)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="排序">
              <template slot-scope="scope">
                <el-button type="text" @click="sortGroup2(scope.row.id,'up',props.$index,scope.$index)">上移</el-button>
                <el-button type="text" @click="sortGroup2(scope.row.id,'down',props.$index,scope.$index)">下移</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="createtime">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="delGroup(scope.row.id,props.$index,scope.$index)">删除子分组</el-button>
                <el-button type="text" @click="rename(scope.row.id,props.$index,scope.$index)">重命名</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="additem"><i @click="addSecondGroup(props.row.id,props.$index)" class="el-icon-circle-plus"><span>添加子分组</span></i></div>
        </template>
      </el-table-column>
      <el-table-column
        label="分组名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="包含商品">
        <template slot-scope="scope">
          <label style="margin-right:10px;">{{scope.row.goods_num}}</label>
          <el-button type="text" @click="addClick(scope.row.id,scope.row.id)">添加</el-button>
          <el-button type="text" @click="eidtGroup(scope.row.id,scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="排序">
        <template slot-scope="scope">
          <el-button type="text" @click="sortGroup1(scope.row.id,'up',scope.$index)">上移</el-button>
          <el-button type="text" @click="sortGroup1(scope.row.id,'down',scope.$index)">下移</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createtime">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="delGroup(scope.row.id,scope.$index,'first')">删除分组</el-button>
          <el-button type="text" @click="rename(scope.row.id,scope.$index,'first')">重命名</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="选择商品" :visible.sync="selectGoodsVisible" ref="selectGoods" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'" >
      <div style="max-height: 400px;overflow-y:auto;"  @scroll.passive="getMore($event);">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table" >
          <tbody>
          <tr class="el-table__row" v-for="(itemChild,index) in goods.list" :key="'goods'+index">
            <td class="el-table_42_column_183  ">
              <div class="goods-header">
                <div class="goods-image">
                  <img alt="" :src="itemChild.image" width="60" height="60">
                  <span class="parentIcon" v-if="itemChild.is_custom==6">总店</span>
                </div>
                <div class="goods-info">
                  <p class="goods-info-title">{{ itemChild.wname }}</p>
                  <p class="goods-info-sub">价格：￥{{itemChild.price.min==itemChild.price.max?itemChild.price.min:itemChild.price.min+' - ￥ '+itemChild.price.max}}</p>
                  <!--
                  <p class="goods-info-sub" v-if="index==1">价格：￥{{itemChild.price}} 销量：{{itemChild.sale_num}}</p>
                  <p class="goods-info-sub" v-if="index==3">{{itemChild.desc}}</p>
                  <p class="goods-info-sub" v-if="index==4">服务费￥{{itemChild.price}}起</p>-->
                </div>
              </div>
            </td>
            <td class="el-table_42_column_184  ">
              <div class="radioBox">
                <el-checkbox v-model="goodselect" :label="itemChild.bid"></el-checkbox>
              </div>
            </td>
          </tr>
          <tr v-if="!goods.has_next&&goods.list.length>4">
            <td colspan="2" style="text-align: center">您已经拉到底了！</td>
          </tr>
          <tr v-if="goods.list.length<=0">
            <td colspan="3" style="text-align: center">暂时无没商品~~<el-button type="primary" @click="goaddpage">添加商品</el-button></td>
          </tr>
          </tbody>

        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectGoodsComfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="eidtGoodsVisible" ref="eiditGoods" :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'" >
      <div style="max-height: 400px;overflow-y:auto;"  @scroll.passive="getMore2($event);">
        <el-button type="primary" @click="eiditGoodsDelAll" :disabled="editgoods.list.length>0?false:true">批量删除</el-button>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table" >
          <thead>
          <tr  class="el-table__row" style="border-bottom: 1px solid #ebeef5;">
            <th  width="40"><el-checkbox v-model="checkAll"  @change="handleCheckAllChange" :disabled="editgoods.list.length>0?false:true"></el-checkbox></th>
            <!--<th  width="40" v-else><el-checkbox v-model="checkAll"  @change="handleCheckAllChange" disabled=""></el-checkbox></th>-->
            <th  class="el-table_42_column_183  ">商品</th>
            <th  class="el-table_42_column_184" style="padding-right:20px;">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr class="el-table__row" v-for="(itemChild,index) in editgoods.list" :key="'goods'+index">
            <td width="40"><el-checkbox v-model="editgoodselect" :label="itemChild" @change="handleCheckedCitiesChange"></el-checkbox></td>
            <td class="el-table_42_column_183  ">
              <div class="goods-header">
                <div class="goods-image">
                  <img alt="" :src="itemChild.image" width="60" height="60">
                  <span class="parentIcon" v-if="itemChild.sell==1">下架</span>
                  <span class="parentIcon" v-else-if="itemChild.is_custom==6">总店</span>
                </div>
                <div class="goods-info">
                  <p class="goods-info-title">{{ itemChild.wname }}</p>
                  <p class="goods-info-sub">价格：￥{{itemChild.price.min==itemChild.price.max?itemChild.price.min:itemChild.price.min+' - ￥ '+itemChild.price.max}}</p>
                </div>
              </div>
            </td>
            <td class="el-table_42_column_184" style="padding-right:20px;">
              <el-button type="text" @click="eiditGoodsDel(itemChild.bid,index)">删除</el-button>
            </td>
          </tr>
          <tr v-if="editgoods.list.length<=0">
            <td colspan="3" style="text-align: center">暂时无没商品~~</td>
          </tr>
          <tr v-if="!editgoods.has_next&&editgoods.list.length>4">
            <td colspan="3" style="text-align: center">您已经拉到底了！</td>
          </tr>
          </tbody>

        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eidtGoodsVisible = false">关 闭</el-button>
        <!--<el-button type="primary" @click="eiditGoodsComfirm">确 定</el-button>-->
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import qs from 'qs';
    export default{
        data: function () {
            return {
              screeHeight:window.innerHeight,
              SelectGoodsVisible:false,
              activeName:'first',
              selectGoodsVisible:false,
              tableList: [],
              goodselect:[],
              editgoodselect:[],
              checkAll:[],
              eidtGoodsVisible:false,
              curGroupId:'',
              parentid:'',
              editgoods:{
                curentpage:1,
                has_next:true,
                list:[],
              },
              goods:{
                curentpage:1,
                has_next:true,
                list:[],
              },
              oldtime:'',
              curuid:sessionStorage.getItem('curuid'),
              expands:[],
            }
        },
      created(){
        this.getGroup();
      },
        methods: {
          //去添加商品
          goaddpage(){
            this.$router.push({path:'/mall/goodAdd'})
          },
          //table行展开
          getRowKeys(row){
           return row.id;
          },
          //当用户对某一行展开或者关闭的时候会触发该事件
          expandChange(row, expandedRows){
            this.expands=[];
            expandedRows.forEach(item=>{
              this.expands.push(item.id);
            });
          },
          //获取分组列表
          getGroup(){
            this.api.request({
              url:this.api.goods_group_data,
              params:{
                buid:this.curuid
              }
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.tableList=res.data.data;
              }else{
                this.$message.error(res.data.state.msg);
              }
            })
          },
          //是否为空
          isNull(value){
            if(value==''||value==null){
              return '分组名称不能为空';
            }else if(value.length>10){
              return '分组名称长度不能超过10个字符';
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
          //新增一级分组
          addFirstGroup(){
            if(this.tableList.length<10){
              this.$prompt('名称', '新建分组', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: this.isNull,
                inputErrorMessage: '分组名称不能为空'
              }).then((value) => {
                var smData={
                  id:'',
                  name:value.value,
                  buid:this.curuid
                };
                this.api.request({
                  url:this.api.goods_group_save,
                  method:'post',
                  headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                  data:qs.stringify(smData)
                }).then((res)=>{
                  if(res.data.state.code=10200){
                    this.getGroup();
                    this.$message({
                      type:'success',
                      message:'新建成功！'
                    });

                  }else{
                    this.$message.error(res.data.state.msg);
                  }
                });
              }).catch();
            }else{
              this.$message.error("一组分组最多只能建10个");
            }
          },
          //添加二级分组
          addSecondGroup(parentid,index){
            this.$prompt('名称', '新建分组', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputValidator: this.isNull,
              inputErrorMessage: '分组名称不能为空'
            }).then((value) => {
              var smData={
                parent_id:parentid,
                name:value.value,
                buid:this.curuid
              };
              this.api.request({
                url:this.api.goods_group_save,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code=10200){
                  this.tableList[index].child.push({
                    createtime:res.data.data.createtime,
                    id:res.data.data.id,
                    sort:res.data.data.sort,
                    goods_num:0,
                    name:smData.name,
                  });
                  this.$message({
                    type:'success',
                    message:'新建成功！'
                  });

                }else{
                  this.$message.error(res.data.state.msg);
                }
              });
            }).catch();
          },
          //重命名
          rename(id,index,form){
            this.$prompt('名称', '新建分组', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputValidator: this.isNull,
              inputErrorMessage: '分组名称不能为空'
            }).then((value) => {
              var smData={
                id:id,
                name:value.value,
                buid:this.curuid
              };
              this.api.request({
                url:this.api.goods_group_save,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code=10200){
                  if(form=='first'){
                    this.tableList[index].name=smData.name;
                  }else{
                    this.tableList[index].child[form].name=smData.name;
                  }
                  this.$message({
                    type:'success',
                    message:'重命名成功！'
                  });
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });
            }).catch();
          },
          //删除分组
          delGroup(id,index,form){
            this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var smData={
                id:id,
                buid:this.curuid,
              };
              this.api.request({
                url:this.api.goods_group_del,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.getGroup();
                  this.$message({
                    type:'success',
                    message:'分组删除成功！'
                  });
                }else{
                  this.$message.error(res.data.state.msg);
                }
              })
            }).catch();
          },
          //一级分组排序
          sortGroup1(id,type,index){
            if(index==0&&type=='up'){
              this.$message.error('您已经排在最前面了！');
            }
            else if(index==this.tableList.length-1&&type=='down'){
              this.$message.error('您已经排在最后面了！');
            }else{
              var smData={
                sort_type:type,
                buid:this.curuid,
                id:id
              }
              this.api.request({
                //url:this.api.goods_group_sort_child,
                url:this.api.goods_group_sort_parent,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  var obj=JSON.parse(JSON.stringify(this.tableList[index]));
                  if(type=='up'){
                    var preobj=JSON.parse(JSON.stringify(this.tableList[parseInt(index)-1]));
                    this.tableList.splice(parseInt(index)-1,2,obj,preobj);
                  }else{
                    var afterobj=JSON.parse(JSON.stringify(this.tableList[parseInt(index)+1]));
                    this.tableList.splice(index,2,afterobj,obj);
                  }
                  this.$message({
                    type:'success',
                    message:'排序成功！'
                  });
                }else{
                  this.$message.error(res.data.state.msg);
                }
              })
            }
          },
          //二级分组排序
          sortGroup2(id,type,index,indexChild){
            if(indexChild==0&&type=='up'){
              this.$message.error('您已经排在最前面了！');
            }else if(indexChild==this.tableList[index].child.length-1&&type=='down'){
              this.$message.error('您已经排在最后面了！');
            }else{
              var smData={
                sort_type:type,
                buid:this.curuid,
                id:id
              }
              this.api.request({
                url:this.api.goods_group_sort_child,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  var obj=JSON.parse(JSON.stringify(this.tableList[index].child[indexChild]));
                  if(type=='up'){
                    var preobj=JSON.parse(JSON.stringify(this.tableList[index].child[parseInt(indexChild)-1]));
                    this.tableList[index].child.splice(parseInt(indexChild)-1,2,obj,preobj);
                  }else{
                    var afterobj=JSON.parse(JSON.stringify(this.tableList[index].child[parseInt(indexChild)+1]));
                    this.tableList[index].child.splice(indexChild,2,afterobj,obj);
                  }
                  this.$message({
                    type:'success',
                    message:'排序成功！'
                  });
                }else{
                  this.$message.error(res.data.state.msg);
                }
              })
            }
          },
          //点击添加触发事件
          addClick(id,parentid){
            this.selectGoodsVisible=true;
            this.goods={
              curentpage:1,
              has_next:true,
              list:[],
            };
            this.parentid=parentid;
            this.goodselect=[],
            this.curGroupId=id;
            this.getgoodsList(id);
          },
          //获取弹框商品列表
          getgoodsList(id){
           // if(this.throttle(new Date().getTime(),500)){
              var smData={
                page:this.goods.curentpage,
                exclude_group:id,
                status:'sale',
                buid:this.curuid
              };
              this.api.request({
                url:this.api.salegoods,
                params:smData
              }).then((res)=>{
                if(res.data.state.code==10200){
                  if(this.goods.list.length<0)
                    this.goods.list=res.data.data.list;
                  else{
                    this.goods.list=this.goods.list.concat(res.data.data.list);
                  }
                  this.goods.curentpage=parseInt(res.data.data.page)+1;
                  this.goods.has_next=res.data.data.page<res.data.data.total_page?true:false;
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });
           // }
          },

          //商品弹框--滚动至底部加载更多商品
          getMore(e){
            //if(this.throttle(new Date().getTime(),15)){
              if(e.srcElement!=undefined){
                if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
                  if (this.goods.has_next) {
                    this.getgoodsList(this.curGroupId);
                  }
                }
              }else{
                //解决火狐不兼容e.srcElement
                if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
                  if (this.goods.has_next) {
                    this.getgoodsList(this.curGroupId);
                  }
                }
              }
           // }
          },

          //选择商品弹框确定按钮触发事件bind商品事件
          selectGoodsComfirm(){
            if(this.goodselect.length<=0){
              this.$message.error('请选择商品！');
            }else{
              var smData={
                buid:this.curuid,
                goods_id:this.goodselect.join(','),
                group_id:this.curGroupId,
              }
              this.api.request({
                url:this.api.bind_goods_group,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.getGroup();
                  this.selectGoodsVisible=false;
                  this.$message({
                    type:'success',
                    message:'添加成功'
                  });
                }else{
                  this.$message.error(res.data.state.msg);
                }
              })
            }
          },
          //获取编辑商品弹框内容
          getEidtGoods(id){
            //if(this.throttle(new Date().getTime(),500)){
              var smData={
                buid:this.curuid,
                page:this.editgoods.curentpage,
                group_id:id
              };
              this.api.request({
                url:this.api.get_group_goods,
                params:smData,
              }).then((res)=>{
                if(res.data.state.code==10200){
                  if(this.editgoods.list.length<0)
                    this.editgoods.list=res.data.data.list;
                  else{
                    this.editgoods.list=this.editgoods.list.concat(res.data.data.list);
                  }
                  this.editgoods.curentpage=parseInt(res.data.data.page)+1;
                  console.log(this.editgoods.curentpage);
                  if(this.editgoods.curentpage<=res.data.data.total_page){
                    this.editgoods.has_next=true;
                  }else{
                    this.editgoods.has_next=false;
                  }
                }else{
                  this.$message.error(res.data.state.msg);
                }
              })
           // }

          },
          //点击编辑触发事件
          eidtGroup(id,parentid){
            this.eidtGoodsVisible=true;
            this.editgoods={
              curentpage:1,
              has_next:true,
              list:[],
            };
            this.checkAll=false;
            this.editgoodselect=[];
            this.parentid=parentid;
            this.curGroupId=id;
            this.getEidtGoods(id);
          },
          //编辑商品弹框--滚动至底部加载更多商品
          getMore2(e){
            if(this.throttle(new Date().getTime(),200)){
              debugger;
              if(e.srcElement!=undefined){
                if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
                  debugger;
                  if (this.editgoods.has_next) {
                    this.getEidtGoods(this.curGroupId);
                  }
                }
              }else{
                //解决火狐不兼容e.srcElement
                if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
                  if (this.editgoods.has_next) {
                    this.getEidtGoods(this.curGroupId);
                  }
                }
              }
            }
          },
          //编辑商品弹框全选事件
          handleCheckAllChange(val){
            this.editgoodselect = val ? this.editgoods.list: [];
          },
          //编辑商品弹框单选事件
          handleCheckedCitiesChange(value){
            if(value){
              if(this.editgoodselect.length==this.editgoods.list.length){
                this.checkAll=true;
              }
            }else{
              if(this.editgoodselect.length<=this.editgoods.list.length){
                this.checkAll=false;
              }
            }
          },
          //编辑弹框商品点击行删除触发事件
          eiditGoodsDel(id,index){
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var smData={
                bids:id,
                group_id:this.curGroupId,
                buid:this.curuid
              };
              this.api.request({
                url:this.api.del_group_goods,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  if(index!=undefined&&index!=null){
                    this.editgoods.list.splice(index,1);
                  }else{
                    var arr=[];
                    if(this.editgoods.list.length==this.editgoodselect.length){
                      this.editgoods.list=[];
                      this.editgoodselect=[];
                    }else{
                      this.editgoods.list.forEach(item=>{
                        var obj;
                        this.editgoodselect.forEach(child=>{
                          if(child.id==item.id){
                            obj=child;
                            return;
                          }
                        });
                        if(obj==undefined){
                          arr.push(item);
                        }
                      });
                      this.editgoods.list=arr;
                      this.editgoodselect=[];
                    }


                  }
                  this.getGroup();
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }else{
                  this.$message.error(res.data.state.msg);
                }
              });

            }).catch();
          },
          //编辑商品弹框批量删除
          eiditGoodsDelAll(){
            if(this.editgoodselect.length<=0){
              this.$message.error('请选择要删除的商品');
            }else{
              var arr=[];
              arr=this.editgoodselect.map(item=>{
                return item.bid
              });
              this.eiditGoodsDel(arr.join(','));
            }
          },

        }
    }
</script>
<style lang="less">


  #goodGroup{
    .goods-image{
      position:relative;
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
    .el-checkbox{
      .el-checkbox__label{
        display: none;
      }
    }
    tr .el-table__expanded-cell{
      padding:0px 0px 0px 40px;
    }

    .titleIcon{
      transform: rotate(90deg); vertical-align: middle; margin-right:10px;
    }
    .additem{
      line-height: 65px;
      text-align: left;
      font-size:20px;
      i{
        cursor:pointer;
      }
      span{
        font-size:13px;
        vertical-align: middle;
      }
    }
    .rowName{

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
    .groupSecond{
      width:100%;
      li{
        width:100%;
        span{
          display:inline-block;
        }
      }
    }
  }
</style>
