<template>
    <div id="wxProgramDecoration" v-loading.fullscreen.lock="loading">
        <el-tabs type="border-card">
            <!-- 颜色风格 -->
            <el-tab-pane class="tab-pane flex" label="颜色风格" v-if="menue.indexOf('color')>-1">
                <!-- 预览 -->
                <div class="preview card-style">
                    <div :class="`preview-header ${wxColor.front_color=='#ffffff'?'preview-header-bg-white':'preview-header-bg-black'}`" :style="`background-color:${wxColor.background_color}`">
                        <div class="preview-header-title" :style="`color:${wxColor.front_color}`">颜色风格预览</div>
                    </div>
                    <div class="preview-body"></div>
                </div>
                <!-- 编辑 -->
                <div class="edit">
                    <el-form :model="wxColor" label-position="top" label-width="140px">
                        <el-form-item label="选择背景色:">
                            <el-color-picker v-model="wxColor.background_color" @active-change="changeColor"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="字体颜色:">
                            <el-radio-group v-model="wxColor.front_color">
                                <el-radio :label="'#ffffff'">白色</el-radio>
                                <el-radio :label="'#000000'">黑色</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-button style="width: 100px" type="primary" @click="uploadWxColor">保存</el-button>
                    </el-form>
                </div>
            </el-tab-pane>
            <!-- 首页轮播海报 -->
            <el-tab-pane class="tab-pane flex" label="首页轮播海报" v-if="menue.indexOf('slide')>-1">
                <!-- 预览 -->
                <div class="preview card-style">
                    <div :class="`preview-header ${wxColor.front_color=='#ffffff'?'preview-header-bg-model-white':'preview-header-bg-model-black'}`" :style="`background-color:${wxColor.background_color}`">
                        <div class="preview-header-title" :style="`color:${wxColor.front_color=='#ffffff'?'#4c4c4c':'#0f0f0f'}`">轮播海报预览</div>
                    </div>
                    <div class="preview-body">
                        <el-carousel height="211px">
                            <el-carousel-item v-for="item in carouselList" :key="item.id">
                                <img class="carouselSize" :src="'http://yimidemo.artqiyi.com'+item.url" width="375px" height="211px" />
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
                <!-- 编辑 -->
                <div class="edit">
                    <label for="uploadCarouselImage">
                        <div class="carousel-addnew flex card-style" v-if="carouselList.length<5">
                            <div class="left">
                                <div class="big-text">添加一个轮播海报</div>
                                <div>可对轮播图进行拖动排序</div>
                            </div>
                            <img src="../../../img/wxProgramDecoration/add_btn.png" width="80px" height="80px" />
                        </div>
                    </label>
                    <input type="file" id="uploadCarouselImage" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="getImg('carousel',$event)">
                    <draggable v-model="carouselList" @start="draggableStart('carouselList')" @update="draggableEnd('carouselList')">
                        <div class="edit-item flex card-style" v-for="(item,index) in carouselList" :key="item.id" :id="item.id" :target_id="item.target_id" @mouseenter="mouseHover(index,true)" @mouseleave="mouseHover(index,false)">
                            <img class="edit-img" :src="'http://yimidemo.artqiyi.com'+item.url" width="248px" height="140px" />
                            <div class="edit-function">
                                <div class="set-link flex">链接
                                    <el-dropdown class="set-link-dropdown" trigger="click" @command="selectLinkAddressType('carousel',$event)">
                                        <div class="dropdown-text flex">
                                            <span v-if="item.type==0">设置链接地址</span>
                                            <span v-else-if="item.type==1">视频</span>
                                            <span v-else-if="item.type==2">商品</span>
                                            <span v-else-if="item.type==3">企业名片</span>
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </div>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{type:1,item:item,index:index}">视频</el-dropdown-item>
                                            <el-dropdown-item :command="{type:2,item:item,index:index}">商品</el-dropdown-item>
                                            <el-dropdown-item :command="{type:3,item:item,index:index}">企业名片</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div class="reupload-img" @click="reGetImg(item,index,'uploadCarouselImage')">重新上传图片</div>
                            </div>
                            <img class="edit-delete" src="../../../img/wxProgramDecoration/delete.png" width="14px" height="14px" v-show="editDeleteShow&&index==editDeleteShowIndex" @click="deleteCarousel(item,index)" />
                            <div class="edit-index">{{index+1}}</div>
                        </div>
                    </draggable>
                </div>
            </el-tab-pane>
            <!-- 首页快捷导航 -->
            <el-tab-pane class="tab-pane flex" label="首页快捷导航" v-if="version.indexOf('商城小程序')>-1 && !menue.indexOf('navigation')>-1">
                <!-- 预览 -->
                <div class="preview card-style">
                    <div :class="`preview-header ${wxColor.front_color=='#ffffff'?'preview-header-bg-model-white':'preview-header-bg-model-black'}`" :style="`background-color:${wxColor.background_color}`">
                        <div class="preview-header-title" :style="`color:${wxColor.front_color=='#ffffff'?'#4c4c4c':'#0f0f0f'}`">快捷导航预览</div>
                    </div>
                    <div class="preview-body navigation-margin">
                        <div class="navigation-container flex">
                            <div class="item" v-for="item in navigationList" :key="item.id">
                                <img :src="'http://yimidemo.artqiyi.com'+item.url" />
                                <div class="text">{{item.text}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 编辑 -->
                <div class="edit">
                    <label for="uploadNavigationImage">
                        <div class="navigation-addnew flex card-style" v-if="navigationList.length<15">
                            <div class="left">
                                <div class="text1">添加一个导航入口</div>
                                <div class="text2">建议添加白色背景的图片</div>
                                <div>最多添加15个导航，拖动可排序</div>
                            </div>
                            <div class="right">
                                <img src="../../../img/wxProgramDecoration/add_btn.png" width="80px" height="80px" />
                                <div>({{navigationList.length}}/15)</div>
                            </div>
                        </div>
                    </label>
                    <input type="file" id="uploadNavigationImage" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="getImg('navigation',$event)">
                    <draggable v-model="navigationList" @start="draggableStart('navigationList')" @update="draggableEnd('navigationList')">
                        <div class="edit-item flex card-style" v-for="(item,index) in navigationList" :key="item.id" :id="item.id" :target_id="item.target_id" @mouseenter="mouseHover(index,true)" @mouseleave="mouseHover(index,false)">
                            <img class="edit-img" :src="'http://yimidemo.artqiyi.com'+item.url" width="132px" height="132px" />
                            <div class="edit-function edit-function-navigation">
                                <div class="set-title flex">标题<el-input v-model="item.text" maxlength="4" clearable @focus="inputNavigationTitleFocus" @blur="inputNavigationTitleBlur(item)" @keyup.enter.native="$event.target.blur"></el-input></div>
                                <div class="set-link flex">链接
                                    <el-dropdown class="set-link-dropdown" trigger="click" @command="selectLinkAddressType('navigation',$event)">
                                        <div class="dropdown-text flex">
                                            <span v-if="item.type==0">设置链接地址</span>
                                            <span v-else-if="item.type==1">视频</span>
                                            <span v-else-if="item.type==2">商品</span>
                                            <span v-else-if="item.type==3">企业名片</span>
                                            <span v-else-if="item.type==4">商品分组</span>
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </div>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{type:1,item:item,index:index}">视频</el-dropdown-item>
                                            <el-dropdown-item :command="{type:2,item:item,index:index}">商品</el-dropdown-item>
                                            <el-dropdown-item :command="{type:3,item:item,index:index}">企业名片</el-dropdown-item>
                                            <el-dropdown-item :command="{type:4,item:item,index:index}">商品分组</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div class="reupload-img" @click="reGetImg(item,index,'uploadNavigationImage')">重新上传图片</div>
                            </div>
                            <img class="edit-delete" src="../../../img/wxProgramDecoration/delete.png" width="14px" height="14px" v-show="editDeleteShow&&index==editDeleteShowIndex" @click="deleteNavigation(item,index)" />
                            <div class="edit-index">{{index+1}}</div>
                        </div>
                    </draggable>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--图片裁剪窗口-->
        <el-card class="cropper" :body-style="{ padding: '0px' }" v-if="cropperShow">
            <div slot="header">图片裁剪</div>
            <div class="cropper-body">
                <vueCropper ref="cropper" :img="cropper.img" :outputSize="cropper.size" :outputType="cropper.outputType" :info="cropper.info" :canScale="cropper.canScale" :autoCrop="cropper.autoCrop" :autoCropWidth="cropper.autoCropWidth" :autoCropHeight="cropper.autoCropHeight" :fixed="cropper.fixed" :fixedNumber="cropper.fixedNumber" :canMove="cropper.canMove"></vueCropper>
            </div>
            <div class="cropper-footer">
                <el-button type="text" @click="uploadImgCancel">取消</el-button>
                <el-button type="primary" size="medium" @click="uploadImg" :loading="cropperBtnLoading">确认</el-button>
            </div>
        </el-card>
        <!--选择链接地址窗口-->
        <div class="choose-link-address-model" v-if="chooseLinkAddressShow" @click.self="chooseLinkAddressShow=false">
            <el-tabs class="choose-link-address" type="border-card">
                <!-- 视频 -->
                <el-tab-pane label="视频" v-if="linkAddressCommand.type == 1">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('videoInfo', -1, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.videoInfo.list" :key="item.id">
                            <div class="link-image" style="width: 130px;height: 100px;display: flex;justify-content: center;">
                                <img :src="item.cover" style="max-width: 130px;max-height: 100px;" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.title}}</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.videoInfo.list.length && !linkAddressInfo.videoInfo.has_next">已经没有更多的视频喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.videoInfo.list.length && !linkAddressInfo.videoInfo.has_next">您还没有添加视频哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.videoInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 实物商品 -->
                <el-tab-pane label="实物商品" v-if="linkAddressCommand.type == 2 && permissionFun(0) && (version.indexOf('商城小程序')>-1 || version.indexOf('健康美业小程序')>-1)">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('goodsInfo', 1, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.goodsInfo.list" :key="item.id">
                            <div class="link-image">
                                <img :src="item.image" width="100px" height="100px" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.goods_name}}</div>
                                <div>价格：¥{{item.price}}</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.goodsInfo.list.length && !linkAddressInfo.goodsInfo.has_next">已经没有更多的商品喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.goodsInfo.list.length && !linkAddressInfo.goodsInfo.has_next">您还没有添加商品哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.goodsInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 虚拟商品 -->
                <el-tab-pane label="虚拟商品" v-if="linkAddressCommand.type == 2 && ((permissionFun(1) && (version.indexOf('商城小程序')>-1 || version.indexOf('健康美业小程序')>-1)) || (permissionFun(4) && version.indexOf('社保服务小程序')>-1))">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('virtualGoodsInfo', 2, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.virtualGoodsInfo.list" :key="item.id">
                            <div class="link-image">
                                <img :src="item.image" width="100px" height="100px" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.goods_name}}</div>
                                <div>价格：¥{{item.price}}</div>
                                <div>销量：{{item.sale_num}}</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.virtualGoodsInfo.list.length && !linkAddressInfo.virtualGoodsInfo.has_next">已经没有更多的商品喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.virtualGoodsInfo.list.length && !linkAddressInfo.virtualGoodsInfo.has_next">您还没有添加商品哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.virtualGoodsInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 在线咨询 -->
                <el-tab-pane label="在线咨询" v-if="linkAddressCommand.type == 2 && permissionFun(2) && ((version.indexOf('商城小程序')>-1 && !(!userinfo.sync_flag && userinfo.is_sub_shop)) || version.indexOf('健康美业小程序')>-1 || version.indexOf('社保服务小程序')>-1)">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('consultInfo', 3, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.consultInfo.list" :key="item.id">
                            <div class="link-image">
                                <img :src="item.image" width="100px" height="100px" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.goods_name}}</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.consultInfo.list.length && !linkAddressInfo.consultInfo.has_next">已经没有更多的商品喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.consultInfo.list.length && !linkAddressInfo.consultInfo.has_next">您还没有添加商品哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.consultInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 在线预约 -->
                <el-tab-pane label="在线预约" v-if="linkAddressCommand.type == 2 && permissionFun(3) && version.indexOf('健康美业小程序')>-1">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('subscribeInfo', 4, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.subscribeInfo.list" :key="item.id">
                            <div class="link-image">
                                <img :src="item.image" width="100px" height="100px" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.goods_name}}</div>
                                <div>{{item.desc}}</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.subscribeInfo.list.length && !linkAddressInfo.subscribeInfo.has_next">已经没有更多的商品喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.subscribeInfo.list.length && !linkAddressInfo.subscribeInfo.has_next">您还没有添加商品哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.subscribeInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 社保商品 -->
                <el-tab-pane label="社保商品" v-if="linkAddressCommand.type == 2 && permissionFun(4) && version.indexOf('社保服务小程序')>-1">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('socialSecurityInfo', 5, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.socialSecurityInfo.list" :key="item.id">
                            <div class="link-image">
                                <img :src="item.image" width="100px" height="100px" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.goods_name}}</div>
                                <div>服务费¥{{item.price}}起</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.socialSecurityInfo.list.length && !linkAddressInfo.socialSecurityInfo.has_next">已经没有更多的商品喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.socialSecurityInfo.list.length && !linkAddressInfo.socialSecurityInfo.has_next">您还没有添加商品哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.socialSecurityInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 服务套餐 -->
                <el-tab-pane label="服务套餐" v-if="linkAddressCommand.type == 2 && permissionFun(5) && version.indexOf('健康美业小程序')>-1">
                    <div class="choose-link-address-container" @scroll.passive="onLinkAddressScroll('servicePackagesInfo', 17, $event)">
                        <div class="link-section flex" v-for="item in linkAddressInfo.servicePackagesInfo.list" :key="item.id">
                            <div class="link-image">
                                <img :src="item.image" width="100px" height="100px" />
                                <div class="main-store" v-if="item.is_custom==6">总店</div>
                            </div>
                            <div class="link-content">
                                <div>{{item.goods_name}}</div>
                                <div>服务费¥{{item.price}}起</div>
                            </div>
                            <el-radio v-model="linkAddressRadio" :label="item" />
                        </div>
                        <div class="tip" v-if="linkAddressInfo.servicePackagesInfo.list.length && !linkAddressInfo.servicePackagesInfo.has_next">已经没有更多的商品喽！！</div>
                        <div class="tip" v-else-if="!linkAddressInfo.servicePackagesInfo.list.length && !linkAddressInfo.servicePackagesInfo.has_next">您还没有添加商品哦~</div>
                        <div class="tip" v-else-if="linkAddressInfo.servicePackagesInfo.loading">正在加载请稍等~</div>
                    </div>
                    <div class="choose-link-address-footer flex">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="whoSetLinkAddress=='carousel'?confirmCarouselLinkAddress():confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
                <!-- 商品分组 -->
                <el-tab-pane v-if="linkAddressCommand.type==4" label="商品分组">
                    <div style="width: 600px;height: 590px;overflow: auto;">
                        <div class="group-list-title flex">
                            <div>分组名称</div>
                            <div>商品数量</div>
                            <div>创建时间</div>
                        </div>
                        <div class="group-list-section" v-for="item1 in linkAddressInfo.goodsGroupInfo.list" :key="item1.id">
                            <div class="item flex">
                                <div class="group-name flex">
                                    <el-radio style="height: 12px;margin-right: 8px;" v-model="linkAddressRadio" :label="item1" />
                                    <div>{{item1.name}}</div>
                                </div>
                                <div class="goods-num">{{item1.goods_num}}</div>
                                <div class="createtime">{{item1.createtime}}</div>
                            </div>
                            <div class="item flex" v-for="item2 in item1.child" :key="item2.id">
                                <div class="group-name flex">
                                    <el-radio style="height: 16px;margin-right: 38px;" v-model="linkAddressRadio" :label="item2" />
                                    <div>{{item2.name}}</div>
                                </div>
                                <div class="goods-num">{{item2.goods_num}}</div>
                                <div class="createtime">{{item2.createtime}}</div>
                            </div>
                        </div>
                        <div style="text-align: center;" v-if="!linkAddressInfo.goodsGroupInfo.list.length">您还没有商品分组哦~</div>
                    </div>
                    <div style="float: right; padding: 5px 7px">
                        <el-button type="text" @click="chooseLinkAddressShow=false">取消</el-button>
                        <el-button type="primary" size="medium" @click="confirmNavigationLinkAddress()">确认</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable';
    import vueCropper from 'vue-cropper';
    import qs from 'qs';
    export default {
        components: {
            draggable,
            vueCropper,
            qs
        },
        data() {
            return {
                loading: true,
                wxColor: {},
                carouselList: [],
                oldCarouselList: [],
                navigationList: [],
                oldNavigationList: [],
                editDeleteShow: false,
                editDeleteShowIndex: -1,
                cropper: {
                    img: '',
                    info: true,
                    size: 1,
                    outputType: 'jpeg',
                    canScale: false,
                    autoCrop: true,
                    // 只有自动截图开启 宽度高度才生效
                    autoCropWidth: 750,
                    autoCropHeight: 422,
                    // 开启宽度和高度比例
                    fixed: true,
                    fixedNumber: [750, 422],
                    canMove: false
                },
                cropperShow: false,
                cropperBtnLoading: false,
                reUploadTrue: false,
                uploadImgType: '',
                inputNavigationTitleValue: '',
                chooseLinkAddressShow: false,
                linkAddressCommand: {},
                linkAddressInfo: {
                    videoInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    goodsInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    virtualGoodsInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    consultInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    subscribeInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    socialSecurityInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    servicePackagesInfo: {
                        list: [],
                        page: 1,
                        has_next: true,
                        loading: false
                    },
                    goodsGroupInfo: {
                        list: []
                    }
                },
                linkAddressRadio: {},
                whoSetLinkAddress: '',
                permission: false,
                menue: '',
                version: '',
                userinfo: ''
            }
        },
        created() {
            // 权限permission
            JSON.parse(sessionStorage.getItem('permission')).forEach(item => {
                if (item == 3) {
                    this.permission = true;
                }
            });
            // 菜单级权限menue
            let menue = JSON.parse(sessionStorage.getItem('menue'));
            const wx_menu = menue.filter(x => x.index === '/wxProgram')[0];
            if (wx_menu) {
                const wx_sub_menu = wx_menu.subs.filter(y => y.title === '微信小程序装修')[0];
                if (wx_sub_menu) {
                    this.menue = wx_sub_menu.options.join(",");
                    // this.activeName = wx_sub_menu.options[0];
                }
            }
            // 设置服务套餐，美业专属
            this.version = sessionStorage.getItem('version');
            // 2018/2/2新发现的userinfo权限
            this.userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        },
        mounted() {
            // 获取颜色风格 // 首页轮播海报 // 首页快捷导航
            Promise.all([this.getWxColor(), this.getCarouselList(), this.getNavigationList()]).then((results) => {
                this.loading = false;
            });
        },
        methods: {
            //权限控制
            permissionFun(index) {
                if (this.permission) {
                    if (index == 2 || index == 4) return true;
                } else {
                    if (index != 4) return true;
                }
            },
            // 颜色风格================================================================================================================================
            // 获取颜色风格
            getWxColor() {
                return new Promise((resolve, reject) => {
                    this.api.request({
                        url: this.api.business_applet_config + '?act=11'
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            this.wxColor = res.data.data;
                            resolve();
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                    }).catch(err => {
                        console.log('获取颜色风格请求失败', err);
                    });
                })
            },
            // 选择颜色
            changeColor(color) {
                this.wxColor.background_color = this.rgbToHex(color);
            },
            // 提交保存颜色风格
            uploadWxColor() {
                this.api.request({
                    url: this.api.save_applet_config,
                    data: {
                        act: 11,
                        background_color: this.wxColor.background_color,
                        front_color: this.wxColor.front_color
                    },
                    method: 'post'
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this.$message.error(err);
                });
            },
            // RGB转16进制
            rgbToHex(color) {
                let rgb = color.split(',');
                let r = parseInt(rgb[0].split('(')[1]);
                let g = parseInt(rgb[1]);
                let b = parseInt(rgb[2].split(')')[0]);
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            },
            // 轮播海报========================================================================================================
            // 获取首页轮播海报
            getCarouselList() {
                return new Promise((resolve, reject) => {
                    this.api.request({
                        url: this.api.get_slideshow + '?act=11'
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            this.carouselList = res.data.data;
                            resolve();
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                    }).catch(err => {
                        console.log('获取首页轮播海报请求失败', err);
                    });
                })
            },
            // 删除轮播图
            deleteCarousel(item, index) {
                this.api.request({
                    url: this.api.del_slideshow,
                    data: {
                        act: 11,
                        id: item.id
                    },
                    method: 'post'
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.carouselList.splice(index, 1);
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10400) {
                        this.$message.error(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            // 新增轮播图(最后一步)
            addCarousel(imgUrl) {
                this.api.request({
                    url: this.api.save_slideshow,
                    data: {
                        act: 11,
                        url: imgUrl
                    },
                    method: 'post',
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.carouselList.unshift({
                            goods_type: '',
                            id: res.data.data.id,
                            target_id: 0,
                            type: 0,
                            url: imgUrl
                        });
                        // 这么做是为了应对element轮播图组件不更新的bug(正常情况下该代码不需要){
                        let temporaryArray = this.carouselList;
                        this.carouselList = [];
                        setTimeout(() => {
                            this.carouselList = temporaryArray;
                        }, 0);
                        // }
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                    this.cropperBtnLoading = false;
                    this.uploadImgCancel();
                }).catch(err => {
                    this.cropperBtnLoading = false;
                    this.uploadImgCancel();
                    this.$message.error(err);
                })
            },
            // 确认设置链接地址(最后一步)
            confirmCarouselLinkAddress() {
                if (this.linkAddressCommand.type == 1 && !this.linkAddressRadio) {
                    return this.$message.error('请先勾选视频链接！');
                } else if (this.linkAddressCommand.type == 2 && !this.linkAddressRadio.goods_id) {
                    return this.$message.error('请先勾选链接！');
                }
                let requestData = {
                    act: 11,
                    id: this.linkAddressCommand.item.id,
                    url: this.linkAddressCommand.item.url,
                    type: this.linkAddressCommand.type,
                    target_id: this.linkAddressRadio.id || 0,
                    is_groupon: this.linkAddressRadio.is_groupon,
                };
                if (this.linkAddressCommand.type == 2) {
                    requestData.target_id = this.linkAddressRadio.goods_id;
                    requestData.goods_type = this.linkAddressRadio.type;
                } else if (this.linkAddressCommand.type == 3) {
                    requestData.target_id = 0;
                    requestData.goods_type = '';
                }
                this.api.request({
                    url: this.api.save_slideshow,
                    data: requestData,
                    method: 'post',
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.getCarouselList();
                        this.linkAddressRadio = {};
                        this.chooseLinkAddressShow = false;
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            // 快捷导航======================================================================================================================================
            // 获取首页快捷导航
            getNavigationList() {
                return new Promise((resolve, reject) => {
                    this.api.request({
                        url: this.api.get_navigation
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            this.navigationList = res.data.data;
                            resolve();
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                    }).catch(err => {
                        console.log('获取首页快捷导航请求失败', err);
                    });
                })
            },
            // 删除快捷导航
            deleteNavigation(item, index) {
                this.api.request({
                    url: this.api.del_navigation,
                    data: {
                        id: item.id
                    },
                    method: 'post'
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.navigationList.splice(index, 1);
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10400) {
                        this.$message.error(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            // 新增快捷导航(最后一步)
            addNavigation(imgUrl) {
                this.api.request({
                    url: this.api.save_navigation,
                    data: {
                        act: 11,
                        url: imgUrl,
                        text: '默认文字'
                    },
                    method: 'post',
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.navigationList.unshift({
                            goods_type: '',
                            id: res.data.data.id,
                            target_id: 0,
                            type: 0,
                            url: imgUrl,
                            text: '默认文字'
                        });
                        this.cropperBtnLoading = false;
                        this.uploadImgCancel();
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                    this.cropperBtnLoading = false;
                    this.uploadImgCancel();
                }).catch(err => {
                    this.cropperBtnLoading = false;
                    this.uploadImgCancel();
                    this.$message.error(err);
                })
            },
            // 快捷导航标题输入框获得焦点
            inputNavigationTitleFocus(event) {
                this.inputNavigationTitleValue = event.target.value;
            },
            // 快捷导航标题输入框失去焦点
            inputNavigationTitleBlur(item) {
                if (item.text == this.inputNavigationTitleValue) {
                    return;
                } else if (item.text == '') {
                    return this.$message.error('导航文字不能为空');
                } else if (item.text.length > 4) {
                    return this.$message.error('导航文字最多4位');
                }
                this.api.request({
                    url: this.api.save_navigation,
                    data: {
                        id: item.id,
                        url: item.url,
                        type: item.type,
                        target_id: item.target_id,
                        goods_type: item.goods_type,
                        text: item.text
                    },
                    method: 'post',
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            // 确认设置链接地址(最后一步)
            confirmNavigationLinkAddress() {
                if (this.linkAddressCommand.type == 1 && !this.linkAddressRadio) {
                    return this.$message.error('请先勾选视频链接！');
                } else if (this.linkAddressCommand.type == 2 && !this.linkAddressRadio.goods_id) {
                    return this.$message.error('请先勾选链接！');
                }
                let requestData = {
                    id: this.linkAddressCommand.item.id,
                    url: this.linkAddressCommand.item.url,
                    type: this.linkAddressCommand.type,
                    target_id: this.linkAddressRadio.id,
                    text: this.linkAddressCommand.item.text
                };
                if (this.linkAddressCommand.type == 2) {
                    requestData.target_id = this.linkAddressRadio.goods_id;
                    requestData.goods_type = this.linkAddressRadio.type;
                } else if (this.linkAddressCommand.type == 3) {
                    requestData.target_id = 0;
                    requestData.goods_type = '';
                }
                this.api.request({
                    url: this.api.save_navigation,
                    data: requestData,
                    method: 'post',
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        this.getNavigationList();
                        this.linkAddressRadio = {};
                        this.chooseLinkAddressShow = false;
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            // 公共=================================================================================================================================
            //拖动排序开始
            draggableStart(whichList) {
                if (whichList == 'carouselList') {
                    this.oldCarouselList = this.carouselList;
                } else if (whichList == 'navigationList') {
                    this.oldNavigationList = this.navigationList;
                }
            },
            //拖动排序结束
            draggableEnd(whichList) {
                let IdList = '',
                    url = this.api.sort_slideshow,
                    oldList = this.oldCarouselList;
                if (whichList == 'navigationList') {
                    url = this.api.sort_navigation;
                    oldList = this.oldNavigationList;
                }
                this[whichList].map(item => {
                    IdList += "," + item.id;
                })
                this.api.request({
                    url: url,
                    data: {
                        act: 11,
                        sort_ids: IdList.substr(1),
                    },
                    method: 'post'
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        // 这么做是为了应对element轮播图组件不更新的bug(正常情况下该代码不需要){
                        if (whichList == 'carouselList') {
                            let temporaryArray = this.carouselList;
                            this.carouselList = [];
                            setTimeout(() => {
                                this.carouselList = temporaryArray;
                            }, 0);
                        }
                        // }
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10400) {
                        this[whichList] = oldList;
                        this.$message.error(res.data.state.msg);
                    }
                }).catch(err => {
                    this[whichList] = oldList;
                    this.$message.error('网络错误，操作失败，请重试！');
                    console.log('排序请求失败', err);
                })
            },
            // 鼠标悬停显示删除按钮
            mouseHover(index, mouseEvent) {
                this.editDeleteShowIndex = index;
                this.editDeleteShow = mouseEvent;
            },
            // 点击新增轮播图——>选择图片——>预处理图片和初始化裁剪框
            getImg(type, event) {
                let imageFile = event.target.files[0];
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(event.target.value)) {
                    this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
                    return;
                }
                if (imageFile.size > 2000000) {
                    this.$message.error('图片过大，图片大小限制为2M');
                    return;
                }
                this.uploadImgType = type;
                let fileReader = new FileReader();
                fileReader.onload = (file) => {
                    let data = file.target.result;
                    if (typeof file.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([file.target.result]))
                    }
                    //图片预加载，获取宽度高度
                    let img = new Image();
                    img.onload = () => {
                        img.onload = null;
                        if (type == 'carousel') {
                            this.cropper.fixedNumber = [750, 422];
                            if (img.width / img.height >= 750 / 422) {
                                this.$refs.cropper.scale = 750 / img.width; //（放大倍数）把不能填满窗口的小图片放大
                                this.cropper.autoCropWidth = (img.height * 750 / 422) * (750 / img.width);
                            } else {
                                this.$refs.cropper.scale = 422 / img.height; //（放大倍数）把不能填满窗口的小图片放大
                                this.cropper.autoCropWidth = img.width * (422 / img.height);
                            }
                        } else if (type == 'navigation') {
                            this.cropper.fixedNumber = [1, 1];
                            if (img.width / img.height > 1) {
                                this.$refs.cropper.scale = 750 / img.width; //（放大倍数）把不能填满窗口的小图片放大
                                this.cropper.autoCropWidth = img.height * (750 / img.width);
                            } else {
                                this.$refs.cropper.scale = 422 / img.height; //（放大倍数）把不能填满窗口的小图片放大
                                this.cropper.autoCropWidth = img.width * (422 / img.height);
                            }
                        }
                    };
                    img.onerror = () => {
                        this.$message.error('图片加载失败');
                    };
                    img.src = data;
                    this.cropper.img = data;
                    this.cropperShow = true;
                };
                fileReader.readAsDataURL(imageFile);
            },
            // 图片裁剪取消
            uploadImgCancel() {
                if (document.getElementById("uploadCarouselImage")) document.getElementById("uploadCarouselImage").value = '';
                if (document.getElementById("uploadNavigationImage")) document.getElementById("uploadNavigationImage").value = '';
                this.cropperBtnLoading = false;
                this.reUploadTrue = false;
                this.cropperShow = false;
            },
            // 图片裁剪确认
            uploadImg() {
                this.cropperBtnLoading = true;
                this.$refs.cropper.getCropData((ImgData) => {
                    this.api.request({
                        url: this.api.upload_data_img,
                        data: qs.stringify({
                            data: ImgData,
                            path_code: 17
                        }),
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        }
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            if (this.reUploadTrue == false) {
                                if (this.uploadImgType == 'carousel') {
                                    this.addCarousel(res.data.data);
                                } else if (this.uploadImgType == 'navigation') {
                                    this.addNavigation(res.data.data);
                                }
                            } else if (this.reUploadTrue == true) {
                                this.reUploadImg(res.data.data, this.uploadImgType);
                            }
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                    }).catch(err => {
                        this.$message.error(err);
                    })
                })
            },
            // 重新上传图片按钮被点击
            reGetImg(item, index, inputFileId) {
                this.reUploadTrue = true;
                this.reUploadItem = item;
                this.reUploadIndex = index;
                document.getElementById(inputFileId).click();
            },
            // 重新上传图片(最后一步)
            reUploadImg(imgUrl, type) {
                let url = this.api.save_slideshow,
                    data = {
                        id: this.reUploadItem.id,
                        url: imgUrl,
                        type: this.reUploadItem.type,
                        target_id: this.reUploadItem.target_id,
                        goods_type: this.reUploadItem.goods_type
                    };
                if (type == 'navigation') {
                    url = this.api.save_navigation;
                    data.text = this.reUploadItem.text;
                }
                this.api.request({
                    url: url,
                    data: data,
                    method: 'post',
                }).then(res => {
                    if (res.data.state.code == 10200) {
                        if (type == 'carousel') {
                            this.carouselList[this.reUploadIndex].url = imgUrl;
                        } else if (type == 'navigation') {
                            this.navigationList[this.reUploadIndex].url = imgUrl;
                        }
                        this.$message.success(res.data.state.msg);
                    } else if (res.data.state.code == 10401) {
                        this.$message.error(res.data.state.msg);
                    }
                    this.cropperBtnLoading = false;
                    this.uploadImgCancel();
                }).catch(err => {
                    this.cropperBtnLoading = false;
                    this.uploadImgCancel();
                    this.$message.error(err);
                })
            },
            // 选择链接地址下拉框中某项被选中
            selectLinkAddressType(who, command) {
                this.whoSetLinkAddress = who;
                this.linkAddressCommand = command;
                this.loading = true;
                if (command.type == 1) { // 选择设置视频链接
                    // 获取视频第一页初始数据
                    this.api.request({
                        url: this.api.anchor_short_video,
                        data: {
                            act: 11,
                            page: 1,
                            from_time: '',
                            end_time: '',
                            status: '',
                            title: ''
                        },
                        method: 'post'
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            this.linkAddressInfo.videoInfo.page = 2;
                            this.linkAddressInfo.videoInfo.list = res.data.data.list;
                            this.linkAddressInfo.videoInfo.has_next = res.data.data.has_next;
                            this.linkAddressRadio = this.linkAddressInfo.videoInfo.list.filter(item => item.id == this.linkAddressCommand.item.target_id)[0];
                            this.chooseLinkAddressShow = true;
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                        this.loading = false;
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error(err);
                    })
                } else if (command.type == 2) { // 选择设置商品链接
                    Promise.all([this.getGoodsData(this.linkAddressInfo.goodsInfo.page, 1, 'goodsInfo'),
                        this.getGoodsData(this.linkAddressInfo.virtualGoodsInfo.page, 2, 'virtualGoodsInfo'),
                        this.getGoodsData(this.linkAddressInfo.consultInfo.page, 3, 'consultInfo'),
                        this.getGoodsData(this.linkAddressInfo.subscribeInfo.page, 4, 'subscribeInfo'),
                        this.getGoodsData(this.linkAddressInfo.socialSecurityInfo.page, 5, 'socialSecurityInfo'),
                        this.getGoodsData(this.linkAddressInfo.servicePackagesInfo.page, 17, 'servicePackagesInfo')
                    ]).then((results) => {
                        this.loading = false;
                        this.chooseLinkAddressShow = true;
                    });
                } else if (command.type == 3) { // 选择设置企业名片链接
                    if (who == 'carousel') {
                        this.confirmCarouselLinkAddress();
                    } else if (who == 'navigation') {
                        this.confirmNavigationLinkAddress();
                    }
                    this.loading = false;
                } else if (command.type == 4) { // 选择设置商品分组链接
                    let buid = sessionStorage.getItem('curuid');
                    this.api.request({
                        url: `${this.api.goods_group_data}?buid=${buid}`
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            this.linkAddressInfo.goodsGroupInfo.list = res.data.data;
                            res.data.data.forEach(item1 => {
                                if (item1.id == this.linkAddressCommand.item.target_id) {
                                    this.linkAddressRadio = item1;
                                } else {
                                    item1.child.forEach(item2 => {
                                        if (item2.id == this.linkAddressCommand.item.target_id) {
                                            this.linkAddressRadio = item2;
                                        }
                                    })
                                }
                            })
                            this.chooseLinkAddressShow = true;
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                        this.loading = false;
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error(err);
                    })
                }
            },
            // 获取商品第一页初始数据
            getGoodsData(page, goods_type, dataSetType) {
                return new Promise((resolve, reject) => {
                    this.api.request({
                        url: `${this.api.goods_list}?act=11&page=1&goods_type=${goods_type}`
                    }).then(res => {
                        if (res.data.state.code == 10200) {
                            this.linkAddressInfo[dataSetType].list = res.data.data.list;
                            this.linkAddressInfo[dataSetType].page = 2;
                            this.linkAddressInfo[dataSetType].has_next = res.data.data.has_next;
                            this.linkAddressInfo[dataSetType].list.forEach(item => {
                                if (item.goods_id == this.linkAddressCommand.item.target_id) {
                                    this.linkAddressRadio = item;
                                }
                            })
                            resolve();
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                    }).catch(err => {
                        this.$message.error(err);
                    })
                })
            },
            // 滚动加载
            onLinkAddressScroll(dataSetType, goods_type, event) {
                let scrollTop, offsetHeight, scrollHeight;
                if (event.srcElement != undefined) {
                    scrollTop = event.srcElement.scrollTop;
                    offsetHeight = event.srcElement.offsetHeight;
                    scrollHeight = event.srcElement.scrollHeight;
                } else {
                    //解决火狐不兼容srcElement
                    scrollTop = event.target.scrollTop;
                    offsetHeight = event.target.offsetHeight;
                    scrollHeight = event.target.scrollHeight;
                }
                let requestData = {
                    url: `${this.api.goods_list}?act=11&page=${this.linkAddressInfo[dataSetType].page}&goods_type=${goods_type}`
                }
                if (dataSetType == 'videoInfo') {
                    requestData = {
                        url: this.api.anchor_short_video,
                        data: {
                            act: 11,
                            page: this.linkAddressInfo.videoInfo.page,
                            from_time: '',
                            end_time: '',
                            status: '',
                            title: ''
                        },
                        method: 'post'
                    }
                }
                if (scrollTop + offsetHeight >= scrollHeight && this.linkAddressInfo[dataSetType].has_next) {
                    this.api.request(requestData).then(res => {
                        if (res.data.state.code == 10200) {
                            this.linkAddressInfo[dataSetType].list = this.linkAddressInfo[dataSetType].list.concat(res.data.data.list);
                            this.linkAddressInfo[dataSetType].page++;
                            this.linkAddressInfo[dataSetType].has_next = res.data.data.has_next;
                            const filterRadio = this.linkAddressInfo[dataSetType].list.filter(item => (item.goods_id == this.linkAddressCommand.item.target_id || item.id == this.linkAddressCommand.item.target_id))[0];
                            if (filterRadio) this.linkAddressRadio = filterRadio;
                        } else if (res.data.state.code == 10401) {
                            this.$message.error(res.data.state.msg);
                        }
                    }).catch(err => {
                        this.$message.error(err);
                    })
                }
            }
        }
    }
</script>
<style lang="less">
    .card-style {
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }
    #wxProgramDecoration {
        // 选择链接地址窗口
        .choose-link-address-model {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: 0;
            background: rgba(0, 0, 0, .6);
            z-index: 2003;
            .choose-link-address {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 10px;
                overflow: hidden;
                .choose-link-address-container {
                    width: 600px;
                    height: 500px;
                    overflow: auto;
                    .link-section {
                        height: 100px;
                        margin: 15px;
                        .link-image {
                            width: 100px;
                            height: 100px;
                            background: black;
                            position: relative;
                            .main-store {
                                position: absolute;
                                right: 4px;
                                bottom: 4px;
                                font-size: 10px;
                                color: #fff;
                                line-height: 1;
                                padding: 4px 8px;
                                border-radius: 2px;
                                background: rgba(0, 0, 0, .5);
                            }
                        }
                        .link-content {
                            width: 400px;
                            overflow: hidden;
                            margin: 0 15px;
                            flex: 1;
                            &>div {
                                margin: 5px 0;
                                word-break: break-all;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                white-space: pre-wrap;
                            }
                        }
                    }
                    .tip {
                        text-align: center;
                    }
                }
                .choose-link-address-footer {
                    height: 50px;
                    justify-content: flex-end;
                    padding-right: 7px;
                }
                .el-tabs__content {
                    padding: 0;
                }
                .el-radio__label {
                    display: none;
                }
                .group-list-title{
                    width: 100%;
                    height: 50px;
                    border-top: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                    background: #fafafa;
                    font-size: 16px;
                    color: #333;
                    justify-content: space-between;
                    padding: 0 20px;
                    box-sizing: border-box;
                }
                .group-list-section {
                    border-bottom: 1px solid #ccc;
                    .item {
                        height: 56px;
                        background: #fff;
                        padding: 0 20px;
                        font-size: 16px;
                        color: #666;
                        .group-name {
                            width: 275px;
                        }
                        .goods-num {
                            width: 200px;
                        }
                    }
                }
            }
        }
        .tab-pane {
            align-items: flex-start;
            .preview {
                width: 375px;
                min-width: 375px;
                // 轮播图下面的切换按钮宽度
                .el-carousel__indicators {
                    text-align: center;
                    width: 300px;
                }
                .preview-header {
                    width: 100%;
                    height: 64px;
                    .preview-header-title {
                        padding-top: 28px;
                        font-size: 18px;
                        letter-spacing: 2px;
                        text-align: center;
                    }
                }
                .preview-header-bg-white {
                    background-image: url('../../../img/wxProgramDecoration/head_preview_white.png');
                }
                .preview-header-bg-black {
                    background-image: url('../../../img/wxProgramDecoration/head_preview_black.png');
                }
                .preview-header-bg-model-white {
                    background-image: url('../../../img/wxProgramDecoration/head_preview_white_model.png');
                }
                .preview-header-bg-model-black {
                    background-image: url('../../../img/wxProgramDecoration/head_preview_black_model.png');
                }
                .preview-body {
                    width: 100%;
                    height: 603px;
                    background-image: url('../../../img/wxProgramDecoration/carouselBody.png');
                    .navigation-container {
                        width: 100%;
                        background: #fff;
                        flex-wrap: wrap;
                        .item {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            width: 75px;
                            height: 88px;
                            img {
                                width: 43px;
                                height: 43px;
                                margin: 11px 0 5px;
                            }
                            .text {
                                color: #666;
                                font-size: 14px;
                                line-height: 20px;
                            }
                        }
                    }
                    &.navigation-margin {
                        box-sizing: border-box;
                        padding-top: 211px;
                    }
                }
            }
            .edit {
                margin-left: 100px;
                .carousel-addnew {
                    width: 556px;
                    height: 180px;
                    background: #89C3F8;
                    color: #fff;
                    font-size: 14px;
                    line-height: 1;
                    .left {
                        margin: 0 130px 0 60px;
                        .big-text {
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                    }
                }
                .navigation-addnew {
                    width: 462px;
                    height: 172px;
                    background: #89C3F8;
                    color: #fff;
                    font-size: 14px;
                    line-height: 1;
                    .left {
                        margin: 0 110px 0 40px;
                        .text1 {
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .text2 {
                            margin-bottom: 20px;
                        }
                    }
                    .right {
                        flex-direction: column;
                        text-align: center;
                        margin-top: 26px;
                        img {
                            margin-bottom: 10px;
                        }
                    }
                }
                .edit-item {
                    margin-top: 20px;
                    line-height: 1;
                    position: relative;
                    .edit-img {
                        margin: 20px;
                    }
                    .edit-function {
                        margin-right: 20px;
                        font-size: 16px;
                        color: #333;
                        &.edit-function-navigation {
                            margin-right: 42px;
                        }
                        .set-title {
                            // 标题
                            .el-input {
                                width: 200px;
                                margin-left: 16px;
                            }
                            .el-input__inner {
                                height: 32px;
                                font-size: 12px;
                                color: #999;
                                padding: 0 12px;
                            }
                        }
                        .set-link {
                            margin-top: 10px;
                            .set-link-dropdown {
                                width: 200px;
                                height: 32px;
                                margin-left: 16px;
                                box-sizing: border-box;
                                border-radius: 4px;
                                border: 1px solid #DCDFE6;
                                .dropdown-text {
                                    height: 30px;
                                    justify-content: space-between;
                                    padding: 0 12px;
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                        }
                        .reupload-img {
                            width: 248px;
                            height: 48px;
                            margin-top: 10px;
                            background: #FFA897;
                            border-radius: 4px;
                            color: #fff;
                            text-align: center;
                            line-height: 48px;
                            user-select: none;
                        }
                    }
                    .edit-delete {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                    }
                    .edit-index {
                        font-size: 12px;
                        color: #999;
                        position: absolute;
                        right: 8px;
                        bottom: 8px;
                    }
                }
            }
        }
        .cropper {
            background: #ffffff;
            width: 750px;
            height: 530px;
            margin: auto;
            position: fixed;
            left: 260px;
            right: 0;
            top: 0;
            bottom: 0;
            border-radius: 10px;
            z-index: 999;
            .cropper-body {
                width: 750px;
                height: 423px;
            }
            .cropper-footer {
                float: right;
                padding: 5px 7px;
            }
        }
    }
</style>
