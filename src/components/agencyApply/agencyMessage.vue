<template>
  <div class="form">
    <h1 style="text-align: center; padding-top: 10px;margin-top: 0px">题咖联盟加入申请表</h1>
    <el-form
      :model="dynamicValidateForm"
      ref="agencyMes"
      :rules="rules2"
      label-width="150px">
      <el-form-item
        prop="agencyName"
        :rules="[{required: true, message: '机构名称不能为空', trigger: 'blur'}]"
        label="机构名称:">
        <el-input v-model="dynamicValidateForm.agencyName" placeholder="请输入您的机构名称"></el-input>
      </el-form-item>
      <el-form-item
        prop="province"
        label="机构地址:">
        <el-row class="address">
          <el-col :span="2">
            <el-select v-model="dynamicValidateForm.province" placeholder="省" @change="provinceChange">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="dynamicValidateForm.city" placeholder="市"  @change="cityChange">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="dynamicValidateForm.region" placeholder="区" v-show="region">
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input v-model="dynamicValidateForm.agencyAddress" placeholder="请输入详细地址"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        prop="banner"
        :rules="[{required: true, message: '机构工商注册码不能为空', trigger: 'blur'}]"
        label="机构工商注册码:">
        <el-input v-model="dynamicValidateForm.banner" placeholder="请输入您的机构工商注册码"></el-input>
      </el-form-item>
      <el-form-item
        prop="agencyLogo"
        label="机构LOGO:">
        <el-upload
          class="upload-demo"
          drag
          :data="picturesData"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          action="http://upload.qiniu.com"
          multiple
          v-model="dynamicValidateForm.agencyLogo">
          <img v-if="dynamicValidateForm.agencyLogo" :src="dynamicValidateForm.agencyLogo" style="width:135px; height:135px" class="avatar">
          <i v-else class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">格式JPG、PNG;大小＜50KB</div>
        </el-upload>
      </el-form-item>
      <el-form-item
        prop="industry"
        label="从事行业:">
        <el-select style="width: 50%"
          v-model="dynamicValidateForm.industry"
          multiple
          filterable
          allow-create
          :multiple-limit = 3
          placeholder="请选择所从事的培训类别">
          <el-option
            v-for="item in industrys"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="cooperationFields" label="主要期望合作的领域:">
        <el-checkbox-group v-model="dynamicValidateForm.cooperationFields">
          <el-checkbox label="视频点播"></el-checkbox>
          <el-checkbox label="视频直播"></el-checkbox>
          <el-checkbox label="题库资源"></el-checkbox>
          <el-checkbox label="考试资讯"></el-checkbox>
          <el-checkbox label="教辅合作"></el-checkbox><br/>
          <el-checkbox label="其他方面"></el-checkbox>
        </el-checkbox-group>
        <el-input v-model="dynamicValidateForm.other" placeholder="请输入您的感兴趣的领域"></el-input>
      </el-form-item>
      <el-form-item
        prop="phone"
        label="负责人联系电话">
        <el-input v-model="dynamicValidateForm.phone" placeholder="请输入您的联系方式，这个很重要！"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 35%">
        <el-button type="primary" @click="onSubmit" :disabled="subStatus">提交</el-button>
      </el-form-item>
    </el-form >
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_APP, TIKA_WEB, TIKA_SYSTEM,TIKA_AGENCY } from 'api/config'
  import { getQiNiuToken, upQiNiuFile, getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      var checkMobile = (rule, value, callback) => {
        setTimeout(() => {
          var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
          if(!myreg.test(value)){
            callback(new Error('请输入有效电话号码'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        tableData: [],
        industrys:[],
        imageUrl: '',
        dialogImageUrl: '',
        dialogVisible: false,
        picturesData:{},
        dynamicValidateForm: {
          agencyName:'',
          province:'',
          city:'',
          region:'',
          agencyAddress:'',
          agencyLogo:'',
          banner: '',
          industry:'',
          cooperationFields:[],
          other:'',
          phone:''
        },
        agencyMes:{
          phone:''
        },
        rules2:{
          phone:[{required: true, message: '联系电话不能为空',trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}]
        },
        options1:[],
        options2:[],
        options3:[],
        region:false,
        subStatus: false
      }
    },
    mounted(){
      this._getQiNiuToken()
      this._getProvinceData()
      this._getIndustryData()
    },
    methods: {
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.picturesData.token = res.upToken
          this.domain = res.domain
        })
      },

      _getIndustryData(){
        getDictionaryData('INDUSTRY_TYPE').then(res=>{
          if(res){
            this.industrys=[]
            res.forEach(item=>{
              let temp = {}
              temp.value = item.dictDataKey
              temp.label = item.dictDataValue
              this.industrys.push(temp)
            })
          }else{
            console.log('获取版行业大类失败！！')
            return
          }
        })
      },
      _getProvinceData(){
        this.options1=[]
        let url = "/v1/systemctl/location/provinces"
        let getData = {
          url: url,
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.locationCode
              temp.label = item.locationName
              this.options1.push(temp)
            })
          } else if(res.status !== 401) {
            alert(res.message)
            return
          }
        })
      },
      provinceChange(val){
        if(!val){
          return
        }

        this.province = val
        this.options2=[]
        this.dynamicValidateForm.city = ''
        let url = "/v1/systemctl/location/cities?provinceCode=" + val
        let getData = {
          url: encodeURI(url),
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.locationCode
              temp.label = item.locationName
              this.options2.push(temp)
            })
          } else if(res.status !==401) {
            alert("获取城市信息出现错误："+res.message)
            return
          }
        })
      },
      cityChange(val){
        if(!val){
          return
        }

        this.city = val
        this.options3 = []
        this.dynamicValidateForm.region =''
        let url = "/v1/systemctl/location/regions?cityCode=" + val
        let getData = {
          url: encodeURI(url),
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.locationCode
              temp.label = item.locationName
              this.options3.push(temp)
            })
            if(this.options3.length !==0){
              this.region=true
            }
          } else if(res.status!==401) {
            alert("获取地区信息出现错误："+res.message)
            return
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.dynamicValidateForm.agencyLogo =this.domain + '/' + res.key
      },
      //上传图片提交前进行验证
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
      onSubmit() {
        this.$refs['agencyMes'].validate((valid) => {
          if (valid) {
            this.subStatus = true
            this.postSubmitApi()
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },

      postSubmitApi() {
        let agencyName = this.dynamicValidateForm.agencyName
        let province = this.province
        let city = this.city
        let region = this.dynamicValidateForm.region

        let agencyAddress = this.dynamicValidateForm.agencyAddress
        let agencyLogo = this.dynamicValidateForm.agencyLogo
        let banner = this.dynamicValidateForm.banner
        let industry = this.dynamicValidateForm.industry.join(',')
        let cooperationFields = this.dynamicValidateForm.cooperationFields.join(',')
        let other = this.dynamicValidateForm.other
        let phone = this.dynamicValidateForm.phone


        let format = {
          agencyName: agencyName,
          country: 'cn',
          province: province,
          city: city,
          region: region,
          agencyAddress: agencyAddress,
          avatar: agencyLogo,
          industry: industry,
          collaborativeAreas: cooperationFields,
          interestedField: other,
          banner: banner,
          phone1: phone,
          recUserId: sessionStorage.getItem("userId")
        }
        let url = '/v1/agency/agencyinfo/create'
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_AGENCY
          }
        }
        ApiPost(postData, URL_POST).then((res) => {
          console.log('===================================')
          console.log(res)
          if (res.status === 200) {
            alert("机构信息新增成功！！")
            this.resetForm()
            this.subStatus = false
          } else if(res.status !== 401) {
            alert("机构信息新增出现错误：" + res.message)
            this.subStatus = false
            return
          }
        })
      },
      resetForm(){
        this.$refs['agencyMes'].resetFields()
        this.dynamicValidateForm.province = ''
        this.dynamicValidateForm.city = ''
        this.dynamicValidateForm.region = ''
      }
    }
  }
</script>

<style>

  .form{
    margin-bottom: 0px;
    width:100%;
    background: #fff;
  }
  .el-form-item{
    margin-left: 25%;
    margin-bottom: 30px
  }
  .form .el-form .el-input .el-input__inner{
    width:50%;
  }
  .form .el-select .el-input .el-input__inner{
    width:inherit;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }


</style>

