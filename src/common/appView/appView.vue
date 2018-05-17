<template>
  <div id="boxx">

    <el-carousel arrow="always" indicator-position="none" class="boxx">
      <el-carousel-item style="height:300px;" v-for="(item,index) in examDataForms" :key="index">
        <div class="margin">
          <h3 v-html="item.name"></h3>
          <div v-html="item.ueData"></div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <button style="position: absolute;top:550px;right:790px;"  @click="submit">提交</button>
    <button style="position: absolute;top:550px;right:522px;" @click="quxiao">取消</button>

  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props:{
      appView: {
        type: Boolean,
        default: false
      },
      quxiao:{
        type: Function
      },
      examDataForms:{
        type: Array,
        required: false
      },
      submit:{
        type: Function
      }
    },
    methods:{

    }
  }
</script>
<style>
  #boxx .boxx {
    padding-top: 140px
  }
  .el-carousel__item h3 {
    font-size: 18px;
    opacity: 0.75;
    margin: 0;
  }
  .el-carousel{
    overflow: auto;
    width:35vw;
    margin:0 auto;
    height:100%;
  }
  .el-carousel__arrow{
    top:80%;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  #boxx{
    position: absolute;
    top:0;
    left:0;
    width:100vw;
    height:1000vh;
    background: #000;
    z-index: 10000;
  }
  .margin{
    margin:0 20px;
  }
  h3{
    color:#000;
    padding-top:20px;
  }

  button{
    background: #00a0e9;
    color:#000;
    width:80px;
    height:40px;
    border:1px solid #000;
    font-size: 16px;
    border-radius: 10px 10px;
  }
</style>
