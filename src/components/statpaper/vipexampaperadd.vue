<template>
  <div class="content-text">
    <div class="table-style" style="width: 65%;height:0">
      <div class="search">
        <div class="top-line">
          <el-select
          v-model="typeCode"
          @change="searchTypeCode"
          placeholder="题型搜索">
            <el-option
            v-for="item in selectQUESTION_TYPE"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="examPaperAdd">
        <el-table
          :data="tableData"
          v-if="tableData"
          :row-class-name="tableRowClassName"
          highlight-current-row
          @expand="expandClick"
          @row-dblclick="tableClick">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="试题题干:">
                  <span v-html="props.row.title"></span>
                </el-form-item>
                <br>
                <el-form-item label="选项:">
                  <span v-html="props.row.selectItem"></span>
                </el-form-item>
                <el-form-item label="答案:">
                  <span v-html="props.row.answer"></span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column  prop="num"  label="序号"></el-table-column>
          <el-table-column  prop="questionCode"  label="试题编号"></el-table-column>
          <el-table-column  prop="typeName"  label="试题类型"></el-table-column>
          <el-table-column  prop="propName"  label="试卷类型"></el-table-column>
          <el-table-column  prop="diffcultyLevel" label="难度"></el-table-column>

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
    </div>
    <div class="addPaperRight" >

      <el-form
        :inline="true"
        :model="paperMessage"
        style="padding:15px"
        ref="dialogDataRef">
        <el-form-item
          prop="subjectCode"
          :rules="[{required: true, message: '角色名称不能为空', trigger: 'blur'}]">
          <el-select
          v-model="paperMessage.subjectCode"
          filterable
          remote
          :disabled= "!subjectStatus.flag"
          @change="subjectChange"
          placeholder="科目关键词"
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
        <el-form-item prop="paperName">
          <el-input v-model="paperMessage.paperName" placeholder="试卷名称"></el-input>
        </el-form-item>
        <el-form-item
          prop="paperSumsTime"
         >
          <el-input v-model="paperMessage.paperSumsTime" placeholder="考试时长"></el-input>
        </el-form-item>
        <el-form-item

          prop="qualifiedScore">
          <el-input v-model="paperMessage.qualifiedScore" placeholder="合格分数"></el-input>
        </el-form-item>
        <el-form-item prop="paperYear">
          <el-select v-model="paperMessage.paperYear" placeholder="试卷年份">
            <el-option
              v-for="item in paperYears"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="paperType">
          <el-select v-model="paperMessage.paperType" disabled placeholder="试卷类型">
            <el-option
            v-for="item in paperTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>



      </el-form>
      <div class="addTitle">
        <el-row>
          <el-col :span="2">
               &nbsp;
          </el-col>
          <el-col :span="6">
            <span style="margin-left: 20px">试卷模块</span>
          </el-col>
          <el-col :span="6">
            <span style="margin-left: 20px">题型</span>
          </el-col>
          <el-col :span="4">
            <span>数量</span>
          </el-col>
          <el-col :span="4">
            <span>分值</span>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="edit" @click="addModel" size="small"></el-button>
          </el-col>
        </el-row>
      </div>
      <div class="addContainer">
        <div v-for="(modelData,index) in modelDatas" :key="index">
          <el-row :class="index === checkIndex ? 'expandClass': ''">
            <el-col :span="2">
              <div  @click="expandClickCol(index)">
                <span style="margin-left: 30px" class="el-tree-node__expand-icon" v-if="modelData.expandedTag"></span>
                <span style="margin-left: 30px" class="el-tree-node__expand-icon expanded" v-else></span>
              </div>
            </el-col>
            <div @click="elRowClick(index)">
              <el-col :span="6">
                <el-input
                  class="input-new-tag"
                  v-if="modelData.inputVisible"
                  v-model="modelData.paperModelName"
                  :ref="modelData.paperModelRef"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(index,modelData.paperModelName)"
                  @blur="handleInputConfirm(index,modelData.paperModelName)"
                >
                </el-input>

                <span
                  v-else
                  @dblclick="dbHandleInputConfirm(index)"
                  style="margin-left: 20px; height: 22px; display: block">
                  {{modelData.paperModelName}}
                </span>

              </el-col>
              <el-col :span="6">
                <span style="margin-left: 20px;">{{modelData.questionType}}</span>
              </el-col>
              <el-col :span="4">
                <span>{{modelData.sum}}</span>
              </el-col>
              <el-col :span="4">

                <el-input
                  class="input-new-tag"
                  v-if="modelData.sourceVisible"
                  v-model="modelData.source"
                  :ref="modelData.paperModelRef"
                  size="mini"
                  @keyup.enter.native="sourceInputConfirm(index,modelData.source)"
                  @blur="sourceInputConfirm(index,modelData.source)"
                >
                </el-input>
                <span
                  v-else
                  style="height: 22px; display: block"
                  @dblclick="dbSourceInputConfirm(index)">
                {{modelData.source}}
              </span>
              </el-col>
            </div>
            <el-col :span="2">
              <el-button type="primary" icon="delete2" size="mini" @click="delModel(index)"></el-button>
            </el-col>
          </el-row>
          <el-row v-if="!modelData.expandedTag"  v-for="(modelChild,indexChild) in modelData.children" :key="indexChild" class="childClass">
            <el-col :span="2">
              <span> </span>
            </el-col>
            <el-col :span="1">
              <span>{{indexChild+1}}</span>
            </el-col>
            <el-col :span="15">
              <span>{{modelChild.questionCode}}</span>
            </el-col>

            <el-col :span="3">
              <el-input
                class="input-new-tag"
                v-if="modelChild.sourceVisible"
                v-model="modelChild.source"
                :ref="modelChild.childRef"
                size="mini"
                @keyup.enter.native="childSourceInputConfirm(index,indexChild,modelChild.source)"
                @blur="childSourceInputConfirm(index,indexChild,modelChild.source)">
              </el-input>
              <span
                v-else
                style="height: 22px; display: block"
                @dblclick="dbChildrenSourceInputConfirm(index,indexChild)">
                {{modelChild.source}}
              </span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" icon="delete2" size="mini" @click="delChild(index,indexChild)"></el-button>
            </el-col>

            <el-col :span="1">
              <span>  </span>
            </el-col>
          </el-row>
        </div>
        <div class="totalBottom">
          <div class="totalSum">
            <el-row>
              <el-col :span="6">
              <span>
                试题数量：
              </span>
              </el-col>
              <el-col :span="6">
                <span>
                  {{addSourceNum.numSum}}道
                </span>
              </el-col>
              <el-col :span="6">
              <span>
                总分值：
              </span>
              </el-col>
              <el-col :span="6">
              <span>
                {{addSourceNum.sourceSum}}分
              </span>
              </el-col>
            </el-row>
          </div>
          <div class="submitClass">
            <el-row>
              <el-col :span="12">
                <el-button type="success" @click="submit">保存</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="info" @click="unSubmit">取消</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_PAPER, TIKA_SYSTEM, TIKA_VIP } from 'api/config'
  import { getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      return {
        tableData: [],
        staticNewMes: {},
        value: '',
        current: 1,
        size: 10,
        total:0,

        paperYears:[
          {
            value: 2016,
            label: 2016
          },
          {
            value: 2017,
            label: 2017
          }
        ],

        paperTypes: [],

        selectQUESTION_TYPE: [
          {
            label: '所有题型',
            value: ''
          }
        ],
        selectQUESTION_PROP:[
          {
            label: '所有类型',
            value: ''
          }
        ],
        options4: [],
        value9: [],
        list: [],
        loading: false,
        modelDatas:[],

        checkIndex: 0,

        sourceSum: 0,//总分数
        number: 0,//试题总数量



        typeCode: '',
        questionProp: 'VIP_QUESTION',

        paperMessage:{
          subjectCode:[],
          paperName: '',
          paperSumsTime: '',
          qualifiedScore: '',
          paperYear: '',
          paperType: 'VIP_EXAMS,VIP试卷'
        }


      }
    },
    mounted() {
      this._getAllSubject()
      this._getPaperTypeData()
      this._dictCode('PAPER_TYPE')
      this._dictCode('QUESTION_TYPE')
      this._dictCode('QUESTION_PROP')
    },
    methods: {
      searchQuestionProp(val){
        this.questionProp=val
        this._getQuestionLists()
      },
      searchTypeCode(val){
        this.typeCode=val
        this._getQuestionLists()
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
              temp.value = dataFroEach.dictDataKey
              temp.label = dataFroEach.dictDataValue
              this[selectName].push(temp)
            })
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      _getQuestionLists(data) {//获取试题列表 分页信息列表val

        let getData = {
          url: "/v1/viptiku/QuestionInfoVip/bigAndSmallPage?subjectCode="+this.val+'&current='+ this.current + "&size=" + this.size+ "&typeCode=" + this.typeCode + "&agencyCode=" + sessionStorage.getItem("agencyCode"),
          value: TIKA_VIP
        }
        console.log(getData)
        ApiGet(getData, URL_GET).then((res)=>{
          console.log(res)
          if(res.status === 200) {
            if(!res.result){
              alert('该科目下无试题信息！！')
              return
            }
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current = 0
            if(!data){
              current = res.result.current
            }else{
              current = pages
            }
            var i = 1
            resData.forEach((temp) => {
              if (this.total < this.size) {
                temp.num = i
                i++
              } else {
                temp.num = (current - 1) * this.size + i
                i++
              }
              resDataTemp.push(temp)
            })
            this._mesLists(resDataTemp, pages, current)
          }else if (res.status !== 401){
            alert('获取试题信息出错：'+ res.message)
            return
          }
        })
      },
      _mesLists(resDatas, pages, current){
        this.tableData = resDatas
        this.pages = pages
        this.current = current
      },
      _getPaperTypeData(){
        getDictionaryData('PAPER_TYPE').then(res=>{
          if(res){
            this.paperTypes= []
            res.forEach(item=>{
              let temp = {}
              temp.value = item.dictDataKey+','+item.dictDataValue
              temp.label = item.dictDataValue
              this.paperTypes.push(temp)
            })
          }else{
            console.log('获取试卷类型失败！')
            return
          }
        })
      },
      handleSizeChange(val) {
        this.size= val
        this._getQuestionLists()
      },
      _getAllSubject() {//获取所有科目
        let getData = {
          url: `/v1/systemctl/treeSubject/list`,
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          console.log('_getAllSubject() {//获取所有科目')
          console.log(res)
          if(res.status === 200) {
            this.list = res.result.map(item => {
              return { value: item.subjectCode+','+item.subjectName, label: item.subjectName };
            });
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      subjectChange(val){
        if(!val){
          return
        }
        this.val =val.split(',')[0]
        this._getQuestionLists()
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
      handleCurrentChange(val) {
        this.current=val
        this._getQuestionLists()
      },
      tableRowClassName(row, index) {
        let num = index % 2
        if (num === 1) {
          return 'info-row'
        } else{
          return 'positive-row'
        }
        return ''
      },
      tableClick(row){
        this.questionCode = row.questionCode
        this.typeName = row.typeName
        this.flag = false
        if(this.modelDatas.length === 0){
          alert('请增加试卷模块！！')
          return
        }
        this.modelDatas.forEach(res=>{
          res.children.forEach(temp=>{
            if(this.questionCode === temp.questionCode){
              this.flag = true
              return
            }
            return
          })
          return
        })
        if(this.flag){
          alert('你选择的试题已存在！！')
          return
        }
        this.modelDatas[this.checkIndex].expandedTag=false
        if(!this.modelDatas[this.checkIndex].questionType){
          this.modelDatas[this.checkIndex].questionType = this.typeName
          let tempData ={
            num:1,
            questionCode: this.questionCode,
            source:this.modelDatas[this.checkIndex].source,
            sourceVisible: false,
            childRef: 'childRef' + this.modelDatas[this.checkIndex].num + 1
          }
          this.modelDatas[this.checkIndex].children.push(tempData)
        }else{
          if(this.modelDatas[this.checkIndex].questionType === this.typeName){
            let leng = this.modelDatas[this.checkIndex].children.length-1
            let tempData ={}
            tempData.num = this.modelDatas[this.checkIndex].children[leng].num+1
            tempData.questionCode = this.questionCode
            tempData.source=this.modelDatas[this.checkIndex].source
            tempData.sourceVisible = false,
            tempData.childRef='childRef' + this.modelDatas[this.checkIndex].num + tempData.num
            this.modelDatas[this.checkIndex].children.push(tempData)
          }else{
            alert('您输入的是'+this.typeName+'，不是'+this.modelDatas[this.checkIndex].questionType)
            return
          }
        }
        let childLeng = this.modelDatas[this.checkIndex].children.length
        this.modelDatas[this.checkIndex].sum = childLeng
      },
      expandClick(row,flag){
        console.log(row);
        console.log(flag);
      },
      addModel(){
        let tempData={}
        let tempSource = this.modelDatas.length
        if(tempSource === 0){
          tempData={
            num: 1,
            paperModelName: '',
            sum: 0,
            source: 2,
            questionType: '',
            paperModelRef: 'paperModelRef1',
            sourceRef: 'sourceRef1',
            inputVisible: true,
            sourceVisible: false,
            expandedTag: true,
            children: []
          }
          this.checkIndex = 0
        }else{
          let flag = false
          this.modelDatas.forEach(res=>{
            if(!res.paperModelName){
              alert('请输入试卷模块名称！')
              flag = true
              return
            }
            return
          })
          if(flag){
            return
          }
          tempData.num = this.modelDatas[tempSource-1].num +1
          tempData.paperModelName = ''
          tempData.sum = 0
          tempData.source = 2
          tempData.questionType = ''
          tempData.paperModelRef =  'paperModelRef'+ (tempData.num+1)
          tempData.sourceRef =  'sourceRef'+ (tempData.num+1)
          tempData.inputVisible = true
          tempData.sourceVisible = false
          tempData.expandedTag = true
          tempData.children = []
          this.checkIndex = tempSource
        }
        this.modelDatas.push(tempData)
      },
      handleInputConfirm(index,val){//大类名称输入
        if(!val){
          alert('名称不能为空！！')
          return
        }
        let temp = false
        this.modelDatas.forEach((res,ind)=>{
          if(index != ind && res.paperModelName === val){
            temp = true
          }
        })
        if(temp){
          alert('试卷模块重复了！！')
          this.modelDatas[index].paperModelName=''
          return
        }
        this.modelDatas[index].inputVisible = false
      },
      dbHandleInputConfirm(index){//大类名称双击编辑
        this.modelDatas[index].inputVisible = true
      },
      sourceInputConfirm(index,val){//分数输入

        var r = /^\+?[1-9][0-9]*$/;　　//正整数
        let flag = r.test(val)

        if(!flag){
          alert('请输入整数！！')
          this.modelDatas[index].source= 2
          return
        }
        this.modelDatas[index].children.forEach((res,indexChild)=>{
          this.modelDatas[index].children[indexChild].source = val
        })
        this.modelDatas[index].sourceVisible = false
      },
      dbSourceInputConfirm(index){ //大类分数双击编辑
        this.modelDatas[index].sourceVisible = true
      },
      expandClickCol(index){ //箭头展开
        this.modelDatas[index].expandedTag = !this.modelDatas[index].expandedTag
      },
      delModel(index){ //删除大类
        if(this.checkIndex > index){
          this.checkIndex = this.checkIndex-1
        }
        if(this.checkIndex === this.modelDatas.length-1 ){
          this.checkIndex = index-1
        }
        this.modelDatas.splice(index,1)
      },
      elRowClick(index){ // 行选择
        this.checkIndex = index
      },
      delChild(index,indexChild){
        console.log(index,indexChild)
        this.modelDatas[index].children.splice(indexChild,1)
        this.modelDatas[index].sum = this.modelDatas[index].sum-1
      },
      childSourceInputConfirm(index,indexChild,val){
        var r = /^\+?[1-9][0-9]*$/;　　//正整数
        let flag = r.test(val)
        if(!flag){
          alert('请输入整数！！')
          this.modelDatas[index].children[indexChild].source= this.modelDatas[index].source
          return
        }
        this.modelDatas[index].children[indexChild].sourceVisible = false
      },
      dbChildrenSourceInputConfirm(index,indexChild){
        this.modelDatas[index].children[indexChild].sourceVisible = true
      },
      submit(){
        if(this.modelDatas.length ===0){
          alert("无试卷模块!!")
          return
        }
        let num = this.modelDatas.length -1
        if(this.modelDatas[num].paperModelName === ''){
          alert("试卷模块名称不能为空!!")
          return
        }
        let flag = false
        this.modelDatas.forEach(res=>{
          if(res.children.length === 0){
            flag = true
            return
          }
          return
        })

        if(flag){
          alert("试卷模块需加入试题！！")
          return
        }
        let format = {}
        let subject = this.paperMessage.subjectCode.split(',')
        let paperTypeData = this.paperMessage.paperType.split(',')
        format.paperName= this.paperMessage.paperName
        format.paperType= paperTypeData[0]
        format.paperTypeName= paperTypeData[1]
        format.examCode= '111'
        format.subjectCode= subject[0]
        format.subjectName= subject[1]
        format.paperSumsTime= this.paperMessage.paperSumsTime
        format.qualifiedScore = this.paperMessage.qualifiedScore
        format.paperYear = this.paperMessage.paperYear

        format.paperSumsScore=  this.addSourceNum.sourceSum
        format.questionCount=  this.addSourceNum.numSum
        format.paperQuestionTypeModelLists = this.modelDatas
        format.agencyCode = sessionStorage.getItem("agencyCode")

        format.recUserId=format.createUserId = sessionStorage.getItem("userId")
        let url = '/v1/paper/paperInfo'
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_PAPER
          }
        }

        ApiPost(postData, URL_POST).then((res) => {
          if(res.status === 200){
            this.$refs['dialogDataRef'].resetFields()
            this.modelDatas=[]
          }else if(res.status !== 401){
            alert('创建试卷出错：'+res.message)
            return
          }
        })
      },
      unSubmit(){
        this.$refs['dialogDataRef'].resetFields()
        this.modelDatas = []
      }
    },
    computed:{
      addSourceNum(){
        let numSum = 0
        let sourceSum = 0
        if(this.modelDatas.length === 0){
          numSum = 0
          sourceSum = 0
          return {numSum: numSum,sourceSum:sourceSum}
        }else{
          this.modelDatas.forEach(res=>{
            numSum+= res.children.length
          })
          this.modelDatas.forEach(res=>{
            res.children.forEach(resChild=>{
              let sumTemp =  parseInt(resChild.source)
              sourceSum = sourceSum + sumTemp
            })
          })
          return {numSum: numSum,sourceSum:sourceSum}
        }
      },
      subjectStatus(){
        let flag = false
        if(this.modelDatas.length === 0){
          flag = true
        }
        return {flag: flag}
      }
    }
  }
