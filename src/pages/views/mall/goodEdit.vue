<template>
  <div id="goodEdit">
    <el-form  ref="ruleFormt" label-width="150px" :model="form" class="demo-ruleForm">
      <el-form-item label="商品类型" prop="goods_type">
        <div v-if="form.bid==undefined">
          <el-radio-group v-model="form.goods_type" @change="goods_type_change">
            <el-radio-button label="1" v-if="permission.indexOf(3) <= -1&&hasReal">
              <p>实物商品</p>
              <p>(物流发货)</p>
            </el-radio-button>
            <el-radio-button label="2" v-if="hasfictitious">
              <p>虚拟商品</p>
              <p>(无须物流)</p>
            </el-radio-button>
            <el-radio-button label="3" v-if="hasConsultation">
              <p>在线咨询</p>
              <p>(无须物流)</p>
            </el-radio-button>
            <el-radio-button label="4" v-if="permission.indexOf(3) <= -1&&hasSubscribe">
              <p>在线预约</p>
              <p>(无须物流)</p>
            </el-radio-button>
            <el-radio-button label="17" v-if="permission.indexOf(3) <= -1&&hasService">
              <p>服务套餐</p>
              <p>(无须物流)</p>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div v-else>
          <el-radio-group v-model="form.goods_type">
            <el-radio-button label="1" v-if="permission.indexOf(3) <= -1&&form.goods_type=='1'&&hasReal">
              <p>实物商品</p>
              <p>(物流发货)</p>
            </el-radio-button>
            <el-radio-button label="2" v-if="form.goods_type=='2'&&hasfictitious">
              <p>虚拟商品</p>
              <p>(无须物流)</p>
            </el-radio-button>
            <el-radio-button label="3" v-if="form.goods_type==3&&hasConsultation">
              <p>在线咨询</p>
              <p>(无须物流)</p>
            </el-radio-button>
            <el-radio-button label="4" v-if="permission.indexOf(3) <= -1&&form.goods_type=='4'&&hasSubscribe">
              <p>在线预约</p>
              <p>(无须物流)</p>
            </el-radio-button>
            <el-radio-button label="17" v-if="permission.indexOf(3) <= -1&&form.goods_type=='17'&&hasService">
              <p>服务套餐</p>
              <p>(无须物流)</p>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="form.goods_type=='2'" class="form-group zent-title">*小程序专属——虚拟类商品，如线下课程培训服务，用户可在线购买并参与您的线下培训</div>
        <div v-if="form.goods_type=='3'" class="form-group zent-title">*小程序专属——您的产品无法定价时，可选择发布此类型商品，客户可在线咨询您</div>
        <div v-if="form.goods_type=='4'" class="form-group zent-title">*小程序专属——如美业服务，用户可在线预约，并按约定时间到店消费</div>
      </el-form-item>
    </el-form>
    <el-form  ref="ruleForm1" label-width="150px" :model="form" class="demo-ruleForm">
      <el-row v-if="form.goods_type==1">
        <el-form-item label="商品名称"  prop="work_name" :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur'},{max: 100, message: '长度100个字符', trigger: 'blur'}]">
          <el-input v-model="form.work_name" maxlength="100"  class="per60"></el-input><span>{{form.work_name.length}}/100</span>
        </el-form-item>
        <el-form-item id="goods_imgs"  label="商品图" prop="goods_imgs"   :rules="[{required: true, message: '请上传商品图'}]" >
          <el-row>
            <draggable class="list-group" element="ul" v-model="form.goods_imgs"  :move="onMove" @start="isDragging=true" @end="moveEnd">
              <transition-group type="transition" :name="'flip-list'">
                <el-upload v-for="(element,index) in form.goods_imgs" :key="'element'+index"
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
            <el-upload  v-if="form.goods_imgs.length<5"
                        class="avatar-uploader"
                        accept="image/jpeg,image/jpg,image/png"
                        :action="uploadOptions.url"
                        :data="uploadOptions.data"
                        name="headpic[]"
                        :show-file-list="false"
                        :before-upload="handlePictureCardbefore"
                        :on-success="handlePictureCardSuccess">
              <i class="el-icon-plus avatar-uploader-icon" @click="UploadIndex(form.goods_imgs.length)"></i>
            </el-upload>
            <div>2MB以内的JPG/PNG图片，建议尺寸 640 x 640 像素，最多5张,可以拖动进行排序。</div>
          </el-row>
        </el-form-item>
        <el-form-item label="商品规格" >
          <el-card class="box-card attr-item per60"  v-for="(attr,index) in form.attr_value_imgs" :key="'attr'+index" style="overflow:visible;">
            <div slot="header" class="clearfix2">
              <el-select v-model="attr.attr_id" placeholder="请选择" @change="attrChange(index)">
                <el-option label="请选择规格" value="0"></el-option>
                <el-option
                  v-for="(select,selectIndex) in selects"
                  :key="'select'+selectIndex"
                  :label="select.ga_name"
                  :value="select.gaid">
                </el-option>
              </el-select>
              <el-button type="info" icon="el-icon-delete" circle @click="attrDel(index)"></el-button>
            </div>
            <div class="attr-value-panel">
              <div class="attr-val-item" v-for="(subItem,subIndex) in attr.values" :key="'subItem'+subIndex" :class="index==0?'w180':''">
                <el-tag
                  closable
                  type="info"
                  class="width118"
                  :disable-transitions="false"
                  @close="handleClose(index,subItem)">
                  {{subItem.name}}
                </el-tag>
                <el-upload v-if="index==0"
                           :action="uploadOptions.url"
                           :data="uploadOptions.data"
                           name="headpic[]"
                           :show-file-list="false"
                           :before-upload="handlePictureCardbefore2"
                           :on-success="handlePictureSuccess"
                >
                  <img v-if="subItem.img" :src="subItem.img" class="avatar" @click="UploadIndex(subIndex)">
                  <i v-else class="el-icon-plus avatar-uploader-icon uploadBtn" @click="UploadIndex(subIndex)"></i>
                </el-upload>
              </div>
              <div class="attr-godds">
                <el-popover
                  placement="top"
                  width="160"
                  ref="popover"
                  trigger="click"
                  v-model="popover[index].value">
                  <p style="margin-bottom: 10px;">
                    <el-input v-model="addAttrName" maxlength="100"></el-input>
                  </p>
                  <div class="alignCenter">
                    <el-button size="mini"  @click="popover[index].value=false">取消</el-button>
                    <el-button type="primary" size="mini" @click="popoverComfirm(index)">确定</el-button>
                  </div>
                  <el-button v-if="form.attr_value_imgs[index].attr_id==0"  type="text" style="vertical-align: top" @click="addAttr1(index)">添加值</el-button>
                  <el-button v-else slot="reference"  type="text" style="vertical-align: top" @click="addAttr2(index)">添加值</el-button>
                </el-popover>
                <el-button slot="reference" v-if="form.attr_value_imgs[index].attr_id==0"  type="text" style="vertical-align: top" @click="addAttr1(index)">添加值</el-button>
              </div>
            </div>
          </el-card>
          <el-button type="primary" @click="attrAdd" v-if="form.attr_value_imgs.length<3">添加规格</el-button>
        </el-form-item>
        <el-form-item label="价格/库存" required="" >
        </el-form-item>
        <el-row class="rules per60">
          <table class="el-table el-table--border per60" cellspacing="0" cellpadding="0" border="0" >
            <tr>
              <template v-for="(item,index) in form.attr_value_imgs" v-if="form.attr_value_imgs.length>0">
                <th class="is-leaf" v-if="item.values.length>0"><div class="cell"> {{item.attr_name}}</div></th>
              </template>
              <th class="is-leaf"><div class="cell">零售价（元）<span class="need">*</span></div></th>
              <th class="is-leaf"><div class="cell">原价（元） <span class="need">*</span></div></th>
              <th class="is-leaf"><div class="cell">库存（件）<span class="need">*</span></div></th>
            </tr>
            <tr v-if="form.skus.length>1">
              <td class="alignCenter" :colspan="form.skus[0].attrs.length">批量设置：</td>
              <td class="alignCenter">
                <el-input size="mini" type="text" v-model="setPriceValue" @blur="priceBlur"></el-input>
              </td>
              <td class="alignCenter">
                <el-select v-model="priceType" placeholder="请选择" size="mini" style="margin-bottom: 10px;" @change="originalPriceChange">
                  <el-option label="设置数字" value="设置数字"></el-option>
                  <el-option label="零售价上加百分比" value="零售价上加百分比"></el-option>
                  <el-option label="零售价上加数字" value="零售价上加数字"></el-option>
                </el-select>
                <div v-if="priceType=='设置数字'">
                  <el-input size="mini" type="number" v-model="originalPrice" @blur="setRriginalPrice"></el-input>
                </div>
                <div v-if="priceType=='零售价上加百分比'">
                  <span>加</span><el-input size="mini" type="number" @blur="setRriginalPrice" v-model="originalPrice">
                </el-input><span>%</span>
                </div>
                <div v-if="priceType=='零售价上加数字'">
                  <span>加</span><el-input size="mini" type="number" @blur="setRriginalPrice" v-model="originalPrice">
                </el-input>
                </div>
              </td>
              <td class="alignCenter">
                <el-input size="mini" v-model="stockValue" @blur="setStock"></el-input>
              </td>
            </tr>
            <tr v-for="(item, index) in form.skus" :key="'item'+index">
              <template v-for="(subItem,subIndex) in item.attrs" v-if="item.attrs.length>0">
                <td class="textCenter" :rowspan="subItem.rowspan" v-if="subItem.rowspan != null">{{subItem.value}}</td>
              </template>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.price'" :rules="[{ required: true, message: '请输入价格', trigger: 'change'},{validator: validateNumber, required:true, trigger: 'blur'}]" label-width="0px">
                  <el-input  size="mini" :min="0" type="number" v-model="item.price"></el-input>
                </el-form-item>
              </td>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.original_price'" :rules="[{ required: true, message: '请输入价格', trigger: 'change'},{validator: validateNumber, required:true, trigger: 'blur'}]" label-width="0px">
                <el-input  size="mini" :min="0" type="number" v-model="item.original_price"></el-input>
                </el-form-item>
              </td>
              <td class="textCenter">
                <p>
                  <el-form-item :prop="'skus.'+index+'.stock'" :rules="[{ required: true, message: '请输入库存', trigger: 'change'}]" label-width="0px">
                    <el-input  size="mini" type="number" :min="0" v-model="item.stock"></el-input>
                  </el-form-item>
                </p>
              </td>
            </tr>
          </table>
          <div>注：原价作为参考价，主要是配合平台开展相关活动，非必填。</div>
        </el-row>
        <el-form-item label="运费" required="">
          <el-radio v-model="form.shipping_type" label="0">统一运费</el-radio>
          ￥<el-input
          placeholder="请输入内容"
          type="number"
          :min="0"
          v-model="form.shipping"
          class="width200">
        </el-input>
        </el-form-item>
        <el-form-item label="直接销售者" v-if="permission.indexOf(2) >=0">
          <div class="form-content">
            商品价格&nbsp;&nbsp;<span>&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;</span><el-input style="width:200px;" type="number" v-model="form.sell_earning"></el-input>%
          </div>
        </el-form-item>
        <el-form-item label="直接销售者上一级" v-if="permission.indexOf(2) >=0">
          <div class="form-content">
            商品价格&nbsp;&nbsp;<span>&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;</span><el-input style="width:200px;" type="number" v-model="form.parent_earning"></el-input>%
          </div>
        </el-form-item>
        <el-form-item label="直接销售者上二级" v-if="permission.indexOf(2) >=0">
          <div class="form-content">
            商品价格&nbsp;&nbsp;<span>&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;</span><el-input style="width:200px;" type="number" v-model="form.grandpa_earning"></el-input>%
          </div>
        </el-form-item>
      </el-row>

    </el-form>
    <el-form v-if="form.goods_type==1" ref="refundSetForm" label-width="150px" :model="refundSetForm">
      <el-form-item label="退款设置">
        <span style="color:#409EFF;">用户退货时，需要将商品寄回以下地址，地址信息可在店铺设置中修改</span>
      </el-form-item>
      <el-form-item label="收货人" prop="refund_person" :rules="[{ required: true, message: '请输入收货人', trigger: 'blur'}]">
        <el-input class="per60" v-model="refundSetForm.refund_person"></el-input>
      </el-form-item>
      <el-form-item label="沟通电话" prop="refund_phone" :rules="[{ required: true, message: '沟通电话不能为空', trigger: 'blur'},{validator: validatephone, trigger: 'blur'}]">
        <el-input class="per60" v-model="refundSetForm.refund_phone"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" required="">
        <p>
          <el-cascader
            expand-trigger="hover"
            placeholder="请选择所在地区"
            :options="region"
            v-model="refundSetForm.refund_region"
            :props="propData"
          >
          </el-cascader>
        </p>
      </el-form-item>
      <el-form-item label="详细地址" prop="refund_address" :rules="[{ required: true, message: '请输入详细地址', trigger: 'blur'}]">
        <p><el-input class="per60" v-model="refundSetForm.refund_address"></el-input></p>
      </el-form-item>
    </el-form>
    <el-form  ref="ruleForm2"   label-width="150px" :model="form" class="demo-ruleForm">
      <el-row  v-if="form.goods_type==2">
        <el-form-item label="商品名称"  prop="work_name" :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur'},{max: 100, message: '长度100个字符', trigger: 'blur'}]">
          <el-input v-model="form.work_name" maxlength="100"  class="per60"></el-input><span>{{form.work_name.length}}/100</span>
        </el-form-item>
        <el-form-item id="goods_imgs"  label="商品图" prop="goods_imgs"   :rules="[{required: true, message: '请上传商品图'}]" >
          <el-row>
            <draggable class="list-group" element="ul" v-model="form.goods_imgs"  :move="onMove" @start="isDragging=true" @end="moveEnd">
              <transition-group type="transition" :name="'flip-list'">
                <el-upload v-for="(element,index) in form.goods_imgs" :key="'element'+index"
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
            <el-upload  v-if="form.goods_imgs.length<5"
                        class="avatar-uploader"
                        accept="image/jpeg,image/jpg,image/png"
                        :action="uploadOptions.url"
                        :data="uploadOptions.data"
                        name="headpic[]"
                        :show-file-list="false"
                        :before-upload="handlePictureCardbefore"
                        :on-success="handlePictureCardSuccess">
              <i class="el-icon-plus avatar-uploader-icon" @click="UploadIndex(form.goods_imgs.length)"></i>
            </el-upload>
            <div>2MB以内的JPG/PNG图片，建议尺寸 640 x 640 像素，最多5张,可以拖动进行排序。</div>
          </el-row>
        </el-form-item>
        <el-form-item label="商品规格" >
          <el-card class="box-card attr-item per60"  v-for="(attr,index) in form.attr_value_imgs" :key="'attr'+index" style="overflow:visible;">
            <div slot="header" class="clearfix2">
              <el-select v-model="attr.attr_id" placeholder="请选择" @change="attrChange(index)">
                <el-option label="请选择规格" value="0"></el-option>
                <el-option
                  v-for="(select,selectIndex) in selects"
                  :key="'select'+selectIndex"
                  :label="select.ga_name"
                  :value="select.gaid">
                </el-option>
              </el-select>
              <el-button type="info" icon="el-icon-delete" circle @click="attrDel(index)"></el-button>
            </div>
            <div class="attr-value-panel">
              <div class="attr-val-item" v-for="(subItem,subIndex) in attr.values" :key="'subItem'+subIndex" :class="index==0?'w180':''">
                <el-tag
                  closable
                  type="info"
                  class="width118"
                  :disable-transitions="false"
                  @close="handleClose(index,subItem)">
                  {{subItem.name}}
                </el-tag>
                <el-upload v-if="index==0"
                           :action="uploadOptions.url"
                           :data="uploadOptions.data"
                           name="headpic[]"
                           :show-file-list="false"
                           :before-upload="handlePictureCardbefore2"
                           :on-success="handlePictureSuccess"
                >
                  <img v-if="subItem.img" :src="subItem.img" class="avatar" @click="UploadIndex(subIndex)">
                  <i v-else class="el-icon-plus avatar-uploader-icon uploadBtn" @click="UploadIndex(subIndex)"></i>
                </el-upload>
              </div>
              <div class="attr-godds">
                <el-popover
                  placement="top"
                  width="160"
                  ref="popover"
                  trigger="click"
                  v-model="popover[index].value">
                  <p style="margin-bottom: 10px;">
                    <el-input v-model="addAttrName" maxlength="100"></el-input>
                  </p>
                  <div class="alignCenter">
                    <el-button size="mini"  @click="popover[index].value=false">取消</el-button>
                    <el-button type="primary" size="mini" @click="popoverComfirm(index)">确定</el-button>
                  </div>
                  <el-button v-if="form.attr_value_imgs[index].attr_id==0"  type="text" style="vertical-align: top" @click="addAttr1(index)">添加值</el-button>
                  <el-button v-else slot="reference"  type="text" style="vertical-align: top" @click="addAttr2(index)">添加值</el-button>
                </el-popover>
                <el-button slot="reference" v-if="form.attr_value_imgs[index].attr_id==0"  type="text" style="vertical-align: top" @click="addAttr1(index)">添加值</el-button>
              </div>
            </div>
          </el-card>
          <el-button type="primary" @click="attrAdd" v-if="form.attr_value_imgs.length<3">添加规格</el-button>
        </el-form-item>
        <el-form-item label="价格/库存" required="" >
        </el-form-item>
        <el-row class="rules per60">
          <table class="el-table el-table--border per60" cellspacing="0" cellpadding="0" border="0" >
            <tr>
              <template v-for="(item,index) in form.attr_value_imgs" v-if="form.attr_value_imgs.length>0">
                <th class="is-leaf" v-if="item.values.length>0"><div class="cell"> {{item.attr_name}}</div></th>
              </template>
              <th class="is-leaf"><div class="cell">零售价（元）<span class="need">*</span></div></th>
              <th class="is-leaf"><div class="cell">原价</div></th>
              <th class="is-leaf"><div class="cell">库存（件）<span class="need">*</span></div></th>
            </tr>
            <tr v-if="form.skus.length>1">
              <td class="alignCenter" :colspan="form.skus[0].attrs.length">批量设置：</td>
              <td class="alignCenter">
                <el-input size="mini" type="text" v-model="setPriceValue" @blur="priceBlur"></el-input>
              </td>
              <td class="alignCenter">
                <el-select v-model="priceType" placeholder="请选择" size="mini" style="margin-bottom: 10px;" @change="originalPriceChange">
                  <el-option label="设置数字" value="设置数字"></el-option>
                  <el-option label="零售价上加百分比" value="零售价上加百分比"></el-option>
                  <el-option label="零售价上加数字" value="零售价上加数字"></el-option>
                </el-select>
                <div v-if="priceType=='设置数字'">
                  <el-input size="mini" type="number" v-model="originalPrice" @blur="setRriginalPrice"></el-input>
                </div>
                <div v-if="priceType=='零售价上加百分比'">
                  <span>加</span><el-input size="mini" type="number" @blur="setRriginalPrice" v-model="originalPrice">
                </el-input><span>%</span>
                </div>
                <div v-if="priceType=='零售价上加数字'">
                  <span>加</span><el-input size="mini" type="number" @blur="setRriginalPrice" v-model="originalPrice">
                </el-input>
                </div>
              </td>
              <td class="alignCenter">
                <el-input size="mini" v-model="stockValue" @blur="setStock"></el-input>
              </td>
            </tr>
            <tr v-for="(item, index) in form.skus" :key="'item'+index">
              <template v-for="(subItem,subIndex) in item.attrs" v-if="item.attrs.length>0">
                <td class="textCenter" :rowspan="subItem.rowspan" v-if="subItem.rowspan != null">{{subItem.value}}</td>
              </template>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.price'" :rules="[{ required: true, message: '请输入价格', trigger: 'change'},{validator: validateNumber, required:true, trigger: 'blur'}]" label-width="0px">
                  <el-input  size="mini" :min="0" type="number" v-model="item.price"></el-input>
                </el-form-item>
              </td>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.original_price'" :rules="[{ required: true, message: '请输入价格', trigger: 'change'},{validator: validateNumber, required:true, trigger: 'blur'}]" label-width="0px">
                <el-input  size="mini" :min="0" type="number" v-model="item.original_price"></el-input>
                </el-form-item>
              </td>
              <td class="textCenter">
                <p>
                  <el-form-item :prop="'skus.'+index+'.stock'" :rules="[{ required: true, message: '请输入库存', trigger: 'change'}]" label-width="0px">
                    <el-input  size="mini" type="number" :min="0" v-model="item.stock"></el-input>
                  </el-form-item>
                </p>
              </td>
            </tr>
          </table>
          <div>注：原价作为参考价，主要是配合平台开展相关活动，非必填。</div>
        </el-row>
        <el-form-item label="直接销售者" v-if="permission.indexOf(2) >=0">
          <div class="form-content">
            商品价格&nbsp;&nbsp;<span>&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;</span><el-input style="width:200px;" type="number" v-model="form.sell_earning"></el-input>%
          </div>
        </el-form-item>
        <el-form-item label="直接销售者上一级" v-if="permission.indexOf(2) >=0">
          <div class="form-content">
            商品价格&nbsp;&nbsp;<span>&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;</span><el-input style="width:200px;" type="number" v-model="form.parent_earning"></el-input>%
          </div>
        </el-form-item>
        <el-form-item label="直接销售者上二级" v-if="permission.indexOf(2) >=0">
          <div class="form-content">
            商品价格&nbsp;&nbsp;<span>&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;</span><el-input style="width:200px;" type="number" v-model="form.grandpa_earning"></el-input>%
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form  ref="ruleForm3" label-width="150px" :model="form" class="demo-ruleForm">
      <el-row v-if="form.goods_type==3">
        <el-form-item label="商品名称"  prop="work_name" :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur'},{max: 100, message: '长度100个字符', trigger: 'blur'}]">
          <el-input v-model="form.work_name" maxlength="100"  class="per60"></el-input><span>{{form.work_name.length}}/100</span>
        </el-form-item>
        <el-form-item id="goods_imgs"  label="商品图" prop="goods_imgs"   :rules="[{required: true, message: '请上传商品图'}]" >
          <el-row>
            <draggable class="list-group" element="ul" v-model="form.goods_imgs"  :move="onMove" @start="isDragging=true" @end="moveEnd">
              <transition-group type="transition" :name="'flip-list'">
                <el-upload v-for="(element,index) in form.goods_imgs" :key="'element'+index"
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
            <el-upload  v-if="form.goods_imgs.length<5"
                        class="avatar-uploader"
                        accept="image/jpeg,image/jpg,image/png"
                        :action="uploadOptions.url"
                        :data="uploadOptions.data"
                        name="headpic[]"
                        :show-file-list="false"
                        :before-upload="handlePictureCardbefore"
                        :on-success="handlePictureCardSuccess">
              <i class="el-icon-plus avatar-uploader-icon" @click="UploadIndex(form.goods_imgs.length)"></i>
            </el-upload>
            <div>2MB以内的JPG/PNG图片，建议尺寸 640 x 640 像素，最多5张,可以拖动进行排序。</div>
          </el-row>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form  ref="ruleForm4" label-width="150px" :model="form" class="demo-ruleForm">
      <el-row v-if="form.goods_type==4">
        <el-form-item label="人员名称" prop="work_name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur'},{max: 20, message: '长度20个字符', trigger: 'blur'}]">
          <el-input v-model="form.work_name" maxlength="20" class="per60" ></el-input><span>{{form.work_name.length}}/20</span>
        </el-form-item>
        <el-form-item label="人员头像" id="goods_imgs" prop="goods_imgs" :rules="[{required: true, message: '请上传人员头像'}]" >
          <el-upload
            class="avatar-uploader"
            accept="image/jpeg,image/jpg,image/png"
            :action="uploadOptions.url"
            :data="uploadOptions.data"
            name="headpic[]"
            :show-file-list="false"
            :before-upload="handlePictureCardbefore"
            :on-success="handlePictureCardSuccess">
            <template v-if="form.goods_imgs.length>0">
              <img  :src="form.goods_imgs[0].url" class="avatar" @click="UploadIndex(0)">
            </template>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div>2MB以内的JPG/PNG图片，建议尺寸 640 x 640 像素。</div>
        </el-form-item>
        <el-form-item  label="人员手机号" prop="moblie_phone" :rules="[{validator: validatephone, required:true, trigger: 'blur'}]">
          <el-input v-model="form.moblie_phone"  type="number" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="擅长类目">
          <el-card class="box-card attr-item per60"  v-for="(attr,index) in form.attr_value_imgs" :key="'attr'+index" >
            <div class="attr-value-panel">
              <div class="attr-val-item" v-for="(subItem,subIndex) in attr.values" :key="'subItem'+subIndex">
                <el-tag
                  closable
                  type="info"
                  class="width118"
                  :disable-transitions="false"
                  @close="handleClose(index,subItem)">
                  {{subItem.name}}
                </el-tag>
              </div>
              <el-popover
                placement="top"
                width="160"
                v-model="popover[index].value">
                <p style="margin-bottom: 10px;">
                  <el-input v-model="addAttrName" maxlength="100"></el-input>
                </p>
                <div class="alignCenter">
                  <el-button size="mini"  @click="popover[index].value=false">取消</el-button>
                  <el-button type="primary" size="mini" @click="popover[index].value=false;popoverComfirm(index)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" style="vertical-align: top" @click="addAttr2(index)">添加值</el-button>
              </el-popover>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="服务价格" required=""  >
        </el-form-item>
        <el-row class="rules per60">
          <table class="el-table el-table--border" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
            <tr>
              <template v-for="(item,index) in form.attr_value_imgs" v-if="form.attr_value_imgs.length>0">
                <th class="is-leaf" v-if="item.values.length>0"><div class="cell">{{item.attr_name}}</div></th>
              </template>
              <th class="is-leaf"><div class="cell">参考价（元）<span class="need">*</span></div></th>
            </tr>
            <tr v-for="(item, index) in form.skus" :key="'item'+index">
              <template v-for="(subItem,subIndex) in item.attrs" v-if="item.attrs.length>0">
                <td class="textCenter" :rowspan="subItem.rowspan" v-if="subItem.rowspan != null">{{subItem.value}}</td>
              </template>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.price'" :rules="[{ required: true, message: '请输入价格', trigger: 'change'}]" label-width="0px">
                  <el-input  size="mini" :min="0" type="number" v-model="item.price"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-row>
        <el-form-item label="上午工作时间"  prop="am_worktime2" :rules="[{required: true, message: '请选择上午工作时间', trigger: 'change'}]">
          <el-time-select
            v-model="form.am_worktime1"
            :clearable="false"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: form.am_worktime2==''?'12:00':form.am_worktime2
            }"
            placeholder="选择时间">
          </el-time-select>
          <span>至</span>
          <el-time-select
            v-model="form.am_worktime2"
            :clearable="false"
            :picker-options="{
              start: form.am_worktime1==''?'00:00':form.am_worktime1,
              step: '00:30',
              end: '12:00'
            }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="下午工作时间" prop="pm_worktime2" :rules="[{required: true, message: '请选择下午工作时间', trigger: 'change'}]">
          <el-time-select
            v-model="form.pm_worktime1"
            :clearable="false"
            :picker-options="{
              start: '12:00',
              step: '00:30',
              end: form.pm_worktime2==''?'23:30':form.pm_worktime2
            }"
            placeholder="选择时间">
          </el-time-select>
          <span>至</span>
          <el-time-select
            v-model="form.pm_worktime2"
            :clearable="false"
            :picker-options="{
              start: form.pm_worktime1==''?'12:00':form.pm_worktime1,
              step: '00:30',
              end: '23:30'
            }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="服务间隔时间" prop="interval_time" :rules="[{ required: true, message: '请输入服务间隔时间', trigger: 'blur'}]" >
          <el-input v-model="form.interval_time"  style="width:220px;" :min="0" type="number"></el-input> 分钟
        </el-form-item>
        <el-form-item label="休息时间" >
          <el-checkbox-group v-model="form.rest_time">
            <el-checkbox label="星期一" value="1"></el-checkbox>
            <el-checkbox label="星期二" value="2"></el-checkbox>
            <el-checkbox label="星期三" value="3"></el-checkbox>
            <el-checkbox label="星期四" value="4"></el-checkbox>
            <el-checkbox label="星期五" value="5"></el-checkbox>
            <el-checkbox label="星期六" value="6"></el-checkbox>
            <el-checkbox label="星期日" value="0"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="职级"  prop="rank" :rules="[{ required: true, message: '请输入级职', trigger: 'blur'}]" >
          <el-input v-model="form.rank" style="width:220px;" :maxlength="6"></el-input> {{form.rank.length}}/6
        </el-form-item>
        <el-form-item label="工作年限" prop="work_year" :rules="[{ required: true, message: '请输入工作年限', trigger: 'blur'}]" >
          <el-input v-model="form.work_year" style="width:220px;" type="number" :min="0" ></el-input> 年
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"  class="per60"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form  ref="ruleForm17" label-width="150px" :model="form" class="demo-ruleForm">
      <el-row v-if="form.goods_type==17">
        <el-form-item label="服务名称"  prop="work_name" :rules="[{ required: true, message: '请输入服务名称', trigger: 'blur'},{max: 100, message: '长度100个字符', trigger: 'blur'}]">
          <el-input v-model="form.work_name" maxlength="100"  class="per60"></el-input><span>{{form.work_name.length}}/100</span>
        </el-form-item>
        <el-form-item id="goods_imgs"  label="服务配图" prop="goods_imgs"   :rules="[{required: true, message: '请上传商品图'}]" >
          <el-row>
            <draggable class="list-group" element="ul" v-model="form.goods_imgs"  :move="onMove" @start="isDragging=true" @end="moveEnd">
              <transition-group type="transition" :name="'flip-list'">
                <el-upload v-for="(element,index) in form.goods_imgs" :key="'element'+index"
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
            <el-upload  v-if="form.goods_imgs.length<5"
                        class="avatar-uploader"
                        accept="image/jpeg,image/jpg,image/png"
                        :action="uploadOptions.url"
                        :data="uploadOptions.data"
                        name="headpic[]"
                        :show-file-list="false"
                        :before-upload="handlePictureCardbefore"
                        :on-success="handlePictureCardSuccess">
              <i class="el-icon-plus avatar-uploader-icon" @click="UploadIndex(form.goods_imgs.length)"></i>
            </el-upload>
            <div>2MB以内的JPG/PNG图片，建议尺寸 640 x 640 像素，最多5张,可以拖动进行排序。</div>
          </el-row>
        </el-form-item>
        <el-form-item label="服务项目" required="">
        </el-form-item>
        <el-row  class="rules per60">
          <el-card class="box-card attr-item per60"  v-for="(attr,index) in form.attr_value_imgs" :key="'attr'+index" >
            <div class="attr-value-panel">
              <div class="attr-val-item" v-for="(subItem,subIndex) in attr.values" :key="'subItem'+subIndex">
                <el-tag
                  closable
                  type="info"
                  class="width118"
                  :disable-transitions="false"
                  @close="handleClose(index,subItem)">
                  {{subItem.name}}
                </el-tag>
              </div>
              <el-popover
                placement="top"
                width="160"
                v-model="popover[index].value">
                <p style="margin-bottom: 10px;">
                  <el-input v-model="addAttrName" maxlength="100"></el-input>
                </p>
                <div class="alignCenter">
                  <el-button size="mini"  @click="popover[index].value=false">取消</el-button>
                  <el-button type="primary" size="mini" @click="popover[index].value=false;popoverComfirm(index)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" style="vertical-align: top" @click="addAttr2(index)">添加值</el-button>
              </el-popover>
            </div>
          </el-card>
        </el-row>
        <el-form-item label="门市价格" required="">
        </el-form-item>
        <el-row class="rules per60">
          <table class="el-table el-table--border" style="wdith:460px;" cellspacing="0" cellpadding="0" border="0" >
            <tr>
              <template v-for="(item,index) in form.attr_value_imgs" v-if="form.attr_value_imgs.length>0">
                <th class="is-leaf" v-if="item.values.length>0"><div class="cell">{{item.attr_name}}</div></th>
              </template>
              <th class="is-leaf"><div class="cell">数量<span class="need">*</span></div></th>
              <th class="is-leaf"><div class="cell">门市价（元）<span class="need">*</span></div></th>
            </tr>
            <tr v-for="(item, index) in form.skus" :key="'item'+index">
              <template v-for="(subItem,subIndex) in item.attrs" v-if="item.attrs.length>0">
                <td class="textCenter" :rowspan="subItem.rowspan" v-if="subItem.rowspan != null">{{subItem.value}}</td>
              </template>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.stock'" :rules="[{ required: true, message: '请输入数量', trigger: 'change'}]" label-width="0px">
                  <el-input  size="mini" :min="0" type="number" v-model="item.stock"></el-input>
                </el-form-item>
              </td>
              <td class="textCenter">
                <el-form-item :prop="'skus.'+index+'.price'" :rules="[{ required: true, message: '请输入价格', trigger: 'change'}]" label-width="0px">
                  <el-input  size="mini" :min="0" type="number" v-model="item.price"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div style="padding:20px 0px;" >
            <span>套餐组合规则：</span>
            <el-radio v-model="radio" label="0">全部包含</el-radio>
            <el-radio v-model="radio" label="1">任选<el-input type="number" size="mini" :min="1"  v-model="form.buy_items" style="width:80px"></el-input>项</el-radio>
          </div>
        </el-row>
        <el-form-item label="购买价格" prop="price" :rules="[{required: true, message: '请输入购买价格', trigger: 'blur'}]">
          <el-input v-model="form.price"  type="number" :min="0" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="使用期限" prop="data" :rules="[{ required: true, message: '请输入使用期限', trigger: 'change'}]">
          <el-date-picker
            v-model="form.data"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上午工作时间"  prop="am_worktime2" :rules="[{required: true, message: '请选择上午工作时间', trigger: 'change'}]">
          <el-time-select
            v-model="form.am_worktime1"
            :clearable="false"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: form.am_worktime2==''?'12:00':form.am_worktime2
            }"
            placeholder="选择时间">
          </el-time-select>
          <span>至</span>
          <el-time-select
            v-model="form.am_worktime2"
            :clearable="false"
            :picker-options="{
              start: form.am_worktime1==''?'00:00':form.am_worktime1,
              step: '00:30',
              end: '12:00'
            }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="下午工作时间" prop="pm_worktime2" :rules="[{required: true, message: '请选择下午工作时间', trigger: 'change'}]">
          <el-time-select
            v-model="form.pm_worktime1"
            :clearable="false"
            :picker-options="{
              start: '12:00',
              step: '00:30',
              end: form.pm_worktime2==''?'23:30':form.pm_worktime2
            }"
            placeholder="选择时间">
          </el-time-select>
          <span>至</span>
          <el-time-select
            v-model="form.pm_worktime2"
            :clearable="false"
            :picker-options="{
              start: form.pm_worktime1==''?'12:00':form.pm_worktime1,
              step: '00:30',
              end: '23:30'
            }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="服务间隔时间" prop="interval_time" :rules="[{ required: true, message: '请输入服务间隔时间', trigger: 'blur'}]" >
          <el-input v-model="form.interval_time"  :min="0" type="number" style="width:220px;"></el-input>&nbsp;分钟
        </el-form-item>
        <el-form-item label="同时服务数量" prop="sametime_service" :rules="[{required: true, message: '请输入同时服务人数', trigger: 'blur'}]">
          <el-input v-model="form.sametime_service"  type="number" :min="0" style="width:220px;"></el-input><el-tooltip content="每个时间间隔可提供服务的份数" placement="top">
          <el-button type="text" icon="el-icon-question" circle></el-button>
        </el-tooltip>
        </el-form-item>
        <el-form-item label="休息时间" >
          <el-checkbox-group v-model="form.rest_time">
            <el-checkbox label="星期一" value="1"></el-checkbox>
            <el-checkbox label="星期二" value="2"></el-checkbox>
            <el-checkbox label="星期三" value="3"></el-checkbox>
            <el-checkbox label="星期四" value="4"></el-checkbox>
            <el-checkbox label="星期五" value="5"></el-checkbox>
            <el-checkbox label="星期六" value="6"></el-checkbox>
            <el-checkbox label="星期日" value="0"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="购买须知"  >
          <div class="box-card per60" v-for="(item,index) in form.buyer_reading" :key="'list'+index">
            <div slot="header" class="clearfix2">
              <el-input
                placeholder="请输入内容"
                type="text"
                v-model="item.value" style="width:350px; margin-bottom: 10px;">
              </el-input>
              <el-popover
                placement="right"
                width="400"
                v-model="recommendPopover[index].value">
                <el-table :data="gridData"  height="300">
                  <el-table-column width="380"  label="请选择推荐">
                    <template slot-scope="scope">
                      <p class="linkp" @click="Recommend(scope.row.address,index)">{{scope.row.address}}</p>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button slot="reference">推荐</el-button>
              </el-popover>
              <el-button type="info"  @click="del(index)">删除</el-button>
            </div>
          </div>
          <el-button type="text" @click="add">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form  ref="ruleForm" label-width="150px" :model="form" class="demo-ruleForm" v-show="form.goods_type!=4">
      <el-form-item label="商品详情"  required="" v-show="form.goods_type!=4">
        <div class="per60">
          <UE :defaultMsg='form.desc' :config="config"  ref="ue" id="ue"></UE>
        </div>
      </el-form-item>
    </el-form>
    <div class="footerSubmit"><el-button type="primary" @click="publishGood">立即发布</el-button></div>
    <cutPictur @comfirm="pictureCardSuccess" ref="cutPicture"></cutPictur>
    <cutPictur @comfirm="handlePictureSuccess" ref="cutPicture2"></cutPictur>
  </div>
