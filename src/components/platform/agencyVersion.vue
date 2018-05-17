<template>
  <div class="table-style">
    <div class="search">
      <div class="top-line">
        <el-select
          v-model="agencyName"
          placeholder="机构名称"
          filterable
          remote
          @change="valueChange"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="agencyCode" placeholder="机构代码" disabled="disabled"></el-input>
      </div>
    </div>

    <div class="versionStyle">
      <el-form ref="agencyVersionRef" :model="agencyVersionForm" label-width="150px">
        <!--<el-form-item-->
          <!--label="版本号："-->
          <!--prop="version"-->
          <!--:rules="[-->
              <!--{ required: true, message: '请输入版本号', trigger: 'blur' }-->
            <!--]">-->
          <!--<el-input-->
            <!--v-model="agencyVersionForm.version"-->
            <!--placeholder="请输入版本信息"-->
            <!--style="width: 218px;">-->
          <!--</el-input>-->
        <!--</el-form-item>-->

        <el-form-item
          label="类型："
          prop="appType"
          :rules="[
            { required: true, message: '请输入版本类型', trigger: 'blur' }
          ]">

          <el-select
            v-model="agencyVersionForm.appType"
            placeholder="请选择类型">
            <el-option
              v-for="item in appTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item
          prop="versionCode"
          :rules="[
              { required: true, message: '请选择版本二维码', trigger: 'blur' }
            ]"
          label="版本二维码：">
          <el-upload
            class="upload-demo"
            drag
            :data="picturesData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            action="http://upload.qiniu.com"
            multiple>
            <img v-if="agencyVersionForm.versionCode" :src="agencyVersionForm.versionCode" style="width:135px; height:135px" class="avatar">
            <i v-else class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>

        <el-form-item
          label="版本介绍："
          :rules="[
              { required: true, message: '请输入版本介绍', trigger: 'blur' }
            ]"
          prop="text">
          <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入版本信息"
            v-model="agencyVersionForm.text">
          </el-input>
        </el-form-item>
        <el-form-item
          label="安装包文件上传："
          :rules="[
              { required: true, message: '安装包文件路径为空', trigger: 'blur' }
          ]"
          prop="fileUrl">
          <el-row>
            <el-col :span="20">
              <input type="file" id="file_upload" />
            </el-col>
            <el-col :span="4">
              <el-button type="success"  size="mini" @click="uploadFile">点击上传</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('agencyVersionRef')">立即创建</el-button>
          <el-button @click="onGetAway('agencyVersionRef')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="font-size: 18px;margin-left: 20px">
      <span>历史版本管控</span>
    </div>

    <el-table :data="tableData" border style="width: 60%">
      <el-table-column fixed prop="appVersion" label="版本号" width="120">
      </el-table-column>
      <el-table-column prop="appType" label="版本类型" width="120">
      </el-table-column>
      <el-table-column prop="createTime" label="日期" width="200">
      </el-table-column>
      <el-table-column prop="lockStatus" label="状态" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form :model="agencyVersionFormShow" label-width="150px">
          <el-form-item label="版本号：" style="width: 368px;">
            <el-input v-model="agencyVersionFormShow.appVersion" disabled></el-input>
          </el-form-item>

          <el-form-item label="类型：">
            <el-select
              disabled
              v-model="agencyVersionFormShow.appType"
              placeholder="请选择类型">
              <el-option
                v-for="item in appTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="版本二维码：">
            <img :src="agencyVersionFormShow.qrCodeUrl" width="160" height="160"/>
          </el-form-item>

          <el-form-item label="版本介绍：">
            <el-input
              disabled
              type="textarea"
              :rows="10"
              placeholder="请输入版本信息"
              v-model="agencyVersionFormShow.updateTips">
            </el-input>
          </el-form-item>
          <el-form-item label="安装包文件上传：">
            <el-row>
              <el-col :span="20">
                <el-input v-model="agencyVersionFormShow.downloadUrl" disabled></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="upStatus(agencyVersionFormShow.sequenceNbr)">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>