</script>

<style>

  .addPaperRight{
    width: 30%;
    min-height: 600px;
    position: relative;
    left:68%;
    background:#fff;
  }
  .addPaperRight .addTitle{
    padding: 10px
  }
  .addPaperRight .el-row{
    background: #fff;
    display: block;
    margin: 15px auto;
  }
  .addPaperRight .el-row .el-col{
    font-size: 15px;
    height: 20px;

  }

  .el-table .info-row {
    background: #c9e5f5;
  }
  .el-table .positive-row {
    background: #e2f0e4;
  }

  .addPaperRight .addContainer{
    padding:5px;
    height: 260px;
    overflow: scroll;
  }
  .addPaperRight .addContainer .expandClass {
    background: #eef1f6;

  }

  .addPaperRight .addContainer .childClass{
    margin: 10px auto;
  }
  .addPaperRight .addContainer .totalBottom{
    position: absolute;
    bottom:20px;
    width: 100%
  }
  .addPaperRight .addContainer .totalBottom .totalSum, .submitClass{
    display: block;
    width:100%
  }
  .addPaperRight .addContainer .totalBottom .submitClass button{
    margin-left: 30%;
  }
  .addPaperRight .addContainer .totalBottom .totalSum span{
    margin-left: 30%;
  }

  .el-form--inline .el-form-item{
    width:41%;
    margin-left: 20px;
  }
  .content-text .table-style .search .top-line .el-select .el-input{
    margin-left: 15px;
    width: 90%;
  }


</style>

