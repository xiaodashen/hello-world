<template>
  <div class="formRight">
    <el-form ref="staticFormData" :model="formData" label-width="100px" class="form-style">
      <el-form-item
        prop="ConsGroups"
        label="资讯大类:"
        :rules="[
            {required: true, message: '请选择资讯大类',trigger: 'blur'}
          ]">
        <el-select
          v-model="formData.ConsGroups"
          placeholder="请选择资讯大类"
          @change="getConsSmalls">
          <el-option
            v-for="item in ConsGroupsDatas"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="ConsSmall"
        label="资讯小类:"
        :rules="[
            {required: true, message: '请选择资讯小类',trigger: 'blur'}
          ]">
        <el-select v-model="formData.ConsSmall" placeholder="请选择资讯小类" @change="getConsSmallName">
          <el-option
            v-for="item in ConsSmallDatas"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="examName"
        label="考试名称:"
        :rules="[
            {required: true, message: '请选择考试名称',trigger: 'blur'}
          ]">
        <el-select
          v-model="formData.examName"
          filterable
          remote
          visible-change="true"
          placeholder="请输入考试名称"
          :remote-method="remoteMethod"
          @change="getExamData"
          :loading="loading">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item  prop="parentidSeqName" label="考试行业:">
        <el-input v-model="formData.parentidSeqName" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item prop="examSubjectNum" label="考试科目:"  v-show="examSubjectNumShow">
        <el-input v-model="formData.examSubjectNum"  disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item prop="examType" label="考试类型:">
        <el-input v-model="formData.examType" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item  prop="examNature" label="考试性质:">
        <el-input v-model="formData.examNature" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item  prop="examEare" label="考试范围:">
        <el-input v-model="formData.examEare" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item  prop="examPlan" label="考试安排:">
        <el-input v-model="formData.examPlan" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item  prop="examFrequency" label="考试频度:" disabled="disabled">
        <el-input v-model="formData.examFrequency"  disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item  prop="outlineSets" label="大纲制定:">
        <el-input v-model="formData.outlineSets" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item  prop="province" label="当前范围:" v-show="provinceShow">
        <el-select v-model="formData.province" placeholder="请选择省" @change="getCitys">
          <el-option
            v-for="item in provinces"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item   prop="city" v-show="cityShow">
        <el-select v-model="formData.city" placeholder="请选择市" @change="regionsMeth">
          <el-option
            v-for="item in citys"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="region" v-show="regionShow">
        <el-select v-model="formData.region" placeholder="请选择区">
          <el-option
            v-for="item in regions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" label="备注:">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitView">预览</el-button>
        <el-button @click="reloadLocal()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { ApiGet } from 'api/recommand'
  import { URL_GET, TIKA_NEWS, TIKA_SYSTEM} from 'api/config'
  export default {
    data() {
      return {
        options4: [],
        list: [],
        loading: false,
        statesData: [],
        provinces: [],
        ConsGroupsDatas: []
      }
    },
    props: {
      formData: {
        type: Object,
        required: true
      },
      ConsSmallDatas: {
        type: Array,
        required: true
      },
      examSubjectNumShow: {
        type: Boolean,
        default: false
      },
      post_put: {
        type: String,
        default: 'post'
      },
      provinceShow: {
        type: Boolean,
        default: false
      },
      cityShow: {
        type: Boolean,
        default: false
      },
      regionShow: {
        type: Boolean,
        default: false
      },
      provinceCityRegion: {
        type: Function
      },
      getCitys: {
        type: Function
      },
      citys: {
        type: Array,
        required: false
      },
      successFlag: {
        type: Number,
        required: true
      },
      regions: {
        type: Array,
        required: false
      },
      onSubmitView: {
        type: Function
      },
//      reloadLocal: {
//        type: Function
//      },
      getConsSmalls: {
        type: Function
      },
      regionsMeth: {
        type: Function
      },
      getConsSmallName: {
        type: Function
      },
      getAreaData:{
        type: String
      },
      reloadLocal: {
        type: Function
      }
    },
    created() {
      this._getExamName()
      this._getProvinceData()
      this._getStaticBigStyle()
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.options4 = []
        }
      },
      _getExamName(){
        let agencyCode= sessionStorage.getItem('agencyCode')
        let getData = {
          url: "/v1/news/NewsExamType/list?agencyCode="+agencyCode,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            this.statesData = [];
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.sequenceNbr
              temp.label = item.examName
              this.statesData.push(temp)
            })
            this.list = this.statesData.map(item => {
              return { value: item.value, label: item.label };
            })
            console.log(this.list)
          } else {
            alert(res.message)
            return
          }
        })
      },
      getExamData(val){
        if (this.post_put === 'put'){
          val = this.formData.examCode;
        }
        if (!val)return;
        let url = "/v1/news/NewsExamType/selectExamInfo?sequenceNbr=" + val
        let getData = {
          url: encodeURI(url),
          value: TIKA_NEWS
        }
        //this.formData = []
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200 && res.result[0]) {
            let subjectName = '';
            this.formData.parentidSeqName = res.result[0].parentidSeqName
            this.formData.examType = res.result[0].examType
            this.formData.examNature = res.result[0].examNature
            this.formData.examEare = res.result[0].examEare
            this.formData.examPlan = res.result[0].examPlan
            this.formData.examFrequency = res.result[0].examFrequency
            this.formData.outlineSets = res.result[0].outlineSets
            this.formData.examTypeSeq = res.result[0].sequenceNbr
            this.formData.examCode = res.result[0].examCode
            subjectName =  res.result[0][this.getAreaData]
            this.provinceCityRegion(subjectName)
          } else {
            alert("考试信息" + res.message)
            return
          }
        })
      },
      _getProvinceData(){
        let url = "/v1/systemctl/location/provinces"
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
              this.provinces.push(temp)
            })
          } else {
            alert(res.message)
            return
          }
        })
      },
      //查询静态 资讯大类
      _getStaticBigStyle(){
        let url = "/v1/news/staticinfotype/selectAllStaticInfoType"
        let getData = {
          url: encodeURI(url),
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.parentId
              temp.label = item.parentName
              this.ConsGroupsDatas.push(temp)
            })
          } else {
            console.log(res.message)
            return
          }
        })
      }
    }
  }
</script>
<style>
  .formRight{
    position: absolute;
    width: 20%;
    height: 100%;
    float: right;
    right: 50px;
    top: 100px;
    /*border-left: 2px dotted red;*/
  }
  .formRight .form-style{
    margin-top: 50px;
    margin-left: 5px;
  }
  .el-form-item{
    margin-bottom: 15px
  }
</style>
