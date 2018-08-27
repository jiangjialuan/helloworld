<template>
  <div id="workPhotos">
    <el-table
      :data="tableData"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-card class="box-card photos" v-for="(item,index) in props.row.showreelList" :key="'showreel'+index" v-if="props.row.showreelList">
            <div class="photoblock"  @click="goDetail(item.id,item.name)" v-on:mouseleave="closemenu">
              <div class="imgbox">
                <img :src="item.cover" v-if="item.cover!=''"/>
                <img v-else src="../../../../img/mall/pic-none.png"/>
                <span class="pic-num">{{item.count}}</span>
              </div>
              <div class="album-ft">
                <p class="title">{{item.name}}</p>
              </div>
            </div>
            <span class="downmenue" @click="openmenu(item.id)">
                <i class="icon el-icon-arrow-down"></i>
            </span>
            <div class="downmenue-child" v-if="item.id==openid" v-on:mouseenter="openmenu(item.id)">
              <ul>
                <li @click="editPhotosShow(item.bid,item.name)"><i class="el-icon-edit"></i>编辑</li>
                <li @click="delphotos(item.bid,item.id)"><i class="el-icon-delete"></i>删除</li>
              </ul>
            </div>
          </el-card>
          <el-card class="box-card photos" v-if="props.row.showreelList.length<30">
            <div class="addphotos"  @click="editPhotosShow(props.row.goods_id)">
              <i class="el-icon-plus"></i>
            </div>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column
        label="技师名称"
        prop="goods_name">
      </el-table-column>
      <el-table-column
        label="职级"
        prop="rank">
      </el-table-column>
      <el-table-column
        label="作品集数"
        prop="showreel_count">
      </el-table-column>
    </el-table>
    <div class="block alignCenter">
      <el-pagination
        @current-change="getList"
        :current-page.sync="pagination.currentpage"
        :page-size="pagination.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <el-dialog :title="photoform.id==''?'新增作品集':'编辑作品集'" :visible.sync="dialogFormVisible" width="350px">
      <el-form :model="photoform">
        <el-form-item label="名称" label-width="150">
          <el-input v-model="photoform.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPhotosComfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "workPhotos",
      data(){
        return {
          curuid:sessionStorage.getItem('curuid'),
          tableData: [],
          pagination:{
            currentpage:1,
            pagesize:10,
            total:0
          },
          dialogFormVisible:false,
          photoform:{
            name:'',
            bid:'',
            id:'',
          },
          expands:[],
          openid:'',
          oldtime:'',
        }
      },
      created(){

         this.getList(this.pagination.currentpage);
         console.log(this.expands);
      },
      methods:{
        //table行展开
        getRowKeys(row){
          return row.goods_id;
        },
        //当用户对某一行展开或者关闭的时候会触发该事件
        expandChange(row, expandedRows){
          this.expands=[];
          expandedRows.forEach(item=>{
            this.expands.push(item.goods_id);
          });
          this.showreel_list_data(row.goods_id);

        },
        //获取技师列表
        getList(page){
          this.api.request({
            url:this.api.goods_list,
            params:{
              act:11,
              page:page,
              goods_type:4,
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.tableData=res.data.data.list;
              this.pagination.currentpage=res.data.data.page;
              this.pagination.pagesize=res.data.data.per_page;
              this.pagination.total=res.data.data.total_count;
              if(this.$route.query.expand!=undefined&&this.expands.length==0){
                this.expands=JSON.parse(this.$route.query.expand);
                this.expands.forEach(item=>{
                  this.showreel_list_data(item);
                });
              }
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //获取员工作品集
        showreel_list_data(goods_id){
          var smData={};
          smData.buid=this.curuid;
          smData.bid=goods_id;
          this.api.request({
            url:this.api.showreel_list_data,
            method:'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            data:qs.stringify(smData)
          }).then((res)=>{
            if(res.data.state.code==10200){
              for(var i=0;i<this.tableData.length;i++){
                if(goods_id==this.tableData[i].goods_id){
                  this.tableData[i].showreelList=res.data.data.list;
                  this.tableData[i].showreel_count=res.data.data.list.length;
                  break;
                }
              }
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        //新建/编辑作品集文件夹
        editPhotosShow(id,name){
          if(name!=undefined&&name!=null){
            this.photoform.name=name;
            this.photoform.id=this.openid;
          }else{
            this.photoform.id='';
            this.photoform.name='';
          }
          this.photoform.bid=id;
          this.dialogFormVisible=true;
        },
        //新建/编辑作品集文件夹确认按钮
        editPhotosComfirm(){
          if(this.photoform.name==''){
            this.$message.error('请输入名称！')
          }else{
            this.photoform.buid=this.curuid;
            this.api.request({
              url:this.api.goods_showreel_store,
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data:qs.stringify(this.photoform)
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type:'success',
                  message:'保存成功！'
                });
                this.showreel_list_data(this.photoform.bid);
                this.openid='';
                this.dialogFormVisible=false;
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }
        },
        //删除作品集文件夹
        delphotos(bid,id){
          this.$confirm('此操作将永久删除该作品集, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var smData={};
            smData.buid=this.curuid;
            smData.id=id;
            this.api.request({
              url:this.api.del_showreel,
              params:smData
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.showreel_list_data(bid);
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          }).catch();
        },

        //去作品集详情
        goDetail(id,name){
          this.$router.push({path: '/mall/photoDetail/' + id,query:{name:name,expand:JSON.stringify(this.expands)}})
        },
        //打开子菜单
        openmenu(id){
          this.openid=id;
        },
        //关闭子菜单
        closemenu(){
          this.openid='';
        },

      }
    }
</script>

<style lang="less">
#workPhotos{
 .alignCenter{
   text-align: center;
 }

  .photos{
    padding:5px;
    width:134px;
    display: inline-block;
    margin-right:10px;
    position: relative;
    margin-bottom: 10px;
    vertical-align: top;
    &:hover{
      .downmenue{
        display: block;
      }
      .downmenue-child{
        display: block;
      }
    }
    .downmenue{
      position: absolute;
      z-index: 50;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #D6D6D6;
      box-shadow: 0 0 2px rgba(0,0,0,.15);
      text-align: center;
      line-height: 20px;
      top: 6px;
      right: 6px;
      display: none;
    }
    .downmenue-child{
      position: absolute;
      top: 28px;
      right: 7px;
      width: 120px;
      background: #fff;
      z-index: 49;
      border-radius: 4px 0 4px 4px;
      border: 1px solid #D6D6D6;
      box-shadow: 0 0 2px rgba(0,0,0,.15);
      display: none;
      &:hover{
        display: block;
      }
      ul,ul li{
        list-style: none;
      }
      li{
        color: #262626;
        display: block;
        height: 18px;
        line-height: 18px;
        padding: 8px 0 8px 12px;
        cursor:pointer;
        &:hover{
          background: #F2F6FC;
        }
        i{
          margin-right: 10px;
        }
      }
    }
    .addphotos{
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
      height: 194px;
      cursor: pointer;
      line-height: 194px;
      vertical-align: top;
      text-align: center;
      font-size: 24px;
    }
    .el-card__body{
      padding:0px;
    }
    .imgbox{
      width:122px;
      height:162px;
      position:relative;
      img{
        width:122px;
        height: 162px;
      }
      .pic-num{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 115px;
        height: 50px;
        color: #fff;
        text-align: right;
        line-height: 62px;
        font-size: 32px;
        padding-right: 5px;
        background-image: linear-gradient(rgba(255,255,255,0),rgba(26,26,26,.4));
      }

    }
    .album-ft{
      padding: 10px 0 3px;
      .title{
        width:100%;
        height:21px;
        line-height: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        i.icon{
          position: absolute;
          top: 2px;
          left: 2px;
          display: inline-block;
          font-size: 0;
          width: 16px;
          height: 16px;
          background-repeat: no-repeat;
          font-style: normal;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
