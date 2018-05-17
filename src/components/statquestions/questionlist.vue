<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <!--<el-input v-model="subjectCode" @blur="loseBlur" placeholder="试题科目" ></el-input>-->
          <el-select
            v-model="subjectCode"
            filterable
            remote
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

          <el-select
            v-model="typeCode"
            @change="typeCodeChange"
            placeholder="请选择试题类型"
          >
            <el-option
              v-for="item in selectQUESTION_TYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号" width="80"></el-table-column>
        <el-table-column  prop="questionCode"  label="试题编号"></el-table-column>
        <el-table-column  prop="dictDataValue"  label="试题类型"></el-table-column>
        <el-table-column  prop="subjectName"  label="试题科目"></el-table-column>
        <el-table-column  prop="createTime" label="上传时间"></el-table-column>
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
    <div class="formRight" v-show="formShow">
      <el-form :model="questionNewMes" ref="questionNewMes" label-width="80px" class="demo-dynamic">
        <el-form-item prop="questionCode" label="试题编号:">
          <el-input v-model="questionNewMes.questionCode"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="dictDataValue" label="试题题型:">
          <el-input v-model="questionNewMes.dictDataValue" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="subjectName" label="试题科目:">
          <el-input v-model="questionNewMes.subjectName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="createTime" label="上传时间:">
          <el-input v-model="questionNewMes.createTime" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input type="textarea" v-model="questionNewMes.description"  ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">取消</el-button>
          <el-button type="danger" @click="delForm">废弃</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, TIKA_SYSTEM,TIKA_TIKU } from 'api/config'
  export default {
    data() {
      return {
        subjectCode: '',
        typeCode: '',

        selectQUESTION_TYPE: [
          {
            value: '',
            label: '所有题型'
          }
        ],
        typeCodes:[],

        tableData: [],
        questionNewMes:{},

        value: '',
        current: 1,
        size: 10,
        total:0,
        formShow: false,



        options4: [],
        value9: [],
        list: [],
        loading: false,
        questionProp: "OLD_QUESTION"
      }
    },
    mounted() {
      this._getMesLists()
      this._dictCode('QUESTION_TYPE')
      this._getAllSubject()
    },
    methods: {
      loseBlur(){
        this._getMesLists()
      },
      _getAllSubject() {//获取所有科目
        let getData = {
          // url: '/v1/itembank/itembankSubject/listOfAgency',
          url: '/v1/systemctl/treeSubject/listOfAgency',

          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{

          console.log(res)
          if(res.status === 200) {
            this.list = res.result.map(item => {
              return { value: item.subjectCode, label: item.subjectName };
            });
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
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
      subjectChange(val){
        this.subjectCode = val
        this._getMesLists()
      },
      typeCodeChange(val){
        this.typeCode = val
        this._getMesLists()
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
      _getMesLists() {//获取试题 分页信息列表
        let url= "/v1/itembank/ItembankQuestionInfo/bigAndSmallPage/question?subjectCode=" + this.subjectCode+'&current=' + this.current + "&size=" + this.size+ "&typeCode=" + this.typeCode+ "&agencyCode="+ sessionStorage.getItem("agencyCode")
        let getData = {
          url: url,
          value: TIKA_TIKU
        }
        console.log(getData)

        ApiGet(getData, URL_GET).then((res)=>{
          console.log(res)
          if(res.status === 200) {
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current = res.result.current
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
          }else if(res.status!==401){
            alert('获取试题列表出错：'+ res.message)
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
        this._getMesLists()
      },
      handleCurrentChange(val) {
        this.current=val
        this._getMesLists()
      },
      resetForm() {
        this.formShow = false
      },
      delForm(){
        console.log('废弃！！')
      },
      tableClick(row){
        console.log(row)
        this.sequenceNbr = row.sequenceNbr
        this.questionNewMes = row
        this.formShow = true
      }
    }
  }
</script>

<style>

  .content-text .table-style .search .el-button--primary{
    float: right;
    width: 20%
  }
  .content-text .table-style .search .top-line .el-select .el-input{
    margin-left: 15px;
    width: 90%;
  }
  .el-form-item{
    margin-bottom: 15px
  }
  .table-style .block{
    margin-top: 10px;
    margin-left: 20%
  }

</style>

