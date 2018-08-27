<template>
<div id="joinset">
  <el-form  ref="form" label-width="150px" :model="form" class="demo-ruleForm">
    <!--<el-form-item label="入口开关" prop="delivery">
      <el-switch v-model="form.join_switch"></el-switch>
      <div>开启后，申请入口将在首页展示</div>
    </el-form-item>-->
    <el-form-item label="加盟介绍" prop="desc" required="">
      <div class="per60">
        <UE :defaultMsg='form.detail' :config="config"  ref="ue" id="ue"></UE>
      </div>
    </el-form-item>
  </el-form>
  <div class="footerSubmit"><el-button type="primary" @click="save">保存</el-button></div>
</div>
</template>

<script>
  import UE from '../../../components/ue.vue';
  import qs from 'qs';
    export default {
        name: "joinset",
      components: {
        UE,
      },
      mounted(){
        this.getjoinset();
      },
      data(){
          return {
            form:{
              join_switch:'',
              detail:'请输入产品介绍或加盟政策等~~'
            },
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
              initialFrameWidth : null,
              initialFrameHeight: 500,
            },
          }
      },
      methods:{
        getjoinset(){
          this.api.request({
            url:this.api.get_enterprise_config,
            params:{
              act:11,
            }
          }).then((res)=>{
            if(res.data.state.code==10200){
              if(res.data.data.join_switch==0){
                this.form.join_switch=false;
              }else{
                this.form.join_switch=true;
              }
              if(res.data.data.detail){
                this.form.detail=res.data.data.detail;
                this.$refs['ue'].setUEContent(this.form.detail);
              }

            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        },
        save(){
          var smData={};
          smData.act=11;
          if(this.form.join_switch==false) smData.join_switch=0; else smData.join_switch=1;
          smData.detail=this.$refs['ue'].getUEContent();
          if(smData.detail==''){
            this.$message.error("详情不能为空！");
            return false;
          }
          this.api.request({
            method:'post',
            url:this.api.save_enterprise_config,
            data:smData
          }).then((res)=>{
            if(res.data.state.code==10200){
              this.$message({
                type:'success',
                message:'保存成功！'
              });
            }else{
              this.$message.error(res.data.state.msg);
            }
          });
        }
      }
    }
</script>

<style lang="less">
  #joinset{
    color:#606266;
    padding-bottom:50px;
    background: #fff;
    font-size:12px;
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
  }
</style>
