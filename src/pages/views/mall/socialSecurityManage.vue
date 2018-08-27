<template>
  <div id="socialSecurityManage">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="服务名称" prop="work_name" >
            <el-input v-model="ruleForm.work_name" class="per60" maxlength="100"></el-input>{{ruleForm.work_name.length}}/100
          </el-form-item>
          <el-form-item id="goods_imgs"  label="展示封面" prop="goods_imgs"   :rules="[{required: true, message: '请上传商品图'}]" >
            <el-row>
              <draggable class="list-group" element="ul" v-model="ruleForm.goods_imgs"  :move="onMove" @start="isDragging=true" @end="moveEnd">
                <transition-group type="transition" :name="'flip-list'">
                  <el-upload v-for="(element,index) in ruleForm.goods_imgs" :key="'element'+index"
                             class="avatar-uploader"
                             accept="image/jpeg,image/jpg,image/png"
                             :action="uploadOptions.url"
                             :data="uploadOptions.data"
                             name="headpic[]"
                             :show-file-list="false"
                             :before-upload="handlePictureCardbefore"
                             :on-success="handlePictureCardSuccess">
                    <template v-if="element.url!=''&&element.url!=undefined">
                      <img  :src="element.url" class="avatar" @click="UploadIndex(index)">
                    </template>
                    <i v-else class="el-icon-plus avatar-uploader-icon" @click="UploadIndex(index)"></i>
                    <span class="avatar-del" @click="handlePictureCardRemove">
                    <span class="delitem">
                      <i class="el-icon-delete" :id="'del'+index"></i>
                    </span>
                  </span>
                  </el-upload>
                </transition-group>
              </draggable>
              <el-upload  v-if="ruleForm.goods_imgs.length<5"
                          class="avatar-uploader"
                          accept="image/jpeg,image/jpg,image/png"
                          :action="uploadOptions.url"
                          :data="uploadOptions.data"
                          name="headpic[]"
                          :show-file-list="false"
                          :before-upload="handlePictureCardbefore"
                          :on-success="handlePictureCardSuccess">
                <i class="el-icon-plus avatar-uploader-icon" @click="UploadIndex(ruleForm.goods_imgs.length)"></i>
              </el-upload>
              <div>2MB以内的JPG/PNG图片，建议尺寸 640 x 640 像素，最多5张,可以拖动进行排序。</div>
            </el-row>
          </el-form-item>
          <el-form-item label="服务介绍" prop="desc">
            <UE :defaultMsg='ruleForm.desc' :config="config"  ref="ue" id="ue"></UE>
          </el-form-item>
        </el-form>
        <div class="ruleFormSubmit"><el-button type="primary" @click="onSubmit">保存</el-button></div>
      </el-tab-pane>
      <el-tab-pane label="开通城市" name="second">
        <div class="box-card else">
          <el-button @click="addCity">+ 增加城市</el-button>
        </div>
        <el-card class="box-card" v-for="(item,index) in cityList" :key="item.id">
          <div style="cursor:pointer"  @click="goCityDetail(item.id)">
            <div slot="header" class="clearfix">
              <el-button type="text" class="title">{{item.city}}</el-button>
              <span style="float: right; padding: 3px 0">总服务费：<span class="active">{{parseInt(item.month_service_charge+item.reserve_service_charge)}}</span>元/月</span>
            </div>
            <div class="text item">代理佣金比例：</div>
            <div class="text item">直接销售者：{{item.sell_earning}}%</div>
            <div class="text item">直接销售者上一级：{{item.parent_earning}}%</div>
            <div class="text item">直接销售者上二级：{{item.grandpa_earning}}%</div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="cityForm.id==''?'增加城市':'编辑城市'" :visible.sync="dialogFormVisible"  :top="screeHeight<=800?(screeHeight-630)/2+'px':'15vh'">
      <el-form :model="cityForm"  :inline-message="true" style="height:400px; overflow-y: auto"  ref="cityForm"  class="demo-dynamic">
        <el-form-item label="城市名称" prop="city" :rules="[{ required: true, message: '请输入城市名称', trigger: 'blur'}]">
          <el-input  v-model="cityForm.city" class="w200" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="社保设置" required="" >
        </el-form-item>
        <table class="el-table el-table--border m-b-20" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <th class="is-leaf" width="50"><div class="cell"> 操作</div></th>
            <th class="is-leaf" width="120"><div class="cell">险种</div></th>
            <th class="is-leaf" width="120"><div class="cell">缴费基数</div></th>
            <th class="is-leaf" width="120"><div class="cell">费率</div></th>
            <th class="is-leaf" width="120"><div class="cell">费用</div></th>
            <th class="is-leaf" width="120"><div class="cell">总计费用</div></th>
          </tr>
          <tr v-for="(item, index) in cityForm.social_security_setting" :key="item.key">
            <td>
              <div class="cell">
              <el-button type="text" v-if="cityForm.social_security_setting.length>1" @click.native.prevent="socialDel(index)">删除</el-button>
              </div>
            </td>
            <td>
              <div class="cell">
              <el-form-item :prop="'social_security_setting.'+index+'.assurance_type'" :rules="[{ required: true, message: '请输入险种', trigger: 'blur'}]" >
                <el-input size="mini" v-model="item.assurance_type" maxlength="30"></el-input>
              </el-form-item>
              </div>
            </td>
            <td>
              <div class="cell">
              <el-form-item :prop="'social_security_setting.'+index+'.cardinal_number'" :rules="[{ required: true, message: '请输入基数', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
                ￥<el-input size="mini" type="number" :min="0" v-model="item.cardinal_number" ></el-input>
              </el-form-item>
              </div>
            </td>
            <td>
              <div class="cell">
              <el-form-item :prop="'social_security_setting.'+index+'.rate'" :rules="[{ required: true, message: '请输入费率', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
                <el-input size="mini" type="number" :min="0" v-model="item.rate"></el-input>%
              </el-form-item>
              </div>
            </td>
            <td>
              <div class="cell">
              <p v-if="item.cardinal_number!=''&&item.rate!=''">
                {{Math.round(item.cardinal_number * item.rate / 100 * 100) / 100}}
              </p>
              <p v-else>自动计算</p>
              </div>
            </td>
            <td v-if="index==0" :rowspan="cityForm.social_security_setting.length">
              <div class="cell">
                {{totalCardinal}}
              </div>
            </td>
          </tr>
          <tr>
            <td  colspan="6"><div class="center"><el-button type="text" @click="addTypesInsurance">+ 添加险种</el-button></div></td>
          </tr>
        </table>

        <div>公积金设置</div>
        <table class="el-table el-table--border m-b-20" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <th class="is-leaf" width="50"><div class="cell"> 操作</div></th>
            <th class="is-leaf" width="120"><div class="cell">缴费基数</div></th>
            <th class="is-leaf" width="120"><div class="cell">费率</div></th>
            <th class="is-leaf" width="120"><div class="cell">总计费用</div></th>
          </tr>
          <tr v-for="(item,index) in cityForm.accumulation_fund_setting" :key="item.id">
            <td>
              <div class="cell">
                <el-button type="text"  @click.native.prevent="accumulationDel(index)">删除</el-button>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-form-item :prop="'accumulation_fund_setting.'+index+'.cardinal_number'" :rules="[{ required: true, message: '请输入基数', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
                  ￥<el-input size="mini" type="number" :min="0" v-model="item.cardinal_number"></el-input>
                </el-form-item>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-form-item :prop="'accumulation_fund_setting.'+index+'.rate'" :rules="[{ required: true, message: '请输入费率', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
                  <el-input size="mini" type="number" :min="0" v-model="item.rate"></el-input>%
                </el-form-item>
              </div>
            </td>
            <td>
                <div class="cell"  v-if="item.cardinal_number!=''&&item.rate!=''">
                    {{Math.round(item.cardinal_number*item.rate/100/2)*2}}
                </div>
            </td>
          </tr>
          <tr>
            <td  colspan="4"><div class="center"><el-button type="text" @click="addAccumulation">+ 添加基数</el-button></div></td>
          </tr>
        </table>

        <div>服务费设置</div>
        <el-form-item label="社保" prop="month_service_charge" :rules="[{ required: true, message: '请输入社保服务费', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
          ￥<el-input  class="w200" type="number"  :min="0" v-model="cityForm.month_service_charge" size="small"></el-input>/月
        </el-form-item>
        <el-form-item label="公积金" type="number"  v-if="cityForm.accumulation_fund_setting.length>0" prop="reserve_service_charge" :rules="[{ required: true, message: '请输入公积金服务费', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
          ￥<el-input  class="w200" type="number" :min="0" size="small" v-model="cityForm.reserve_service_charge"></el-input>/月
        </el-form-item>
        <div>代理佣金设置</div>
        <el-form-item label="直接销售者："  prop="sell_earning" :rules="[{ required: true, message: '请输入服务费', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
          <label>订单总服务费</label>
          <el-input class="w200" type="number" :min="0" v-model="cityForm.sell_earning"></el-input>%
        </el-form-item>
        <el-form-item label="直接销售者上一级："  prop="parent_earning" :rules="[{ required: true, message: '请输入服务费', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
          <label>订单总服务费</label>
          <el-input class="w200" type="number" :min="0" v-model="cityForm.parent_earning"></el-input>%
        </el-form-item>
        <el-form-item label="直接销售者上二级：" prop="grandpa_earning" :rules="[{ required: true, message: '请输入服务费', trigger: 'blur'},{validator:validateValue,trigger:'blur'}]">
          <label>订单总服务费</label>
          <el-input class="w200" type="number" :min="0" v-model="cityForm.grandpa_earning"></el-input>%
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="delCity(cityForm.id)" v-if="cityForm.id!=''">删除城市</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCity('cityForm')">保 存</el-button>
      </div>
    </el-dialog>
    <cutPictur @comfirm="pictureCardSuccess" ref="cutPicture"></cutPictur>
  </div>
