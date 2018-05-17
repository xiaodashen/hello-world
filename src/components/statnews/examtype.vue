<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="examName" @blur="loseBlur" placeholder="考试名称" ></el-input>
          <el-input v-model="parentidSeqName" @blur="loseBlur" placeholder="考试行业" ></el-input>
          <el-input v-model="examType" @blur="loseBlur" placeholder="考试类型" ></el-input>
          <el-input v-model="examNature" @blur="loseBlur" placeholder="考试性质" ></el-input>
          <br><br>
          <el-input v-model="examEare" @blur="loseBlur" placeholder="考试范围" ></el-input>
          <el-input v-model="examPlan" @blur="loseBlur" placeholder="考试安排" ></el-input>
          <el-input v-model="examFrequency" @blur="loseBlur" placeholder="考试频度" ></el-input>
          <el-input v-model="createUserName" @blur="loseBlur" placeholder="创建人" ></el-input>
          <el-button type="primary" icon="plus" @click="addCons">新建考试类型</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClickExam">
        <el-table-column  prop="num"  label="序号" width="80"></el-table-column>
        <el-table-column  prop="examName"  label="考试名称"></el-table-column>
        <el-table-column  prop="parentidSeqName"  label="考试行业"></el-table-column>

        <el-table-column  prop="examType"  label="考试类型" ></el-table-column>
        <el-table-column  prop="examNature" label="考试性质"></el-table-column>
        <el-table-column  prop="examEare" label="考试范围"></el-table-column>
        <el-table-column  prop="examPlan" label="考试安排"></el-table-column>
        <el-table-column  prop="examFrequency" label="考试频度"></el-table-column>
        <el-table-column  prop="outlineSets" label="大纲制定"></el-table-column>
        <el-table-column  prop="reminder" label="是否提醒"></el-table-column>
        <el-table-column  prop="description" label="备注"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[5, 10, 15]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </div>
    </div>
    <div class="formRight" v-show = "showNo">
      <el-form :model="examDataForm" ref="examDataForm" label-width="90px" class="demo-dynamic">
        <el-form-item
          prop="examName"
          label="考试名称:"
          :rules="[
              {required: true, message: '考试名称不能为空',trigger: 'blur'}
            ]">
          <el-select
            v-model="examDataForm.examName"
            filterable
            remote
            placeholder="请输入关键词"
            @change="examChange"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item prop="parentidSeqName" label="考试大类:">
          <el-input v-model="examDataForm.parentidSeqName" disabled="disabled"  placeholder="请选择考试"></el-input>
        </el-form-item>
        <el-form-item
          prop="examType"
          label="考试类型:"
          :rules="[
              {required: true, message: '考试类型不能为空'}
            ]">
          <el-select v-model="examDataForm.examType" placeholder="请选择考试类型">
            <el-option
              v-for="item in selectEXAM_TYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="examNature"
          label="考试性质:"
          :rules="[
              {required: true, message: '考试性质不能为空'}
            ]">
          <el-select v-model="examDataForm.examNature" placeholder="请选择考试性质">
            <el-option
              v-for="item in selectEXAM_Nature"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="examFrequency"
          label="考试频度:"
          :rules="[
              {required: true, message: '考试频度不能为空'}
            ]">
          <el-select v-model="examDataForm.examFrequency" placeholder="请选择考试频度">
            <el-option
              v-for="item in selectEXAM_FREQ"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="examEare"
          label="考试范围:"
          :rules="[
              {required: true, message: '考试范围不能为空'}
            ]">
          <el-select v-model="examDataForm.examEare" placeholder="请选择考试范围">
            <el-option
              v-for="item in selectEXAM_EARE"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="examPlan"
          label="考试安排:"
          :rules="[
              {required: true, message: '考试安排不能为空'}
            ]">
          <el-select v-model="examDataForm.examPlan" placeholder="请选择考试安排">
            <el-option
              v-for="item in selectEXAM_PLAN"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="outlineSets"
          label="大纲制定:"
          :rules="[
              {required: true, message: '大纲制定不能为空'}
            ]">
          <el-select v-model="examDataForm.outlineSets" placeholder="请选择大纲制定">
            <el-option
              v-for="item in selectOUTLINE_SETS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="examTime"
          label="考试时间:"
          :rules="[
              {required: true, message: '考试时间不能为空'}
            ]">
          <el-date-picker
            v-model="examDataForm.examTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="reminder" label="是否提醒:"  v-if="post_put === 'put'">
          <el-input v-model="examDataForm.reminder" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input type="textarea" :maxlength="150" v-model="examDataForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('examDataForm')">保存</el-button>
          <el-button @click="resetForm('examDataForm')">取消</el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_RBAC,TIKA_NEWS ,TIKA_SYSTEM} from 'api/config'
  export default {
    data() {
      return {
        examName:'',
        parentidSeqName:'',
        examType:'',
        examNature:'',
        examEare:'',
        examPlan:'',
        examFrequency:'',
        createUserName:'',
        tableData: [],
        examDataForm: {
          parentidSeqNbr: '',
          parentidSeqName: '',
          examCode: '',
          examName: '',
          examType: '',
          examNature: '',
          examEare: '',
          examPlan: '',
          examTime: '',
          examFrequency: '',
          outlineSets: '',
          reminder: '',
          description: ''
        },
//        selectIndustryCategories: [],
        selectEXAM_TYPE: [],
        selectEXAM_EARE: [],
        selectEXAM_Nature: [],
        selectEXAM_PLAN: [],
        selectEXAM_FREQ: [],
        selectOUTLINE_SETS: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        value: '',
        showNo: false,
        current: 1,
        size: 10,
        total:0,
        post_put: 'post',
        selectStates: 0,


        options4: [],
        value9: [],
        list: [],
        loading: false,
        states: []
      }
    },
    mounted() {
      this._getmesLists()
      //this._getIndustryCategories()
      this._getExamAll()
      this._dictCode('EXAM_TYPE')
      this._dictCode('EXAM_EARE')
      this._dictCode('EXAM_Nature')
      this._dictCode('EXAM_PLAN')
      this._dictCode('EXAM_FREQ')
      this._dictCode('OUTLINE_SETS')

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

      loseBlur(){
        this._getmesLists();
      },
      //获取机构考试名称
      _getExamAll(){
        let agencyCode=sessionStorage.getItem('agencyCode')
        let getData = {
          url: '/v1/privilege/resource/agencyresourcearray?agencyCode='+agencyCode,
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
                this.states = []
                if(!res1.result.length){
                  alert('该机构下无考试信息！！！')
                  return
                }
                res1.result.forEach(item=>{
                  let temp = {}
                  temp.label = item.examName
                  temp.value = item.industryCode+','+item.examCode
                  this.states.push(temp)
                })
                this.list = this.states.map(item => {
                  return { value: item.value, label: item.label };
                })
              }else if(res1.status !== 401){
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
      examChange(val){
        if(!val || val.split(",").length < 2){
          return
        }
        this.examVal=val
        let strArr=[]
        strArr = val.split(",")
        this.examDataForm.examCode=strArr[1]
        let getData = {
          // url: "/v1/itembank/itembankIndustryInfo/getIndustryInfo/"+ strArr[0],
          url: "/v1/systemctl/treeIndustryInfo/getIndustryInfo/"+ strArr[0],
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            this.examDataForm.parentidSeqName=res.result.industryName
            this.examDataForm.parentidSeqNbr=res.result.sequenceNbr
          } else if(res.status !== 401) {
            console.log('获取考试所属行业大类出错：'+res.message)
            return
          }

        })
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.onSubmitApi()
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },

      onSubmitApi() {
        let examVal = this.examVal
        this.list.forEach((examNameData)=>{
          if(examVal === examNameData.value){
            this.examDataForm.examName = examNameData.label
          }
        })
        let url =''
        var urlType =''
        let format = this.examDataForm
        format.agencyCode = sessionStorage.getItem('agencyCode')
        format.recUserId = sessionStorage.getItem('userId')
        if(this.post_put === 'post'){
          format.createUserId = sessionStorage.getItem('userId')
          url = '/v1/news/NewsExamType'
          urlType = URL_POST
        }else{
          url = '/v1/news/NewsExamType/'+this.sequenceNbr
          urlType = URL_PUT
        }
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_NEWS
          }
        }
        ApiPost(postData, urlType).then((res) => {
          if(res.status === 200){
            this._getmesLists()
            this.showNo = false
            this.resetForm('examDataForm')
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      addCons() {//切换显示添加表单
        if(this.post_put === 'put'){
          this.resetForm('examDataForm')
          this.post_put = 'post'
        }
        this.showNo = true
      },
      _getmesLists() {//获取考试类型维护 分页信息列表
        let agencyCode = sessionStorage.getItem('agencyCode')
        let url = "/v1/news/NewsExamType/page?current="+ this.current + "&size=" + this.size+'&examName='+this.examName+
          '&parentidSeqName='+this.parentidSeqName+'&examType='+this.examType+'&examNature='+this.examNature+
          '&examEare='+this.examEare+'&examPlan='+this.examPlan+'&examFrequency='+this.examFrequency+
          '&recUserId='+this.createUserName+'&agencyCode='+agencyCode;
        let getData = {
          url: encodeURI(url),
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current = res.result.current
            var i = 1
            resData.forEach((temp) => {
              if(this.total < this.size){
                temp.num = i
                i++
              }else{
                temp.num = (current-1)*this.size + i
                i++
              }
              delete temp.extend1
              delete temp.extend2
              delete temp.extend3

              resDataTemp.push(temp)
            })
            this._mesLists(resDataTemp, pages, current)
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      _mesLists(resDatas, pages, current){
        this.tableData = resDatas
        this.pages = pages
        this.current = current
      },
      handleSizeChange(val) {
        this.size= val
        this._getmesLists()
      },
      handleCurrentChange(val) {
        this.current=val
        this._getmesLists()
      },
      tableRowClassName(row, index) {
        if (index === 1) {
          return 'info-row';
        } else if (index === 3) {
          return 'positive-row';
        }
        return '';
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.selectexamName=[]
        this.post_put = 'post'
        this.showNo = false
      },
      tableClickExam(row){
        this.selectexamName = []
        this.selectStates = 1 //select change事件标志位
        this.post_put = 'put'
        this.sequenceNbr = row.sequenceNbr
        let getData = {
          url: "/v1/news/NewsExamType/"+ this.sequenceNbr,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.examDataForm.parentidSeqNbr = res.result.parentidSeqNbr
            this.examDataForm.parentidSeqName = res.result.parentidSeqName
            this.examDataForm.examCode = res.result.examCode
            this.examDataForm.examName = res.result.examName
            this.examDataForm.examType = res.result.examType
            this.examDataForm.examNature = res.result.examNature
            this.examDataForm.examEare = res.result.examEare
            this.examDataForm.examPlan = res.result.examPlan
            this.examDataForm.examTime = new Date(res.result.examTime.replace(/-/g,"/"))
            this.examDataForm.examFrequency = res.result.examFrequency
            this.examDataForm.outlineSets = res.result.outlineSets
            this.examDataForm.reminder = res.result.reminder
            this.examDataForm.description = res.result.description
            let tempArr = {}
            tempArr.value = this.examDataForm.examCode
            tempArr.label = this.examDataForm.examName
            this.selectexamName.push(tempArr)
            if(!this.showNo){
              this.showNo = true
            }
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      _dictCode(dictCode){
        let getData = {
          url: "/v1/systemctl/dictionary/"+dictCode+"/all",
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          let selectName = 'select' + dictCode
          if(res.status === 200){
            res.result.forEach((dataFroEach)=>{
              let temp = {}
              temp.value = dataFroEach.dictDataValue
              temp.label = dataFroEach.dictDataValue
              this[selectName].push(temp)
            })
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
  .formRight .form-style{
    margin-top: 50px;
    margin-left: 5px;
  }
  .el-form-item{
    margin-bottom: 15px
  }
  .table-style .block{
    margin-top: 10px;
    margin-left: 20%
  }
  /*.el-table .info-row {*/
  /*background: #c9e5f5;*/
  /*}*/
  /*.el-table .positive-row {*/
  /*background: #e2f0e4;*/
  /*}*/
</style>


