<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" v-for="(tempDataForm,index) in goodsListTitle.child"  :key="index" style="margin-bottom: 10px;width:100%">
      <el-form-item style="width:100px">
        <el-input v-model="tempDataForm.name"></el-input>
      </el-form-item>
      <el-form-item  style="width:350px">
        <el-upload
          class="upload-demo"
          action="http://upload.qiniu.com"
          :on-change="handleChange"
          :on-success="upLoadSuccess"
          :on-remove="upLoadRemove"
          :on-error="upLoadErr"
          :data="upLoadData">
          <el-button v-if="tempDataForm.showUpLoad" type="primary" @click="uploadClick(index)">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="width:100px">
        <el-input v-model="tempDataForm.classSize" disabled="disabled"></el-input>
      </el-form-item>
      <!--<el-form-item  style="width:100px">-->
        <!--<el-input v-model="tempDataForm.classLength"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item style="width:100px">
        <el-select v-model="tempDataForm.classManger">
          <el-option
            v-for="item in MANGER_STATUSS"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <i class="el-icon-delete" style="font-size: 25px;margin-top: 5px" v-show="tempDataForm.delOrNo" @click.prevent="delList(index)"></i>
    </el-form>
    <el-button type="success" round  @click="addList">点击添加选项</el-button>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { getQiNiuToken, upQiNiuFile } from 'api/comFunction'
  export default {
    data(){
      return {
        MANGER_STATUSS:[{
          value: '0',
          label: '免费'
        },{
          value: '1',
          label: '购买'
        }],
        upLoadData:{}
      }
    },
    props: {
      goodsListTitle: {
        type: Object
      }
    },
    mounted(){
      this._getQiNiuToken();
    },
    methods:{
      _getQiNiuToken(){
        getQiNiuToken('video').then(res=>{
          this.upLoadData.token = res.upToken
          this.domain = res.domain
          console.log(this.domain)
        })
      },
      delList(index){
        this.goodsListTitle.child.splice(index,1)
      },
      addList(){
        let temp = {
          name: '',
          url:'',
          classSize: '',
//          classLength: '',
          classManger: '0',
          showUpLoad:true,
          delOrNo:true
        }
        this.goodsListTitle.child.push(temp)
//        this.goodsListTitle.child.forEach(item => {
//          if (item.name === '' && item.url === ''){
//            alert('请填写视频相关信息');
//            return;
//          } else {
//            this.goodsListTitle.child.push(temp)
//          }
//        })
      },
      uploadClick(index){
        this.index = index;
      },
      handleChange(file,fileList){
        console.log(file)
        console.log(fileList)
        let temp = file.size / 1024 /1024 + '';
        temp =  temp.slice(0,temp.indexOf('.')+2);
        this.goodsListTitle.child[this.index].classSize =temp+ 'M';
        if (file.status === 'loading' || file.status === 'finish' || file.status === 'fail'){
          this.goodsListTitle.child[this.index].showUpLoad = true;
          $(".el-upload").removeClass("upLoadClass")
        } else {
          this.goodsListTitle.child[this.index].showUpLoad = false;
          $(".el-upload").addClass("upLoadClass")
        }
      },
      upLoadSuccess(response, file, fileList){
       this.goodsListTitle.child[this.index].url = this.domain + '/'+response.key;
      },
      upLoadRemove(file, fileList){
        this.goodsListTitle.child[this.index].classSize = '';
        this.goodsListTitle.child[this.index].showUpLoad = true;
        this.goodsListTitle.child[this.index].url = '';
        console.log(fileList)
      },
      upLoadErr(err, file, fileList){
        this.goodsListTitle.child[this.index].classSize = '';
        this.goodsListTitle.child[this.index].showUpLoad = true;
        this.goodsListTitle.child[this.index].url = '';
        console.log(fileList)
      }
    }
  }

</script>

<style>
  .upLoadClass{
    display: block;
    text-align: center;
    cursor: pointer;
  }

</style>