<script>
  import $ from 'jquery'
  import { Loading } from 'element-ui'

  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_AGENCY, TIKA_RBAC, TIKA_UPDATA, LOAD_URL} from 'api/config'
  import { getQiNiuToken, upQiNiuFile, getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      return {
        agencyName:'',
        agencyCode:'',
        current: 1,
        size: 10,
        total:0,

        options4: [],
        list: [],
        loading: false,
        dialogVisible: false,

        picturesData: {},

        agencyVersionForm: {
          version: '',
          appType: '',
          versionCode: '',
          text: '',
          fileUrl: ''
        },
        tableData:[],
        appTypes: [
          {
            label: 'android',
            value : '0'
          },
          {
            label: 'ios',
            value : '1'
          },
          {
            label: 'wince',
            value : '2'
          }
        ],
        dialogVisible: false,

        agencyVersionFormShow: {},


        editorContent: ''



      }
    },
    mounted() {
      this.$nextTick(function(){
        this._getAgencyLists()
        this._getQiNiuToken()
      })
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      //获取所有机构
      _getAgencyLists(){
        let getData = {
          url: "/v1/agency/agencyinfo/selectAllAgencyInfo",
          value: TIKA_AGENCY
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.agencyData = [];
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.agencyCode;
              temp.label = item.agencyName;
              this.agencyData.push(temp)
            })
            this.list = this.agencyData.map(item => {
              return { value: item.value, label: item.label };
            })
          } else {
            alert(res.message)
            return
          }
        })
      },
      //获取可分配角色名称列表
      valueChange(val){
        this.agencyCode = val
        this._getThree()
      },
      beforeAvatarUpload(file) {
        const isJPEG = file.type === 'image/jpeg'
        const isJPG = file.type === 'image/jpg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size/ 1024 < 400
        let logo = isPNG || isJPG || isJPEG
        if (!logo) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 400KB!')
        }
        return logo && isLt2M
      },
      handleAvatarSuccess(res, file) {
        this.agencyVersionForm.versionCode =this.domain + '/' + res.key
      },
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.picturesData.token = res.upToken
          this.uptoken = res.upToken
          this.domain = res.domain
        })
      },
      uploadFile() {
        // let loadingInstance = Loading.service(this.options)

        if(!this.agencyCode){
          this.$message.error('你尚未选择机构！！')
          return
        }
        this.fileName = $("#file_upload")[0].files[0].name
        let lastEndArr= this.fileName.split(".")
        let lastEndArrLength = lastEndArr.length-1
        console.log('111111111111111111')
        console.log(lastEndArrLength)
        if(lastEndArr[lastEndArrLength] !== "apk"){
          this.$message.error('你选择的不是.apk文件！！')
          return
        }

        let tempDate = this.fileName.split("_v")[1]

        this.agencyVersionForm.version = tempDate.split("_a")[0]
        let that = this
        var formData = new FormData()
        formData.append('files',$("#file_upload")[0].files[0])    //将文件转成二进制形式
        formData.append('agencyCode',this.agencyCode)
        formData.append('version',this.agencyVersionForm.version)
        $.ajax({
          type:"post",
          url: LOAD_URL + ":10005/v1/update/apkupload/uploadApk",
          async:false,
          contentType: false,     //这个一定要写
          processData: false,     //这个也一定要写，不然会报错
          data:formData,
          dataType:'json',        //返回类型，有json，text，HTML。这里并没有jsonp格式，所以别妄想能用jsonp做跨域了。
          success:function(data){

            console.log('data============')
            console.log(data)
            // loadingInstance.close();
            if(data.status === 200 && data.result!=="目标文件已存在！"){
              that.agencyVersionForm.fileUrl = data.result
              that.$message.success('上传成功！！')
              that.errFile = true
            }else{
              that.errFile = false
              that.$message.error('您上传的文件已存在！！')
              return
            }
          },
          error:function(XMLHttpRequest, textStatus, errorThrown, data){
            alert('上传失败！！')
          }
        })
      },
      handleClick(row){
        this.agencyVersionFormShow = row
        this.dialogVisible = true
      },
      _getThree(){
        console.log(this.agency)
        let url = "/v1/update/UpdateAppVersionInfo/threeList?agencyCode="+this.agencyCode
        let getData = {
          url: url,
          value: TIKA_UPDATA
        }
        ApiGet(getData, URL_GET).then((res)=>{
          console.log('res=================')
          console.log(res)
          if(res.status === 200){
            this.tableData=[]
            res.result.forEach(res=>{
              if(res.appType ===  0){
                res.appType = "android"
              }else if(res.appType ===  1){
                res.appType = "ios"
              }else if(res.appType ===  2){
                res.appType = "wince"
              }
              if(res.lockStatus ===  "UNLOCK"){
                res.lockStatus = "启用"
              }else{
                res.lockStatus = "禁用"
              }
              this.tableData.push(res)
            })

          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      onGetAway(formName){
        let file = document.getElementById('file_upload');
        file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
        this.$refs[formName].resetFields()
      },
      onSubmit(formName){

        if(!this.errFile){
          this.$message.error("请重新上传文件！！")
          return
        }
        console.log('formNameconsole.log(formName)console.log(formName)console.log(formName)')
        console.log(formName)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.onSubmitApi()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onSubmitApi(){
        let format = {}
        format.appVersion = this.agencyVersionForm.version
        format.qrCodeUrl = this.agencyVersionForm.versionCode
        format.updateTips = this.agencyVersionForm.text
        format.downloadUrl = this.agencyVersionForm.fileUrl
        format.appName = this.fileName
        format.lockStatus = "LOCK"
        format.agencyCode = this.agencyCode
        format.appType = this.agencyVersionForm.appType
        format.createUserId = sessionStorage.getItem("userId")
        let url = '/v1/update/UpdateAppVersionInfo'
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_UPDATA
          }
        }
        ApiPost(postData, URL_POST).then((res) => {
          if(res.status === 200){
            this._getThree()
            this.onGetAway('agencyVersionRef')
            alert('创建成功！！')
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      upStatus(val){
        let format = {
          lockStatus: 'UNLOCK',
          lockUserId: sessionStorage.getItem("userId"),
          recUserId: sessionStorage.getItem("userId")
        }
        let url = `/v1/update/UpdateAppVersionInfo/${val}`
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_UPDATA
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200){
            this._getThree()
            this.dialogVisible = false
          }else if(res.status !== 401){
            alert(res.message)
            return
          }

        })
      }
    }
  }
</script>

<style>


  .versionStyle{
    /* margin-top: 110px; */
    margin-bottom: 20px;
    width: 100%;
    background: #fff;
  }
  .versionStyle .el-form{
    width: 40%;
    padding: 20px;
  }


  .el-table tr.current-row>td {
    background: #409eff
  }

  .table-style .search .top-line .el-select .el-input{
    width:90%;
  }
  .el-dialog__body .el-tree{
    cursor: default;
    background: #fff;
    border: 0px solid #d1dbe5 !important;
  }
  .roleClass{
    font-size: 18px;
    margin-left: 20px
  }
  .roleClass .el-button{
    width: 121px;
    height: 36px;
  }

</style>