</template>
<script>
  import UE from '../../../components/ue.vue';
  import cutPictur from '../../../components/cutPicture.vue';
  import draggable from 'vuedraggable';
  import qs from 'qs';
    export default{
      components: {
        UE,
        draggable,
        cutPictur
      },
        data: function () {
          var _that=this;
          var descNull=(rule, value, callback)=>{
              var str=this.$refs['ue'].getUEContent();
            if(str=='<p><br></p>'||str==''||str==undefined){
              callback(new Error('填写服务介绍'))
            }else{
              callback()
            }
          };
            return {

              curuid:sessionStorage.getItem('curuid'),
              isDragging:'',
              config: {
                toolbars:[['Source','Bold','italic', 'underline',  'forecolor','fontfamily', 'fontsize', 'justifyleft','justifycenter', 'justifyright', 'simpleupload' ]],
                enableAutoSave: false,
                enableContextMenu: false,
                elementPathEnabled: false,
                wordCountMsg: '{#count} / 10000',
                wordOverFlowMsg: '请不要超过10000个字符',
                autoHeightEnabled: true,
                scaleEnabled: false,
                zIndex: 1,
                autoFloatEnabled: true,
                initialFrameWidth : 640,
                initialFrameHeight: 500,
              },
              activeName:'first',
              screeHeight:window.innerHeight,
              ruleForm:{
                bid:'',
                work_name:'',
                goods_imgs:[],
                desc:''
              },
              rules:{
                work_name:[{required: true, message: '请输入服务名称', trigger: 'blur'}],
                goods_imgs:[{required: true, message: '请上传封面'}],
                desc:[{required: true, message: '请输入服务介绍', trigger: 'blur',validator: descNull}]
              },
              cityForm:{
                id:'',
                city:'',
                sell_earning:'',
                parent_earning:'',
                grandpa_earning:'',
                month_service_charge:'',
                reserve_service_charge:'',
                social_security_setting:[
                  {
                    id:'',
                    rate:'',
                    cardinal_number:'',
                    assurance_type:''
                  }
                ],
                accumulation_fund_setting:[],
              },
              currentUploadIndex:'',
              dialogFormVisible:false,
              uploadOptions:{
                url:this.api.upload_img,
                data:{
                  path_code:'16',
                  data_type:'html'
                }
              },
              cityList:[]
            }
        },
      created(){
      },
      computed:{
        totalCardinal(){
          var str=0;
          this.cityForm.social_security_setting.forEach(item=>{
            str=str+parseFloat(Math.round(item.cardinal_number * item.rate / 100 * 100) / 100);
          });
          return str.toFixed(2);
        }
      },
      mounted() {
        this.getsocialDetail();
      },
        methods: {

          //图片拖动排序调整
          onMove ({relatedContext, draggedContext}) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
          },
          //图片拖动排序结束
          moveEnd(){
            this.isDragging=false;
          },
          UploadIndex(index){
            this.currentUploadIndex=index;
          },
          //大于0验证
          validateValue(rule,value,callback){
            if(parseInt(value)<0){
              callback(new Error('必须大于等于0'))
            }else{
              callback()
            }
          },
        //获取社保服务管理详情
          getsocialDetail(){
            this.api.request({
              url:this.api.social_security_getDetail,
              params:{
                buid:this.curuid
              }
            }).then(res=>{
              if(res.data.state.code==10200){
                if(res.data.data.bid){
                  this.ruleForm.desc=res.data.data.desc;
                  this.ruleForm.work_name=res.data.data.work_name;
                  res.data.data.goods_imgs.forEach(item=>{
                    var obj={
                      url:item
                    }
                    this.ruleForm.goods_imgs.push(obj);
                  });
                  this.ruleForm.bid=res.data.data.bid;
                  this.$refs['ue'].setUEContent(this.ruleForm.desc);
                }
              }else{
                this.$message.error(res.data.state.msg);
              }
            });
          },
          //社保服务管理详情保存
          onSubmit(){
            var goodImgs=[];
            this.ruleForm.goods_imgs.forEach(item=>{
              if(item.response){
                goodImgs.push(this.api.photo_Server+item.response.data);
              }else{
                goodImgs.push(item.url)
              }
            });
            this.$refs['ruleForm'].validate((valid)=>{
              if(valid){
                var smData={
                    work_name:this.ruleForm.work_name,
                    goods_imgs:goodImgs,
                    desc:this.$refs['ue'].getUEContent(),
                    sell:0,
                    bid:this.ruleForm.bid,
                    buid:this.curuid
                }
                this.api.request({
                  url:this.api.social_security_store,
                  method:'post',
                  headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                  data:qs.stringify(smData)
                }).then((res)=>{
                  if(res.data.state.code==10200){
                    this.$message({
                      message:'保存成功',
                      type:'success'
                    });
                  }else{
                    this.$message.error(res.data.state.msg);
                  }

                })
              }
            });
          },
          //选项卡切换触发事件
          handleClick(){
            if(this.activeName=='first'){
              this.ruleForm.goods_imgs=[];
              this.getsocialDetail();
            }else if(this.activeName=='second'){
              this.getCityList();
            }
          },
          //获取开通城市列表
          getCityList(){
            this.api.request({
              url:this.api.city_list_data,
              params:{
                buid:this.curuid
              }
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.cityList=res.data.data;
              }else{
                this.$message.error(res.data.state.msg);
              }

            });
          },

          //上传图片前触发函数
          handlePictureCardbefore(file){
            if(file.size/1024/1024>2){
              this.$message.error("上传图片不能大于2M");
              return false;
            }
            if(file.type=='image/jpeg'){
              this.$refs['cutPicture'].open(file);
              return false;
            }else if(file.type=='image/png') {
              this.$refs['cutPicture'].open(file);
              return false;
            }else  if(file.type=='image/jpg'){
              this.$refs['cutPicture'].open(file);
              return false;
            }else{
              this.$message.error("请上传图片");
              return false;
            }
          },
          //切图上传成功角发函数
          pictureCardSuccess(res){
            if(this.currentUploadIndex==this.ruleForm.goods_imgs.length){
              this.ruleForm.goods_imgs.push({
                url:this.api.photo_Server+res.data
              })
            }else{
              this.ruleForm.goods_imgs[this.currentUploadIndex].url=this.api.photo_Server+res.data;
            }
            if(this.ruleForm.goods_imgs.length>0){
              if(document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error').length>0){
                document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error')[0].remove();
              }
            }
          },
          //上传图片墙成功函数
          //商品图片上传成功时触发的函数
          handlePictureCardSuccess(response, file, fileList){
            if(this.currentUploadIndex==this.ruleForm.goods_imgs.length){
              this.ruleForm.goods_imgs.push({
                url:this.api.photo_Server+response.data
              })
            }else{
              this.ruleForm.goods_imgs[this.currentUploadIndex].url=this.api.photo_Server+response.data;
            }
            if(this.ruleForm.goods_imgs.length>0){
              if(document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error').length>0){
                document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error')[0].remove();
              }
            }
          },


        //商品图片文件列表移除时触发事件
          handlePictureCardRemove(e){
            e.stopPropagation();
            var index=parseInt(e.target.id.replace('del',''));
            this.ruleForm.goods_imgs.splice(index,1);
          },
          //点击新增城市
          addCity(){
            this.cityForm={
              id:'',
              city:'',
              sell_earning:'',
              parent_earning:'',
              grandpa_earning:'',
              month_service_charge:'',
              reserve_service_charge:'',
              social_security_setting:[
                {
                  id:'',
                  rate:'',
                  cardinal_number:'',
                  assurance_type:''
                }
              ],
              accumulation_fund_setting:[],
            };
            if(this.$refs['cityForm']){
              this.$refs['cityForm'].clearValidate();
            }
            this.dialogFormVisible  = true;
          },


          //获取单个城市社保详情
          goCityDetail(id){
            if(this.$refs['cityForm']){
              this.$refs['cityForm'].clearValidate();
            }
            this.api.request({
              url:this.api.get_city_seeting,
              params:{
                id:id,
                buid:this.curuid
              }
            }).then((res)=>{
              if(res.data.state.code==10200){
                this.cityForm={
                  id:res.data.data.id,
                  city:res.data.data.city,
                  sell_earning:res.data.data.sell_earning==0?'0':res.data.data.sell_earning,
                  parent_earning:res.data.data.parent_earning==0?'0':res.data.data.parent_earning,
                  grandpa_earning:res.data.data.grandpa_earning==0?'0':res.data.data.grandpa_earning,
                  month_service_charge:res.data.data.month_service_charge==0?'0':res.data.data.month_service_charge,
                  reserve_service_charge:res.data.data.reserve_service_charge==0?'0':res.data.data.reserve_service_charge,
                  social_security_setting:res.data.data.social_security_setting,
                  accumulation_fund_setting:res.data.data.accumulation_fund_setting,
                };
                this.dialogFormVisible=true;

              }else{
                this.$message.error(res.data.state.msg);
              }

            })
          },
          //删除单个社保城市
          delCity(id){
            this.$confirm('此操作将永久删除该城市, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var smData={
                id:id,
                buid:this.curuid
              }
              this.api.request({
                url:this.api.socialDel_setting,
                method:'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                data:qs.stringify(smData)
              }).then((res)=>{
                if(res.data.state.code==10200){
                  this.dialogFormVisible = false;
                  this.getCityList();
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


          //添加险种
          addTypesInsurance(){
            var obj={
              id:'',
              rate:'',
              cardinal_number:'',
              assurance_type:''
            };
            this.cityForm.social_security_setting.push(obj);
          },

          //添加基数
          addAccumulation(){
              var obj={
                assurance_type:'公积金',
                cardinal_number:'',
                rate:'',
                id:''
              }
              this.cityForm.accumulation_fund_setting.push(obj);
          },
          //删除险种
          socialDel(index){
            this.$confirm('此操作将永久删除该险种, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.cityForm.social_security_setting.splice(index, 1);
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch();
          },


          //删除公积金基数
          accumulationDel(index){
            this.$confirm('此操作将永久删除该公积金基数, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.cityForm.accumulation_fund_setting.splice(index, 1);
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch();
          },

          //编辑/新增城市
          submitCity(formName){
            this.$refs[formName].validate((valid) => {
              if(valid){
                var smData=JSON.parse(JSON.stringify(this.cityForm));
                smData.buid=this.curuid;
                this.api.request({
                  url:this.api.socialSave_setting,
                  method:'post',
                  headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                  data:qs.stringify(smData)
                }).then((res)=>{
                  if(res.data.state.code==10200){
                    this.dialogFormVisible  = false;
                    this.getCityList();
                    this.$message({
                      type:'success',
                      message:'保存成功！'
                    });
                  }else{
                    this.$message.error(res.data.state.msg);
                  }
                });
              }
            });
          },
        }
    }
</script>
<style lang="less">
  #socialSecurityManage{
    color:#606266;
    padding-bottom:50px;
    font-size:13px;
    .alignCenter{
      text-align: center;
    }
    /*.questLine{
      margin-bottom:20px;
    }*/
    .colorGrey{
      color:#999;
    }
    .list-group{
      display: inline-block;
    }
    .avatar-uploader .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      margin:0px;
      border:none;
      &:hover .avatar-del{
        opacity: 1;
      }
    }
    .avatar-uploader{
      vertical-align: top;
      overflow: hidden;
      background-color: #fff;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      margin: 0 8px 8px 0;
      display: inline-block;

    }
    .avatar-del{
      position: absolute;
      width: 34px;
      height: 34px;
      top: 0;
      right: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;

      font-size: 20px;
      background-color: rgba(0,0,0,.5);
      -webkit-transition: opacity .3s;
      transition: opacity .3s;
      .delitem{
        position: static;
        font-size: inherit;
        color: inherit;
        i.el-icon-delete{
          font-family: element-icons!important;
          speak: none;
          font-style: normal;
          font-weight: 400;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          vertical-align: baseline;
          display: inline-block;
          -webkit-font-smoothing: antialiased;
        }
        &::after{
          display: inline-block;
          content: "";
          height: 100%;
          vertical-align: middle;
        }
      }
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      line-height: 146px;
      vertical-align: top;
    }
    .avatar {
      width: 146px;
      height: 146px;
      display: block;
    }
    .per60{
      width:640px;
    }
    .el-card .active{
      color:#f60;
      line-height: 40px;
      font-weight:bold;
      font-size:14px;
    }
    .center{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .uploadHide{
      .el-upload--picture-card{
        display: none;
      }
    }
    .m-b-20{
      margin-bottom: 20px;
    }
    .box-card {
      width: 350px;
      display:inline-block;
      margin-right:20px;
      margin-bottom:20px;
      &.else{
        height: 203px;
        line-height: 203px;
        text-align: center;
        overflow:hidden;
      }
      .title{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 150px;
        display: inline-block;
        text-align: left;
      }
    }
    .el-dialog{
      .w200{
        width:200px;
      }
      td .el-input{
        width:80%;
      }
      td{
        .el-form-item__error--inline{
          position:absolute;
          display:block;
        }
        .el-form-item{
          margin-bottom: 0px;
        }
        .cell{
          overflow: visible;
        }
      }
    }
    #socialEditor2{
      background: #fff;
      min-height:300px;
      z-index:1000 !important;
    }
    .ruleFormSubmit{
      background-color: rgba(0, 0, 0, 0.4);
      height: 50px;
      line-height: 50px;
      position: fixed;
      left: 260px;
      right: 0;
      bottom: 0;
      text-align: center;
      z-index: 10000;
      margin:0px;
    }
  }

</style>