</template>
<script>
  import UE from '../../../components/ue.vue';
  import qs from 'qs';
  import cutPictur from '../../../components/cutPicture.vue';
  import draggable from 'vuedraggable';
  import Sortable  from 'sortablejs';
  export default {
    components: {
      UE,
      draggable,
      Sortable,
      cutPictur
    },
    mounted() {
    },
    computed: {
      dragOptions() {
        return {
          animation: 0,
          group: 'description',
          disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      hasService() {
        //服务
        if (this.version.indexOf('美业') >= 0) {
          return true;
        } else {
          return false;
        }
      },
      hasSubscribe() {
        //预约
        if (this.version.indexOf('美业') >= 0) {
          return true;
        } else {
          return false;
        }
      },
      hasConsultation() {
        //咨询
        if (this.version.indexOf('标准') >= 0) {
          if (!this.userinfo.sync_flag && this.userinfo.is_sub_shop) {
            return false
          } else
            return true;
        } else if (this.version.indexOf('尊享') >= 0) {
          if (!this.userinfo.sync_flag && this.userinfo.is_sub_shop) {
            return false
          } else
            return true;
        } else if (this.version.indexOf('美业') >= 0) {
          if (!this.userinfo.sync_flag && this.userinfo.is_sub_shop) {
            return false
          } else
            return true;
        } else if (this.version.indexOf('社保') >= 0) {
          if (!this.userinfo.sync_flag && this.userinfo.is_sub_shop) {
            //this.form.goods_type=1;
            return false
          } else{
            //this.form.goods_type=3;
            return true;
          }

        } else {
          //this.form.goods_type=1;
          return false;
        }
      },
      hasfictitious() {
        //虚拟
        if (this.version.indexOf('标准') >= 0) {
          return true;
        } else if (this.version.indexOf('尊享') >= 0) {
          return true;
        } else if (this.version.indexOf('美业') >= 0) {
          return true;
        }
        else if (this.version.indexOf('社保') >= 0){

          if(this.form.goods_type==1)
          this.form.goods_type=2;
          return true;
        }
        else  {
          return false;
        }
      },
      hasReal() {
        //实物
        if (this.version.indexOf('标准') >= 0) {
          this.getRegion().then(() => {
            this.setForm();
          });
          return true;
        } else if (this.version.indexOf('尊享') >= 0) {
          this.getRegion().then(() => {
            this.setForm();
          });
          return true;
        } else if (this.version.indexOf('美业') >= 0) {
          this.getRegion().then(() => {
            this.setForm();
          });
          return true;
        } else {
          return false;
        }
      }
    },
    created() {
      if (this.form.bid != undefined) {
        this.getGoodsDetail(this.form.bid);
      } else {
        this.attrInit('161');
      }
    },
    data: function () {
      return {
        uploadOptions: {
          url: this.api.upload_img,
          data: {
            path_code: '16',
            data_type: 'html'
          }
        },
        version: sessionStorage.getItem('version'),
        recommendPopover: [],
        currentUploadIndex: '',
        addAttrName: '',
        isDragging: '',
        userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
        curuid: sessionStorage.getItem('curuid'),
        priceType: '设置数字',
        config: {
          toolbars: [['Source', 'Bold', 'italic', 'underline', 'forecolor', 'fontfamily', 'fontsize', 'justifyleft', 'justifycenter', 'justifyright', 'simpleupload']],
          enableAutoSave: false,
          enableContextMenu: false,
          elementPathEnabled: false,
          wordCountMsg: '{#count} / 10000',
          wordOverFlowMsg: '请不要超过10000个字符',
          autoHeightEnabled: true,
          scaleEnabled: false,
          zIndex: 1,
          autoFloatEnabled: true,
          initialFrameWidth: null,
          initialFrameHeight: 500,
        },
        permission: JSON.parse(sessionStorage.getItem('permission')),
        rowsData: [],
        setPriceValue: '',
        originalPrice: '',
        stockValue: '',
        selects: [],
        form: {
          gtid: '161',
          goods_type: 1,
          work_name: '',
          goods_imgs: [],
          attr_value_imgs: [],
          price: '',
          data: '',
          buy_items: '',
          sametime_service: '',
          skus: [{
            attrs: [],
            stock: '',
            price: '',
            original_price: '',
            sku_sales: 0,
          }],
          shipping: '0.00',
          shipping_type: '0',
          shipping_tpl_id: '0',
          desc: '',
          sell_earning: '',
          parent_earning: '',
          grandpa_earning: '',
          sell: '',
          bid: this.$route.params.id,
          buyer_reading: [],
          am_worktime: '',
          am_worktime1: '',
          am_worktime2: '',
          pm_worktime: '',
          pm_worktime1: '',
          pm_worktime2: '',
          moblie_phone: '',
          rank: '',
          work_year: '',
          address: '',
          rest_time: [],
          interval_time: ''
        },
        refundSetForm: {
          refund_person: '',
          refund_phone: '',
          refund_address: '',
          //refund_type: false,
          //refund_deadline: '',
          refund_region: []
        },
        propData: {
          label: 'name',
          value: 'id',
          children: 'child'
        },
        allowPublish:true,
        region: [],
        radio: '0',
        popover: [],
        oldtime: '',

        gridData: [
          {
            address: '为保证服务质量，请按预约时间到店，否则可能无法接待'
          }, {
            address: '如遇特殊情况无法按时到店，可修改预约时间'
          }, {
            address: '不与其他优惠同享'
          }, {
            address: '每份最多1人使用'
          }, {
            address: '如遇高峰期时段您可能需要排队'
          }, {
            address: '适用人群：男宾专属'
          }, {
            address: '适用人群：女宾专属'
          }, {
            address: '适用人群：男女通用'
          }, {
            address: '节假日不可用'
          }, {
            address: '如需发票，请到店消费时向商家咨询'
          }
        ]
      }
    },
    methods: {
      //表单验证
      formValidate() {
        return new Promise((resolve, reject) => {
          this.$refs['refundSetForm'].validate((valid) => {
            if (valid) {
              console.log(this.refundSetForm.refund_region);
              if (this.refundSetForm.refund_region == undefined) {
                this.$message.error("请选择所在地区！")
              } else {
                resolve();
              }
            }
          });
        });
      },
      //设置店铺保存触发事件
      submitForm() {
        return new Promise((resolve, reject) => {
          this.formValidate().then(() => {
            var smData = {};
            smData = JSON.parse(JSON.stringify(this.refundSetForm));
            smData.refund_province = smData.refund_region[0];
            smData.refund_city = smData.refund_region[1];
            smData.refund_district = smData.refund_region[2];
            smData.buid = this.curuid;
            delete smData.refund_region;
            this.api.request({
              url: this.api.shopSet,
              method: 'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
              data: qs.stringify(smData)
            }).then((res) => {
              if (res.data.state.code == 10200) {
                this.$message({
                  type: 'success',
                  message: '设置成功！'
                });
                resolve();
              } else {
                this.allowPublish=true;
                this.$message.error(res.data.state.msg);
                reject();
              }
            });
          });
        });
      },
      //获取省市县
      getRegion() {
        return new Promise((resolve, reject) => {
          this.api.request({
            url: this.api.get_region
          }).then((res) => {
            if (res.data.state.code == 10200) {
              this.region = res.data.data;
              resolve();
            } else {
              this.$message.error(res.data.state.msg);
            }
          });
        })
      },
      //获取店铺设置数据
      setForm() {
        var smData = {};
        smData.buid = this.curuid;
        this.api.request({
          url: this.api.getShopSet,
          params: smData,
        }).then((res) => {
          if (res.data.state.code == 10200) {
            this.refundSetForm.refund_address = res.data.data.refund_address;
            this.refundSetForm.refund_region = [JSON.stringify(res.data.data.refund_province), JSON.stringify(res.data.data.refund_city), JSON.stringify(res.data.data.refund_district)];
            this.refundSetForm.refund_person = res.data.data.refund_person;
            this.refundSetForm.refund_phone = res.data.data.refund_phone;
          } else {
            this.$message.error(res.data.state.msg);
          }
        });
      },
      //重置form
      resetForm() {
        this.form = {
          gtid: '161',
          goods_type: 1,
          work_name: '',
          goods_imgs: [],
          attr_value_imgs: [],
          price: '',
          data: '',
          buy_items: '',
          skus: [{
            attrs: [],
            stock: '',
            price: '',
            original_price: '',
            sku_sales: 0,
          }],
          shipping: '0.00',
          shipping_type: '0',
          shipping_tpl_id: '0',
          desc: '',
          sell_earning: '',
          parent_earning: '',
          grandpa_earning: '',
          sell: '',
          sametime_service: '',
          bid: this.$route.params.id,
          buyer_reading: [],
          am_worktime: '',
          am_worktime1: '',
          am_worktime2: '',
          pm_worktime: '',
          pm_worktime1: '',
          pm_worktime2: '',
          moblie_phone: '',
          rank: '',
          work_year: '',
          address: '',
          rest_time: [],
          interval_time: ''
        }
      },
      //禁止重复点击
      throttle(currenttime) {
        if (this.oldtime == '') {
          this.oldtime = currenttime;
          return true;
        } else {
          if (currenttime - this.oldtime < 500) {
            this.oldtime = currenttime;
            return false;
          } else {
            this.oldtime = currenttime;
            return true;
          }
        }
        ;
      },
      //数值必须大于0
      validateNumber(rule, value, callback) {
        if (parseFloat(value)<=0) {
          callback(new Error('数值必须大于0'))
        } else {
          callback()
        }
      },
      //电话号码验证
      validatephone(rule, value, callback) {
        var re1 = /^(1(3|4|5|6|7|8|9)[0-9]{9})$/;
        var re2 = /^(0\d{2,3}-\d{7,8})$/;
        if (value == '') {
          callback(new Error('号码不能为空'))
        } else if (!re1.test(value) && !re2.test(value)) {
          callback(new Error('请输入正确的手机号或电话'))
        } else {
          callback()
        }
      },
      //商品类型发生改变时触发的函数
      goods_type_change(val) {

        if (this.form.bid == undefined) {
          console.log('change');
          this.resetForm();
          /*if(this.$refs['ruleForm'].clearValidate)
          this.$refs['ruleForm'].clearValidate();*/
          this.form.attr_value_imgs = [];
          this.generateTableByAttrs(this.form.attr_value_imgs);
        }
        this.form.goods_type = val;
        if (val == 4 || val == '17' && this.form.attr_value_imgs.length <= 0) {
          this.form.attr_value_imgs = [{
            attr_id: '1077',
            attr_name: '类型',
            values: []
          }];
          this.popover.push({value: false});
        }

      },
      //商品图片上传前触发函数
      handlePictureCardbefore(file) {
        if (file.size / 1024 / 1024 > 2) {
          this.$message.error("上传图片不能大于2M");
          return false;
        }
        if (file.type == 'image/jpeg') {
          //return true;
          this.$refs['cutPicture'].open(file);
          return false;
        } else if (file.type == 'image/png') {
          // return true;
          this.$refs['cutPicture'].open(file);
          return false;
        } else if (file.type == 'image/jpg') {
          // return true;
          this.$refs['cutPicture'].open(file);
          return false;
        } else {
          this.$message.error("请上传图片");
          return false;
        }
      },
      //规格上传前处理函数
      handlePictureCardbefore2(file) {
        if (file.size / 1024 / 1024 > 2) {
          this.$message.error("上传图片不能大于2M");
          return false;
        }
        if (file.type == 'image/jpeg') {
          //return true;
          this.$refs['cutPicture2'].open(file);
          return false;
        } else if (file.type == 'image/png') {
          // return true;
          this.$refs['cutPicture2'].open(file);
          return false;
        } else if (file.type == 'image/jpg') {
          // return true;
          this.$refs['cutPicture2'].open(file);
          return false;
        } else {
          this.$message.error("请上传图片");
          return false;
        }
      },
      //切图上传成功角发函数
      pictureCardSuccess(res) {
        if (this.currentUploadIndex == this.form.goods_imgs.length) {
          this.form.goods_imgs.push({
            url: this.api.photo_Server + res.data
          })
        } else {
          this.form.goods_imgs[this.currentUploadIndex].url = this.api.photo_Server + res.data;
        }
        if (this.form.goods_imgs.length > 0) {
          if (document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error').length > 0) {
            document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error')[0].remove();
          }
        }
      },
      //规格图片上传成功处理函数
      handlePictureSuccess(res) {
        var index = parseInt(this.currentUploadIndex);
        if (index === '' || index == undefined || index == null) {
          return false;
        } else {
          this.form.attr_value_imgs[0].values[index].img = this.api.photo_Server + res.data;
        }
      },
      //商品图片上传成功时触发的函数
      handlePictureCardSuccess(response, file, fileList) {
        if (this.currentUploadIndex == this.form.goods_imgs.length) {
          this.form.goods_imgs.push({
            url: this.api.photo_Server + response.data
          })
        } else {
          this.form.goods_imgs[this.currentUploadIndex].url = this.api.photo_Server + response.data;
        }
        if (this.form.goods_imgs.length > 0) {
          if (document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error').length > 0) {
            document.getElementById('goods_imgs').getElementsByClassName('el-form-item__error')[0].remove();
          }
        }
      },
      //图片拖动排序调整
      onMove({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      //图片拖动排序结束
      moveEnd() {
        this.isDragging = false;
      },

      UploadIndex(index) {
        this.currentUploadIndex = index;
      },
      //商品图片文件列表移除时触发事件
      handlePictureCardRemove(e) {
        e.stopPropagation();
        var index = parseInt(e.target.id.replace('del', ''));
        this.form.goods_imgs.splice(index, 1);
      },
      //商品图片超出限制个数时触发事件
      handlePictureCardExceed(files, fileList) {
        this.$message.error('最多上传5张封面');
      },
      //获取商品详情
      getGoodsDetail(bid) {
        return new Promise((resolve, reject) => {
          var url = this.api.getGoodsDetail + '/' + bid;
          this.api.request({
            url: url,
            params: {
              buid: this.curuid
            }
          }).then((res) => {
            if (res.data.state.code == 10200) {
              this.getGoodDetailFun(res.data.data);
              this.generateTableByAttrs(this.form.attr_value_imgs);
              resolve();
            } else {
              this.$message.error(res.data.state.msg);
              reject();
            }
          })
        }).catch(() => {
          reject();
        });
      },
      //设置商品详情数据
      getGoodDetailFun(res) {
        this.form.gtid = res.gtid;
        //if(this.form.gtid!='161'){
        this.attrInit(res.gtid);
        //}
        this.form.work_name = res.wname;
        res.goods_imgs.forEach((item, index) => {
          var obj = {
            url: item,
          }
          this.form.goods_imgs.push(obj);
        });
        var isDefault = false;
        if ((res.skus.length === 1 && res.skus[0].attrs[0].value == '一米普通') || res.skus.length == 0) {
          isDefault = true;
        }
        this.form.goods_type = res.goods_type;
        this.form.skus = res.skus;
        this.form.attr_value_imgs = this.setAttrs(res.attr_names, res.attr_value_imgs, isDefault);
        this.form.shipping = res.shipping;
        this.form.shipping_type = res.shipping_type;
        this.form.shipping_tpl_id = res.shipping_tpl_id;
        this.form.desc = res.desc;
        this.form.sell_earning = res.sell_earning;
        this.form.parent_earning = res.parent_earning;
        this.form.grandpa_earning = res.grandpa_earning;
        this.form.sell = res.sell;
        this.form.bid = res.bid;
        this.form.am_worktime = res.am_worktime;
        this.form.am_worktime1 = res.am_worktime.split('-')[0];
        this.form.am_worktime2 = res.am_worktime.split('-')[1];
        this.form.pm_worktime = res.pm_worktime;
        this.form.pm_worktime1 = res.pm_worktime.split('-')[0];
        this.form.pm_worktime2 = res.pm_worktime.split('-')[1];
        this.form.moblie_phone = res.moblie_phone;
        this.form.rank = res.rank;
        this.form.work_year = res.work_year;
        this.form.address = res.address;
        this.form.interval_time = res.interval_time;
        this.form.sametime_service = res.sametime_service;
        this.form.price = res.price;
        this.form.data = [res.use_begin_time, res.use_end_time];
        this.form.buy_items = res.buy_items;

        if (this.form.goods_type == 4 && this.form.attr_value_imgs.length <= 0) {
          this.form.attr_value_imgs = [{
            attr_id: '1077',
            attr_name: '类型',
            values: []
          }];
          this.popover.push({value: false});
        }
        if (this.form.goods_type != 4) {
          this.$refs['ue'].setUEContent(this.form.desc);
        }
        res.rest_time.forEach(item => {
          if (item == 1) this.form.rest_time.push('星期一');
          else if (item == 2) this.form.rest_time.push('星期二');
          else if (item == 3) this.form.rest_time.push('星期三');
          else if (item == 4) this.form.rest_time.push('星期四');
          else if (item == 5) this.form.rest_time.push('星期五');
          else if (item == 6) this.form.rest_time.push('星期六');
          else if (item == 0) this.form.rest_time.push('星期日');
        });
        if (res.buy_items == 0) this.radio = '0'; else this.radio = '1';
        this.form.buyer_reading = res.buyer_reading.map((item) => {
          this.recommendPopover.push({value: false});
          return {value: item}
        });
      },
      //设置thead
      setThead(attrs) {
        var validAttrs = attrs.filter(function (attr) {
          return attr.values.length > 0;
        });
        this.thead = validAttrs.map(function (attr) {
          return attr.attr_name;
        });
      },
      // 根据规格生成表格
      generateTableByAttrs(attrs) {
        var validAttrs = attrs.filter(function (attr) {
          return attr.values.length > 0;
        });
        var len = 1; // 表格行数
        validAttrs.forEach(function (attr) {
          len *= attr.values.length;
        });
        // 创建表格
        this.rowsData = new Array(len);
        for (var i = 0; i < len; i++) {
          this.rowsData[i] = {
            attrs: [],
          };
        }
        if (len > this.form.skus.length) {
          for (var i = this.form.skus.length; i < len; i++) {
            this.form.skus.push({
              attrs: [],
              stock: '',
              price: '',
              original_price: '',
              sku_sales: 0
            })
          }
        } else {
          this.form.skus.splice(len - 1, this.form.skus.length - len);
        }
        this.fillTable(this.rowsData, validAttrs);
        this.setRowspan(this.rowsData, validAttrs);
      },
      //设置rowspan
      setRowspan(rowsData, attrs) {

        var tmpAttrValue;
        var tmpIndex;
        var rowsData = rowsData;

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
        rowsData.forEach((item, i) => {
          if(i==0&&item.attrs.length==0){

          }else
          this.form.skus[i].attrs = item.attrs;
        });
      },
      // 添加规格数据到表格中
      fillTable(rows, attrs) {
        // 每种规格的最大索引值
        var colMaxIndexs = attrs.map(function (attr) {
          return attr.values.length;
        });
        var colIndexs = attrs.map(function () {
          return 0;
        });
        for (var i = 0; i < rows.length; i++) {
          // 依次加入各规格到一行中
          for (var k = 0; k < attrs.length; k++) {
            this.rowsData[i].attrs.push({
              attr_id: attrs[k].attr_id,
              value: attrs[k].values[colIndexs[k]].name,
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
      //制保留2位小数，如：2，会在2后面补上00.即2.00
      toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
          return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      //原价设置方式的选择
      originalPriceChange() {
        this.originalPrice = '';
      },
      //批量设置零售价
      priceBlur() {
        if (this.setPriceValue != '') {
          this.setPriceValue = this.toDecimal2(this.setPriceValue);
          this.form.skus.forEach((item, index) => {
            if (this.form.skus[index].original_price != '' && this.form.skus[index].original_price != '0.00') {
              var originalPrice = parseFloat(this.form.skus[index].original_price);
              if (parseFloat(this.setPriceValue) <= parseFloat(this.form.skus[index].original_price)) {
                this.form.skus[index].price = this.setPriceValue;
              } else {
                this.form.skus[index].price = '';
                this.$message.error("零售价不能大于原价！");
              }
            } else {
              this.form.skus[index].price = this.setPriceValue;
            }
          });
        }
      },
      //批量设置原价
      setRriginalPrice() {
        if (this.priceType == '设置数字') {
          if (this.originalPrice != '') {
            this.form.skus.forEach((item, index) => {
              if (this.form.skus[index].price != '') {
                if (parseFloat(this.form.skus[index].price) <= parseFloat(this.originalPrice)) {
                  this.form.skus[index].original_price = this.toDecimal2(parseFloat(this.originalPrice));
                } else {
                  this.form.skus[index].original_price = '';
                  this.$message.error("原价不能小于零售价！");
                }
              } else {
                this.form.skus[index].original_price = this.toDecimal2(parseFloat(this.originalPrice));
              }
            });
          }
        } else if (this.priceType == '零售价上加百分比') {
          if (this.originalPrice != '') {
            this.form.skus.forEach((item, index) => {
              var oprice = parseFloat(this.form.skus[index].price);
              this.form.skus[index].original_price = this.toDecimal2(oprice + oprice * parseFloat(this.originalPrice) / 100);
            });
          } else {
            this.$message.error("请输入零售价");
          }
        } else if (this.priceType == '零售价上加数字') {
          if (this.originalPrice != '') {
            this.form.skus.forEach((item, index) => {
              this.form.skus[index].original_price = this.toDecimal2(parseFloat(this.form.skus[index].price) + parseFloat(this.originalPrice));
            });
          } else {
            this.$message.error("请输入零售价");
          }
        }
      },
      //批量设置库存
      setStock() {
        if (this.stockValue != '') {
          this.form.skus.forEach((item, index) => {
            this.form.skus[index].stock = this.stockValue;
          });
        }
      },
      //设置规格
      setAttrs(attrValues, attrImages, isDefault) {
        var arr = [];
        var attrImages = attrImages;
        if (!isDefault) {
          attrValues.forEach((item, index) => {
            this.popover.push({value: false});
            arr.push({
              attr_id: item.attr_id,
              attr_name: item.attr_name,
              values: [],
            });
            item.values.forEach(function (value, subIndex) {
              arr[index].values[subIndex] = {
                name: value.gav_name,
              };
            });
          });
          if (arr[0].attr_id === attrImages.attr_id) {
            arr[0].values = attrImages.values;
          }
        }
        return arr;
      },
      //初始化 获取分类下规格
      attrInit(goodsId) {
        this.api.request({
            url: this.api.attr_goods + goodsId + '/2',
            params: {
              buid: this.curuid
            }
          }
        ).then((res) => {
          this.selects = res.data.data;
        });
      },
      //点击添加规格值
      addAttr1(index) {
        this.$message.error("请先选择规格！");
        this.popover[index].value = false;
        return;
      },
      addAttr2(index) {
        this.popover[index].value = true;
        this.addAttrName = '';
      },
      //检查同一规格类是否有相同的规格值
      attrsValue(index) {
        if (this.form.attr_value_imgs[index].values.length > 0) {
          var value;
          this.form.attr_value_imgs[index].values.forEach(item => {
            if (item.name == this.addAttrName) {
              value = item;
              return;
            }
          });
          if (value != undefined) {
            return true
          } else {
            return false
          }
        } else {
          return false;
        }
      },
      //添加规格值
      popoverComfirm(index) {
        if (this.throttle(new Date().getTime())) {
          if (this.addAttrName == '') {
            if (this.form.goods_type == 1 || this.form.goods_type == 2) {
              this.$message.error("请输入规格值！");
            } else if (this.form.goods_type == 4) {
              this.$message.error("请输入擅长类目！");
            } else if (this.form.goods_type == '17') {
              this.$message.error("请输入服务项目！");
            }
            return;
          } else {
            if (!this.attrsValue(index)) {
              this.popover[index].value = false;
              setTimeout(() => {
                this.form.attr_value_imgs[index].values.push({
                  img: '',
                  name: this.addAttrName
                });
                this.generateTableByAttrs(this.form.attr_value_imgs);
              }, 160);
            } else {
              if (this.form.goods_type == 1 || this.form.goods_type == 2) {
                this.$message.error("此规格值已经存在！");
              } else if (this.form.goods_type == 4) {
                this.$message.error("此擅长类目已经存在！");
              } else if (this.form.goods_type == '17') {
                this.$message.error("此服务项目已经存在！");
              }
            }
          }
        }
      },
      //删除规格值
      handleClose(index, tag) {
        var idx = this.form.attr_value_imgs[index].values.indexOf(tag);
        this.form.attr_value_imgs[index].values.splice(idx, 1);
        this.generateTableByAttrs(this.form.attr_value_imgs);
      },
      //删除规格
      attrDel(index) {
        this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.attr_value_imgs.splice(index, 1);
          this.popover.splice(index, 1);
          this.generateTableByAttrs(this.form.attr_value_imgs);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch();
      },
      //添加规格
      attrAdd() {
        var obj = {
          attr_id: '0',
          attr_name: "",
          values: []
        };
        this.form.attr_value_imgs.push(obj);
        this.popover.push({value: false})
      },
      //检查规格是否重复
      attrCheck(index) {
        var attr = JSON.parse(JSON.stringify(this.form.attr_value_imgs));
        attr.splice(index, 1);
        console.log(attr);
        if (attr.length > 0) {
          var ishave;
          attr.forEach(item => {
            if (this.form.attr_value_imgs[index].attr_id == item.attr_id) {
              ishave = item;
              return;
            }
          });
          if (ishave != undefined) {
            this.$message.error("存在相同的规格！");
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      //规格分类发生变化时
      attrChange(index) {
        if (this.attrCheck(index)) {
          var select;
          this.selects.forEach(item => {
            if (item.gaid == this.form.attr_value_imgs[index].attr_id) {
              select = item;
              return;
            }
          });
          if (select != undefined || index == 0) {
            this.form.attr_value_imgs[index].attr_name = select.ga_name;
            this.form.attr_value_imgs[index].values = [];
            this.generateTableByAttrs(this.form.attr_value_imgs);
          }
        } else {
          this.form.attr_value_imgs[index].attr_id = '0';
          this.form.attr_value_imgs[index].values = [];
          this.generateTableByAttrs(this.form.attr_value_imgs);
        }
      },
      //删除购买须知
      del(index) {
        this.form.buyer_reading.splice(index, 1);
      },
      //添加购买须知
      add() {
        this.form.buyer_reading.push({value: ''});
        this.recommendPopover.push({value: false});
      },
      //点击推荐
      Recommend(item, index) {
        this.form.buyer_reading[index] = {
          value: item
        };
        this.recommendPopover[index].value = false;
      },
      //发布新商品
      publishGood() {
        console.log(this);
        if (this.throttle(new Date().getTime())&&this.allowPublish) {
          this.allowPublish=false;
          var isForm;
          if (this.form.goods_type == 1) {
            isForm = 'ruleForm1'
          }
          if (this.form.goods_type == 2) {
            isForm = 'ruleForm2'
          }
          if (this.form.goods_type == 3) {
            isForm = 'ruleForm3'
          }
          if (this.form.goods_type == 4) {
            isForm = 'ruleForm4'
          }
          if (this.form.goods_type == 17) {
            isForm = 'ruleForm17'
          }
          this.$refs[isForm].validate((valid) => {
            if (valid) {
              this.requestGood();
            } else {
              this.allowPublish=true;
              this.$message.error('请完善信息')
            }
          });
        }
      },
      requestGood() {
        var smData = JSON.parse(JSON.stringify(this.form));
        if (this.form.goods_type != 4) {
          smData.desc = this.$refs['ue'].getUEContent();
          if (smData.desc == '') {
            this.allowPublish=true;
            this.$message.error("详情不能为空！");
            return false;
          }
        }
        if (this.form.goods_type == 17) {
          if (this.form.attr_value_imgs[0].values.length <= 0) {
            this.allowPublish=true;
            this.$message.error("服务项目不能为空！");
            return false;
          }
          if (smData.data[0] == smData.data[1]) {
            this.allowPublish=true;
            this.$message.error("使用期限开始时间与结束时间不能是同一个时间！");
            return false;
          }
          smData.use_begin_time = smData.data[0];
          smData.use_end_time = smData.data[1];
          if (smData.buyer_reading.length > 0)
            smData.buyer_reading = smData.buyer_reading.map(item => {
              return item.value
            });
          else smData.buyer_reading = '';
          if (this.radio == 0) smData.buy_items = 0;
          if (smData.buy_items > smData.attr_value_imgs[0].values.length) {
            this.allowPublish=true;
            this.$message.error("任选项不能大于服务项目的总数量！");
            return false;
          }
        }

        //添加默认规格
        if (this.form.skus[0].attrs.length === 0) {
          smData.skus[0].attrs.push({
            attr_id: '1077',
            value: '一米普通'
          })
        }
        smData.goods_imgs = [];
        this.form.goods_imgs.forEach((item, i) => {
          if (this.form.goods_imgs[i].response != undefined) {
            var index = smData.goods_imgs.length;
            smData.goods_imgs[index] = this.api.photo_Server + item.response.data;
          } else {
            var index = smData.goods_imgs.length;
            smData.goods_imgs[index] = item.url;
          }
        });
        smData.attr_value_imgs = smData.attr_value_imgs[0];
        smData.buid = this.curuid;
        if (smData.am_worktime1 != '' && smData.am_worktime1 != '') {
          smData.am_worktime = smData.am_worktime1 + '-' + smData.am_worktime2;
        }
        if (smData.pm_worktime1 != '' && smData.am_worktime2 != '')
          smData.pm_worktime = smData.pm_worktime1 + '-' + smData.pm_worktime2;
        smData.rest_time = [];
        if (this.form.rest_time.length > 0) {
          this.form.rest_time.forEach((item) => {
            if (item == '星期一') smData.rest_time.push(1);
            else if (item == '星期二') smData.rest_time.push(2);
            else if (item == '星期三') smData.rest_time.push(3);
            else if (item == '星期四') smData.rest_time.push(4);
            else if (item == '星期五') smData.rest_time.push(5);
            else if (item == '星期六') smData.rest_time.push(6);
            else if (item == '星期日') smData.rest_time.push(0);
          });
        }
        smData.rest_time = smData.rest_time.join(',');
        delete smData.data;
        delete smData.am_worktime1;
        delete smData.am_worktime2;
        delete smData.pm_worktime1;
        delete smData.pm_worktime2;
        if (this.form.bid == undefined || this.form.bid == '') {
          var url = this.api.goodsStore;
          var message = '发布商品成功！';
        }
        else {
          var url = this.api.goodsUpdate;
          var message = '编辑商品成功！';
        }
        if (this.form.goods_type == 1) {
          this.submitForm().then(() => {
            this.requsetPublish(url, smData, message);
          })
        } else {
          this.requsetPublish(url, smData, message);
        }
      },
      requsetPublish(url, smData, message) {
        const loading = this.$loading({
          lock: true,
          text: '正在发布商品，请稍候~~',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        this.api.request({
          url: url,
          method: "post",
          headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
          data: qs.stringify(smData)
        }).then((res) => {
          loading.close();
          if (res.data.state.code == 10200) {
            this.$message({
              type: 'success',
              message: message
            });
            this.allowPublish=true;
            this.$router.push({'path': '/mall/goodsManage'})
          } else {
            this.allowPublish=false;
            this.$message.error(res.data.state.msg);
            loading.close();
          }
        });
      }
    }
  }
</script>
<style lang="less">
  .linkp{
    cursor:pointer;
  }
  #goodEdit{
    color:#606266;
    padding-bottom:50px;
    background: #fff;
    font-size:12px;
    .ts{
      background: #F2F6FC;
      border-radius: 4px;
      padding: 20px;
      margin: 5px 0;
      box-sizing: border-box;
      font-size: 14px;
      width:640px;
    }
    .width118{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width:150px;
      display: block;
      position:relative;
      padding-right:25px;
      .el-icon-close{
        position: absolute;
        top:8px;
        right:5px;
      }
    }
    .el-button.is-circle {
      border-radius: 50%;
      padding: 5px;
      height:26px;
    }
    .alignCenter{
      text-align: center;
    }
    .el-table td {
      text-align: center;
    }
    .goods_imgs{
      .el-upload{
        display:none;
      }
    }
    .rules{
      padding-left:150px;
      margin:-50px 0px 20px;
    }
    .need{
      color:#f56c6c;
    }
    .width200{
      width:200px;
    }
    .textCenter{
      text-align: center;
    }
    td{
      word-break: break-all;
    }
    td .el-input{
      width:120px;
    }
    .list-group{
      display: inline-block;
    }
    td .el-form-item{
      margin:0px;
    }
    td .el-form-item__error{
      text-align: center;
      width:100%;
      position: static;
    }
    .attr-item{
      margin-bottom: 10px;
      .attr-val-item{
        text-align: center;
        display: inline-block;
        margin-bottom: 20px;
        margin-right:10px;
        vertical-align: top;
        &.w180{
          width: 150px;
        }
        .el-tag{
          margin-bottom: 10px;
        }
        .el-upload{
          border-radius:50%;
        }
        img{
          width:118px;
          height:118px;
          border:1px solid #ddd;
          border-radius:50%;
        }
        i.uploadBtn{
          width: 118px;
          height: 118px;
          border-radius: 50%;
          border: 1px solid #ddd;
          line-height: 118px;
        }
      }
      .clearfix2{
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        .el-button{
          display: none;
        }
        &:hover .el-button{
          display: inline-block;
        }
      }
    }
    .footerSubmit {
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
    .zent-title{
      color:#409EFF;
    }
    .attr-godds{
      position: relative;
      display: inline-block;
      .box-card{
        box-shadow: none;
      }
    }

    .el-popover{
      top:-100px;
      left:-50px;
    }
    .avatar-uploader .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      margin:0px;
      border:none;
      vertical-align: top;
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
  }

</style>
