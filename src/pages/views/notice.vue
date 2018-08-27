<style>
</style>
<template>
  <audio preload="none" crossorigin="anonumous" id="audio0" data-time="5"  ><source src="../../img/video/sound.mp3"></audio>
</template>
<script>
    export default{
        data: function () {
            return {
              instance:''
            }
        },
      created() {
        setTimeout(()=>{
          this.opennotice();
        },15000)
      },
        methods: {
          opennotice() {
              var _this=this;
            this.api.request({
              url:this.api.get_order_notice,
              params:{}
            }).then(res=>{

              if(res.data.data.has_new_order==1){
                if(this.instance!=''){
                  this.instance.close();
                }
              this.instance=this.$notify({
                title: '提示',
                dangerouslyUseHTMLString:true,
                message: '<p>您有<span>'+res.data.data.unread+'</span>条新增订单未处理</p><a href="/mall/orderList" target="_self">马上去处理</a>',
                duration: 0
              });
              document.querySelector('#audio0').play();
              }
              setTimeout(()=>{
                this.opennotice();
              },15000)
            })
          },
        }
    }
</script>
