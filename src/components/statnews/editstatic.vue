<template>
  <div class="content-right">
    <div class="content-text">
      <div class="table-style ">
        <!--<p class="titleSmall">{{titleSmall}}</p>-->
        <el-input class="titleSmall" v-model="titleSmall" disabled="disabled"></el-input>
        <el-form
          :inline="true"
          label-width="100px"
          class="demo-form-inline"
          style="margin-bottom: 70px"
          v-for="(examDataForm,index) in examDataForms" :key="index">
          <el-form-item  style="margin-left: 5px">
            <el-input v-model="examDataForm.name"  placeholder="请输入名称" ></el-input>
          </el-form-item>
          <el-checkbox v-model="examDataForm.status">是否隐藏</el-checkbox>
          <el-button
            @click.prevent="removeDomain(index)"
            style="margin-left: 10px"
            v-show="examDataForm.vShowDel">
            点击删除
          </el-button>
          <vue-editor :id=examDataForm.ueName
                      useCustomImageHandler
                      @imageAdded="handleImageAdded"
                      v-model="examDataForm.ueData"
                      class="vue2-Editor">
          </vue-editor>
        </el-form>
        <el-button @click="addDomain" style="margin-bottom: 20px;">点击新增&nbsp;&nbsp;</el-button>
      </div>
    </div>
    <form-right
      ref="formRight"
      :post_put="post_put"
      :formData="formData"
      :examSubjectNumShow="examSubjectNumShow"
      :provinceShow="provinceShow"
      :cityShow="cityShow"
      :regionShow="regionShow"
      :provinceCityRegion="provinceCityRegion"
      :getCitys="getCitys"
      :citys="citys"
      :regions="regions"
      :regionsMeth="regionsMeth"
      :onSubmitView="onSubmitView"
      :getConsSmalls="getConsSmalls"
      :ConsSmallDatas="ConsSmallDatas"
      :successFlag="successFlag"
      :getConsSmallName="getConsSmallName"
      :reloadLocal="reloadLocal"
      :getAreaData="getAreaData"
      :flag="flag">
    </form-right>
    <app-view v-show="appView" :appView="appView" :quxiao="quxiao" :examDataForms="examDataForms" :submit="submit"></app-view>
  </div>
</template>


