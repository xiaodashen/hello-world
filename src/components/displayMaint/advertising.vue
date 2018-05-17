<template>
  <div class="table-style">
    <div class="search">
      <div class="top-line">
        <el-select
          v-model="agencyName"
          placeholder="机构名称"
          filterable
          remote
          @change="agencyChange"
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

        <el-select
          v-model="examName"
          placeholder="考试名称"
          filterable
          remote
          @change="examChange"
          :remote-method="remoteMethodExam"
          :loading="loadingExam">
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="plus" @click="addAdvertising">添加广告</el-button>
      </div>
    </div>
    <div class="advertinsClass">
      <el-row :gutter="20" class="adHeight">
          <el-col :span="6">
            <el-input
              style="width: 60%;"
              placeholder="题库广告图"
              :disabled="true">
            </el-input>
          </el-col>
          <el-col :span="6" v-for="(tempDate,index) in adAgencyDates['题库广告图']" :keys="index">
            <img :src="tempDate.mediaUrl" alt="" style="width: 60%;" @dblclick="editAdDate(tempDate.sequenceNbr)">
          </el-col>
        </el-row>
      <el-row :gutter="20" class="adHeight">
        <el-col :span="6">
          <el-input
            style="width: 60%;"
            placeholder="学习广告图"
            :disabled="true">
          </el-input>
        </el-col>
        <el-col :span="6" v-for="(tempDate,index) in adAgencyDates['学习广告图']"  :keys="index">
          <img :src="tempDate.mediaUrl" alt="" style="width: 60%;"  @dblclick="editAdDate(tempDate.sequenceNbr)">
        </el-col>
      </el-row>
      <el-row :gutter="20" class="adHeight">
        <el-col :span="6">
          <el-input
            style="width: 60%;"
            placeholder="发现广告图"
            :disabled="true">
          </el-input>
        </el-col>
        <el-col :span="6" v-for="(tempDate,index) in adAgencyDates['发现广告图']"  :keys="index">
          <img :src="tempDate.mediaUrl" alt="" style="width: 60%;"  @dblclick="editAdDate(tempDate.sequenceNbr)">
        </el-col>
      </el-row>
    </div>
    <div class="formRight"   v-show="formShow" >
      <el-form :model="adForm" ref="adForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="adType"
          label="商家类型:">
          <el-select v-model="adForm.adType" placeholder="请选择商家类型">
            <el-option
              v-for="item in adTypeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="adModule"
          label="广告模块:">
          <el-select v-model="adForm.adModule" placeholder="请选择广告类型">
            <el-option
              v-for="item in adModuleArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="adOrder"
          label="广告顺序:">
          <el-select v-model="adForm.adOrder" placeholder="请选择广告顺序">
            <el-option
              v-for="item in adOrderArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="recStatus"
          label="广告状态:">
          <el-select v-model="adForm.recStatus" placeholder="请选择广告状态">
            <el-option
              v-for="item in recStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="mediaUrl"
          label="广告图片:">
          <el-upload
            class="upload-demo"
            style="width: 80%"
            drag
            :data="picturesData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            action="http://upload.qiniu.com"
            multiple>
            <img v-if="adForm.mediaUrl" :src="adForm.mediaUrl" style="width:80%" class="avatar">
            <i v-else class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="font-size: 15px;color: #000;">格式JPG、PNG;大小＜50KB</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input
            type="textarea"
            :rows="3"
            v-model="adForm.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('adForm')">保存</el-button>
          <el-button @click="resetForm('adForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_AGENCY, TIKA_RBAC,TIKA_SYSTEM,TIKA_NEWS} from 'api/config'
  import { getQiNiuToken, upQiNiuFile, getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      return {
        agencyName:'',
        agencyCode:'',

        options4: [],
        list: [],
        loading: false,

        examName:'',
        examCode:'',

        options5: [],
        listExam: [],
        loadingExam: false,


        formShow: false,
        adForm: {
          adType: '',
          adModule: '',
          adOrder: '',
          recStatus: 'ACTIVE',
          mediaUrl: '',
          description: ''
        },
        adModuleArray: [
          {
            label: "题库广告图",
            value: "ITEM_BANK"
          },
          {
            label: "学习广告图",
            value: "MALL"
          },{
            label: "发现广告图",
            value: "NEWS"
          },
        ],
        recStatusArray: [
          {
            label: "启用",
            value: "ACTIVE"
          },
          {
            label: "禁用",
            value: "INACTIVE"
          }
        ],
        adTypeArray: [
          {
            label: "平台",
            value: "0"
          },
          {
            label: "机构",
            value: "1"
          }
        ],
        adOrderArray: [
          {
            label: "1",
            value: "1"
          },
          {
            label: "2",
            value: "2"
          },
          {
            label: "3",
            value: "3"
          }
        ],

        picturesData:{},
        adAgencyDates:{},
        postPut: 'post'
      }
    },
    mounted() {
        this._getAgencyLists()
        this._getQiNiuToken()
    },
    methods: {
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.picturesData.token = res.upToken
          this.domain = res.domain
        })
      },
      handleAvatarSuccess(res, file) {
        this.adForm.mediaUrl =this.domain + '/' + res.key
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
      agencyChange(value){
        this.agencyCode = value;
        this._getExamAll()
      },
      examChange(value){
        this.examCode = value;
        this._getAdAll()
      },
      _getAdAll(){
        let url= "/v1/news/mediaInfo/selectAppAd?current=0&size=10&agencyCode="+ this.agencyCode + "&examCode=" + this.examCode
        let getData = {
          url: url,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            this.adAgencyDates=[]
            this.adAgencyDates['题库广告图'] = res.result.ITEM_BANK
            this.adAgencyDates['学习广告图'] = res.result.MALL
            this.adAgencyDates['发现广告图'] = res.result.NEWS
            console.log('this.console.log(this.adAgencyDates)console.log(this.adAgencyDates)console.log(this.adAgencyDates)')
            console.log(this.adAgencyDates)
          } else if(res.status !== 200){

          }
        })

      },
      //获取机构下的所有考试
      _getExamAll(){
        if(!this.agencyCode){
          this.$message.error('请选择机构！！')
          return
        }
        let getData = {
          url: '/v1/privilege/resource/agencyresourcearray?agencyCode='+this.agencyCode,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            let getData = {
              // url: '/v1/itembank/itembankExamInfo/itembank/ExamInfoLists?sourceStr='+res.result,
              url: '/v1/systemctl/treeExamInfo/tree/ExamInfoLists?sourceStr='+res.result,
              value: TIKA_SYSTEM
            }
            ApiGet(getData, URL_GET).then((res1)=>{
              if(res1.status === 200){
                this.statesExam = []
                if(!res1.result.length){
                  alert('该机构下无考试信息！！！')
                  return
                }
                res1.result.forEach(item=>{
                  let temp = {}
                  temp.label = item.examName
                  temp.value = item.examCode
                  this.statesExam.push(temp)
                })
                this.listExam = this.statesExam.map(item => {
                  return { value: item.value, label: item.label };
                })
              }else if(res1.status !== 401){
                console.log(res.message)
                alert('获取当前机构所有考试出错：'+res.message)
                return
              }
            })
          } else {
            alert('获取机构权限出错：'+res.message)
            return
          }

        })
      },
      remoteMethodExam(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loadingExam = false;
            this.options5 = this.listExam.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options5 = [];
        }
      },
      addAdvertising(){
        if(!this.examCode){
          this.$message.error('请选择考试！！！')
          return
        }
        this.formShow = true

      },
      onSubmit(){
        let agencyCode = sessionStorage.getItem("agencyCode")
        let agencyType = this.adForm.adType
        if(agencyType === "1"){ // 当为机构时获取机构的agencyCode和表单中的顺序
          agencyCode = this.agencyCode
        }
        let format = {
          agencyCode: agencyCode,
          examCode: this.examCode,
          adModule: this.adForm.adModule,
          adOrder: this.adForm.adOrder,
          mediaUrl: this.adForm.mediaUrl,
          recStatus: this.adForm.recStatus,
          description: this.adForm.description,
          recUserId: sessionStorage.getItem("userId"),
          createUserId: sessionStorage.getItem("userId")
        }
        if(this.postPut === 'post'){
          let url = '/v1/news/mediaInfo/createAd'
          let postData = {
            url: url,
            data: {
              format: format,
              value: TIKA_NEWS
            }
          }
          ApiPost(postData, URL_POST).then((res) => {
            if(res.status === 200){
              this.formShow = false
              this._getAdAll()
              alert("添加成功！！")
            }else if(res.status !== 401){
              this.formShow = false
              this.postPut = "post"
              this.$message.error(res.message)
              return
            }
          })
        }else{
          format.sequenceNbr = this.sequenceNbr
          delete format.createUserId

          let url = '/v1/news/mediaInfo/upAd'
          let postData = {
            url: url,
            data: {
              format: format,
              value: TIKA_NEWS
            }
          }
          ApiPost(postData, URL_POST).then((res) => {
            if(res.status === 200){
              this.formShow = false
              this.postPut = "post"
              this._getAdAll()
              alert("更新成功！！")
            }else if(res.status !== 401){
              this.formShow = false
              this.postPut = "post"
              this.$message.error(res.message)
              return
            }
          })

        }

      },
      resetForm(name){
        this.formShow = false
        this.$refs[name].resetFields();
      },
      editAdDate(val){
        this.sequenceNbr = val
        let getData = {
          url: `/v1/news/mediaInfo/selectOne?sequenceNbr=${val}`,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.postPut = "put"
            if(res.result.agencyCode === 'SUPER_ADMIN'){
              res.result.adType = '0'
            }else{
              res.result.adType = '1'
            }
            this.adForm = res.result
            this.formShow = true
          }else if(res.status !== 401){
            this.$message.error(res.message)
            return
          }
        })
      }
    }
  }
</script>

<style>

  .formRight .form-style{
    margin-top: 50px;
    margin-left: 5px;
  }
  .el-form-item{
    margin-bottom: 15px
  }

  .table-style .search .top-line .el-select .el-input{
    width:90%;
  }
  .advertinsClass{
    background: #FFF;
    padding: 20px;
  }
  .advertinsClass .adHeight{
    height: 200px
  }
  .el-upload-dragger{
    width: 250px
  }

</style>

