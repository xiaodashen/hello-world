<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input @blur="loseBlur"  v-model="paperName" placeholder="试卷名称"></el-input>
          <el-input @blur="loseBlur"  v-model="extend1" placeholder="试卷科目"></el-input>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号"></el-table-column>
        <el-table-column  prop="paperName"  label="试卷名称"></el-table-column>
        <el-table-column  prop="extend1"  label="试卷科目"></el-table-column>
        <el-table-column  prop="paperTypeName"  label="试卷类型"></el-table-column>
        <el-table-column  prop="paperSumsCore" label="试卷总分"></el-table-column>
        <el-table-column  prop="paperSumsTime" label="答题时间"></el-table-column>
        <el-table-column  prop="createDate" label="组卷时间"></el-table-column>
        <el-table-column  prop="lockStatus" label="试卷状态"></el-table-column>
      </el-table>
      <div class="block" v-if="total>size">
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
    <div class="formRight" v-show="formShow">
      <el-form :model="paperMess" ref="paperMess" label-width="80px" class="demo-dynamic">
        <el-form-item prop="paperName" label="试卷名称:">
          <el-input v-model="paperMess.paperName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="extend1" label="试卷科目:">
          <el-input v-model="paperMess.extend1" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="paperTypeName" label="试卷类型:">
          <el-input v-model="paperMess.paperTypeName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="lockStatus" label="生效状态:">

          <el-select v-model="paperMess.lockStatus" @change="changeStatus" placeholder="请选择生效状态">
            <el-option
              v-for="item in LOCK_STATUES"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="questionCount" label="试题数量:">
          <el-input v-model="paperMess.questionCount"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="paperSumsCore" label="试卷分数:">
          <el-input v-model="paperMess.paperSumsCore" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="createDate"  label="组卷时间:">
          <el-input v-model="paperMess.createDate"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="paperMess.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <router-link :to="{path:'/statmaincons/addstatic',query: {sequenceNbr:paperMess.sequenceNbr}}">
            <el-button type="primary" >修改</el-button>
          </router-link>
          <el-button @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_PAPER, TIKA_SYSTEM } from 'api/config'
  export default {
    data() {
      return {
        tableData: [],
        paperMess: {},
        value: '',
        current: 1,
        size: 10,
        total:0,
        formShow: false,

        selectPAPER_TYPE:[
          {
            label:"所有类型",
            value:""
          }
        ],

        LOCK_STATUES:[
          {
            value: 'UNLOCK',
            label: '生效'
          },
          {
            value: 'LOCK',
            label: '禁用'
          }
        ],

        paperType:'VIP_EXAMS',
        paperName:'',
        extend1:''
      }
    },
    mounted() {
      this._getmesLists()
      this._dictCode('PAPER_TYPE')
    },
    methods: {
      loseBlur(){
        this._getmesLists()
      },
      typeCodeChange(val){
        this.paperType = val
        this._getmesLists()
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
      _getmesLists(data) {//获取试卷列表 分页信息列表
        let url= "/v1/paper/paperInfo/page?current="+ this.current + "&size=" + this.size + "&paperType=" + this.paperType + "&paperName=" + this.paperName+ "&extend1=" + this.extend1+ "&agencyCode=" + sessionStorage.getItem("agencyCode")
        let getData = {
          url: encodeURI(url),
          value: TIKA_PAPER
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200) {
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current =  0
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
              if(temp.lockStatus = 'UNLOCK'){
                temp.lockStatus = '生效'
              }else{
                temp.lockStatus = '禁用'
              }
              resDataTemp.push(temp)
            })
            this._mesLists(resDataTemp, pages, current)
          }else if(res.status!==401){
            alert('获取试卷列表出错：'+ res.message)
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
        let num = index % 2
        if (num === 1) {
          return 'info-row'
        } else{
          return 'positive-row'
        }
        return ''
      },
      resetForm() {
        this.formShow = false
      },
      tableClick(row){
        this.formShow=true
        this.sequenceNbr = row.sequenceNbr
        let getData = {
          url: `/v1/paper/paperInfo/${this.sequenceNbr}`,
          value: TIKA_PAPER
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            var resTemp = res.result
            this.paperMess = resTemp
          }else {
            alert(res.message)
            return
          }
        })
      },
      changeStatus(){
        let format ={
          lockStatus: this.paperMess.lockStatus,
          lockUserId: sessionStorage.getItem("userId"),
          recUserId: sessionStorage.getItem("userId")
        }

        let postData = {
          url: `/v1/paper/paperInfo/${this.sequenceNbr}`,
          data: {
            format: format,
            value: TIKA_PAPER
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          console.log(res)
          if(res.status === 200){
            this._getmesLists('')
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

  .table-style .search .el-button--primary{
    float: right;
    width: 20%
  }

  .search .el-input{
    width: 18%;
    display: inline-block;
  }

  .el-form-item{
    margin-bottom: 15px
  }
  .table-style .block{
    margin-top: 10px;
    margin-left: 20%
  }
  .table-style .search .top-line .el-select .el-input{
    margin-left: 15px;
    width: 90%;
  }


</style>