<script>

  import appView from 'common/appView/appView'
  import formRight from 'common/right/formRight'

  import { VueEditor } from 'vue2-editor'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_SYSTEM,TIKA_NEWS } from 'api/config'
  import { getQiNiuToken, upQiNiuFile } from 'api/comFunction'


  export default {
    data() {
      return {
        examDataForms:[
          {
            name:'',
            status: false,
            ueName: 'ue-1',
            vShowDel: false,
            ueData:''
          }
        ],
        formData: {
          ConsGroups: '',
          ConsGroupsId: '',
          ConsSmallName:'',
          ConsSmall: '',
          examTypeSeq: '',
          examName: '',
          examCode: '',
          parentidSeqName: '',
          examSubjectNum: '',
          examNature: '',
          examType: '',
          examEare: '',
          examPlan: '',
          examFrequency:'',
          outlineSets: '',
          province: '',
          city: '',
          region: '',
          description: ''
        },
        examSubjectNumShow: false,
        htmlForEditor: '',
        provinceShow: false,
        cityShow: false,
        regionShow: false,
        citys: [],
        regions: [],
        ConsSmallDatas:[],
        appView: false,
        flag: 0,
        titleFlag:0,
        successFlag: 0,
        apiData: {
          infoTypeSeq: '',
          examName: '',
          infomation: {},
          province: '',
          city: '',
          region: '',
          description: '',
          examTypeSeq: ''
        },
        newsSequenceNbr: '',
        post_put: 'post',
        titleSmall: '',
        getAreaData:'',

        getAllStaticInfoList:[]
      }
    },
    mounted() {
      this._getQiNiuToken()
      this.newsSequenceNbr = this.$route.params.sequenceNbr
      if(this.newsSequenceNbr){
        this.post_put = 'put'
        this._getStaticInfo(this.newsSequenceNbr)
      }else{
        this.post_put = 'post'
      }
    },
    methods: {
      onSubmitView() {
        this.apiData.infoTypeSeq = this.formData.ConsGroups
        this.apiData.infoTypeSeq = this.formData.ConsSmall.split(',')[0]
        this.apiData.extend3 = this.formData.ConsSmall.split(',')[1]
        this.apiData.examName = this.formData.examName
        this.apiData.infomation.messageList = this.examDataForms
        this.apiData.province = this.formData.province
        this.apiData.city = this.formData.city
        this.apiData.region = this.formData.region
        this.apiData.description = this.formData.description
        this.apiData.examTypeSeq = this.formData.examTypeSeq
        console.log(this.apiData)
        this.appView = true
      },
      reloadLocal(){
        if(this.post_put === 'put'){
          window.location.href = '#/statnews/staticlist'
        }
        this.$refs.formRight.$refs.staticFormData.resetFields()
        this.successFlag === 1
        this.examDataForms=[]
        this.titleSmall=''
        this.examDataForms=[{
          name:'',
          status: false,
          ueName: 'ue-1',
          vShowDel: false,
          ueData:''
        }]
      },
      quxiao() {
        this.appView = false
      },
      addDomain(){
        let temp = {}
        let leng = this.examDataForms.length-1
        let lastNum = parseInt(this.examDataForms[leng].ueName.replace('ue-',''))+1
        temp.name = ''
        temp.status = false
        temp.ueName = 'ue-' + lastNum
        temp.vShowDel = true
        temp.ueData =''
        this.examDataForms.push(temp)
      },
      removeDomain(index){
        this.examDataForms.splice(index,1)
      },
      getConsSmallName(val){
        if (this.post_put === 'put' && !this.titleFlag){
          this.titleSmall = this.formData.ConsSmallName
          this.titleFlag = 1
        } else {
          this.ConsSmallDatas.forEach(res=>{
            if(res.value === val){
              this.titleSmall = res.label
            }
          })
        }
      },
      provinceCityRegion(type){
        if(type === '全国统一'){
          this.provinceShow = false
          this.cityShow=false
          this.regionShow=false
          this.formData.province = ''
          this.formData.city = ''
          this.formData.region = ''
        } else if(type === '省统一'){
          this.provinceShow = true
          this.cityShow=false
          this.regionShow=false
          this.formData.city = ''
          this.formData.region = ''
        } else if(type === '市统一'){
          this.provinceShow = true
          this.cityShow=true
          this.regionShow=false
          this.formData.region = ''
        } else if(type === '区县统一'){
          this.provinceShow = true
          this.cityShow=true
          this.regionShow=true
        } else {
          this.provinceShow = false
          this.cityShow=false
          this.regionShow=false
          this.formData.province = ''
          this.formData.city = ''
          this.formData.region = ''
        }
      },
      getCitys(val){
        if(this.successFlag) return
        this.citys = []
        let url = "/v1/systemctl/location/cities?provinceName=" + val
        let getData = {
          url: encodeURI(url),
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.locationName
              temp.label = item.locationName
              this.citys.push(temp)
            })
          } else if(res.status !==401) {
            alert("获取城市信息出现错误："+res.message)
            return
          }
        })
      },
      regionsMeth(val){
        if(this.successFlag) return
        this.regions = []
        let url = "/v1/systemctl/location/regions?cityName=" + val
        let getData = {
          url: encodeURI(url),
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.locationName
              temp.label = item.locationName
              this.regions.push(temp)
            })
          } else if(res.status!==401) {
            alert("获取地区信息出现错误："+res.message)
            return
          }
        })
      },
      submit(){
        let url =''
        var urlType =''
        if(this.post_put === 'post'){
          url = '/v1/news/NewsStaticInfo'
          urlType = URL_POST
        }else{
          url = '/v1/news/NewsStaticInfo/'+this.newsSequenceNbr
          urlType = URL_PUT
        }
        let format = this.apiData
        delete format.examName
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_NEWS
          }
        }
        ApiPost(postData, urlType).then((res) => {
          if(res.status === 200){
            if(this.post_put === 'post'){
              this.submitReload()//上传成功后清空内容
              this.successFlag = 1
              this.appView = false
            }else{
              window.location.href = '#/statnews/staticlist'
            }
          }else if(res.status!==401){
            alert("静态咨询添加、编辑出现错误："+res.message)
            return
          }
        })
      },
      submitReload(){//上传成功后清空内容
        this.$refs.formRight.reloadLocal('staticFormData')
        this.examDataForms=[]
        this.examDataForms=[{
          name:'',
          status: false,
          ueName: 'ue-1',
          vShowDel: false,
          ueData:''
        }]
      },
      handleImageAdded(file, Editor, cursorLocation) {
        let uptoken = this.uptoken
        let domain = this.domain
        upQiNiuFile(file, uptoken, domain).then(res=>{
          if(res.status === 200){
            //this.examTreeForm.iconUrl = res.url
            Editor.insertEmbed(cursorLocation, 'image', res.url);
          }else{
            console.log(res.err)
            return
          }
        })
      },
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.uptoken = res.upToken
          this.domain = res.domain
        })
      },
      getConsSmalls(value){//根据大类ID查询小类信息
        if (this.post_put === 'put' && !this.flag){
          value = this.formData.ConsGroupsId;
          this.flag = 1
        }else{
          this.formData.ConsSmall=''
        }
        this.ConsSmallDatas = []

        let url = "/v1/news/staticinfotype/selectSmallStaticInfoType/public/" + value
        let getData = {
          url: encodeURI(url),
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.successFlag = 0
            res.result.forEach(item=>{
              let temp = {}
              if (this.post_put === 'put'){
                temp.value = item.sequenceNbr
              } else {
                temp.value = item.sequenceNbr+','+item.extend3
              }
              temp.label = item.typeName
              this.ConsSmallDatas.push(temp)
            })
          }else if(res.status!==401){
            console.log("获取资讯小类出错："+res.message)
            return
          }
        })
      },
      //获取单条资讯
      _getStaticInfo(value){
        let getData = {
          url: "/v1/news/NewsStaticInfo/" + value,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.examDataForms = []
            this.examDataForms = res.result.infomation.messageList

            this.formData.ConsGroups =res.result.bigStaticinfoType;
            this.formData.ConsGroupsId =res.result.extend1;
            this.formData.ConsSmall = res.result.infoTypeSeq
            this.formData.ConsSmallName = res.result.smallStaticinfoType
            this.formData.examName = res.result.examName
            this.formData.examCode = res.result.examTypeSeq
            this.formData.province = res.result.province
            this.formData.city = res.result.city
            this.formData.region = res.result.region
            this.getAreaData = res.result.extend3

//            this.provinceCityRegion(subjectName)
          }else if(res.status != 401){
            console.log('获取单条咨询信息出错：'+res.message)
            return
          }
        })
      }
    },
    components: {
      formRight,
   // UE,
      VueEditor,
      appView
    }
  }
</script>

<style>

  .search .el-input{
    width: 18%;
    display: inline-block;
  }
  .content-text .table-style .titleSmall{
    margin-left: 6px;
    margin-bottom: 20px;
    width:190px
  }

  .vue2-Editor{
    height: 200px;
  }
</style>

