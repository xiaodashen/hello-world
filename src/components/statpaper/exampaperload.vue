<template>
  <div class="table-style" style="width: 65%;height:0">
    <el-input
      style="width: 150px"
      placeholder="历年真题试卷导入"
      :disabled="true">
    </el-input>
    <br>   <br>
    <input type="file" id="file_upload"/>
    <br><br>
    <el-button type="primary" @click="submitUpload" :loading="uploadLoad">上传到服务器</el-button>

  </div>
</template>


<script>
  import $ from 'jquery'

  import { LOAD_URL} from 'api/config'
  export default {
    data() {
      return {
        uploadLoad: false
      }
    },
    methods: {
      submitUpload() {
        let that = this
        this.uploadLoad = true

        var formData = new FormData()
        formData.append('file',$("#file_upload")[0].files[0])    //将文件转成二进制形式
        formData.append('agencyCode',sessionStorage.getItem("agencyCode"))
        formData.append('userId',sessionStorage.getItem("userId"))
        formData.append('fileName',$("#file_upload")[0].files[0].name)
        formData.append('subjectCode','1111111111')
        formData.append('paperType','OLD_EXAMS')
        $.ajax({
          type:"post",
          url:LOAD_URL + ":10005/v1/paper/importpaper/paperImport",
          // url: "http://192.168.1.104:30010/v1/paper/importpaper/paperImport",
          async:true,
          contentType: false,     //这个一定要写
          processData: false,     //这个也一定要写，不然会报错
          data:formData,
          dataType:'json',        //返回类型，有json，text，HTML。这里并没有jsonp格式，所以别妄想能用jsonp做跨域了。
          success:function(data){
            console.log('1111111111111111')
            console.log(data)
            that.uploadLoad = false
            let file = document.getElementById('file_upload');
            file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
            if(data.status === 200 && data.result > 0){
              that.$message.success(data.message)
              return
            }else{
              that.$message.error(data.message)
              return
            }
          },
          error:function(XMLHttpRequest, textStatus, errorThrown, data){
            that.uploadLoad = false
            let file = document.getElementById('file_upload');
            file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
            that.$message.error('导入失败！！')
            return
          }
        });
      }
    }
  }
</script>

<style>

  .el-form--inline .el-form-item{
    width:41%;
    margin-left: 20px;
  }
  .content-text .table-style .search .top-line .el-select .el-input{
    margin-left: 15px;
    width: 90%;
  }


</style>

