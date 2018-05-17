<template>
  <div class="table-style">
    <div class="search">
      <div class="top-line">
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
        <el-select
          v-model="subjectName"
          placeholder="科目名称"
          filterable
          remote
          @change="subjectChange"
          :remote-method="remoteMethodSubject"
          :loading="loadingSubject">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="classList">
      <el-row :gutter="20" class="classTitle">
        <el-col :span="6">
          <span>章节名称</span>
        </el-col>
        <el-col :span="12">
          <span>视频名称</span>
        </el-col>
        <el-col :span="3">
          <span>视频状态</span>
        </el-col>
        <el-col :span="3">
          <span>价格</span>
        </el-col>
      </el-row>
      <el-row v-for="(temp,index) in dateArrays" class="chapterSection">
        <el-col :span="24" class="classChapter">
          <span>{{temp.chapterTitle}}</span>
        </el-col>
        <el-row :span="24" class="classSection" v-for="(tempChildren,indexChildren) in temp.children">
          <el-col :span="6">
            <span>{{tempChildren.sectionTitle}}</span>
          </el-col>
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              action="http://upload.qiniu.com"
              :on-change="handleChange"
              :on-success="upLoadSuccess"
              :on-remove="upLoadRemove"
              :on-error="upLoadErr"
              :file-list="tempChildren.fileList"
              :data="upLoadData">
              <el-button type="primary" size="mini" class="buttonClass">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="3">
            <el-select
              style="width: 80%;"
              v-model="tempChildren.payType"
              @change="payTypeChange(index,indexChildren)"
              placeholder="收费类型">
              <el-option
                v-for="item in payTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="tempChildren.money"
              style="width: 80%;"
              :disabled="tempChildren.payType">
            </el-input>
          </el-col>
        </el-row>
      </el-row>

      <el-row></el-row>

    </div>
  </div>
</template>


<script>
  import $ from 'jquery'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_AGENCY, TIKA_RBAC,TIKA_TIKU,TIKA_NEWS} from 'api/config'
  import { getQiNiuToken, upQiNiuFile, getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      return {
        examName:'',
        examCode:'',

        options5: [],
        listExam: [],
        loadingExam: false,

        subjectName:'',
        subjectCode:'',

        options4: [],
        listSubject: [],
        loadingSubject: false,

        upLoadData:{},

        payTypes:[
          {
            label: '免费',
            value : true
          },
          {
            label: '收费',
            value : false
          }
        ],
        dateArrays:[
          {
            chapterTitle: '第一章 测试章1',
            chapterCode: '1231456',
            children:[
              {
                sectionTitle: '第一节 测试节11',
                sectionCode: '111111111111',
                name: '',
                fileList:[],
                payType: false,
                money: 0
              },
              {
                sectionTitle: '第二节 测试节12',
                sectionCode: '111111111111',
                name: '',
                fileList:[],
                payType: false,
                money: 0
              }
            ]
          },
          {
            chapterTitle: '第二章 测试章2',
            chapterCode: '1231456',
            children:[
              {
                sectionTitle: '第一节 测试节21',
                sectionCode: '111111111111',
                name: '',
                fileList:[],
                payType: false,
                money: 0
              },
              {
                sectionTitle: '第二节 测试节22',
                sectionCode: '111111111111',
                name: '',
                fileList:[],
                payType: false,
                money: 0
              }
            ]
          }
        ]
      }
    },
    mounted() {
      this._getExamAll()
      this._getQiNiuToken()
    },
    methods: {
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.upLoadData.token = res.upToken
          this.domain = res.domain
        })
      },
      examChange(value){
        this.examCode = value;
        this._getSubject()
      },
      //获取机构下的所有考试
      _getExamAll(){
        let getData = {
          url: '/v1/itembank/itembankExamInfo/itembank/ExamInfoLists?sourceStr=',
          value: TIKA_TIKU
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.statesExam = []
            if(!res.result.length){
              alert('该机构下无考试信息！！！')
              return
            }
            res.result.forEach(item=>{
              let temp = {}
              temp.label = item.examName
              temp.value = item.examCode
              this.statesExam.push(temp)
            })
            this.listExam = this.statesExam.map(item => {
              return { value: item.value, label: item.label };
            })
          }else if(res.status !== 401){
            alert('获取当前机构所有考试出错：'+res.message)
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
      payTypeChange(index,indexChildren){
        if(this.dateArrays[index].children[indexChildren].payType){
          this.dateArrays[index].children[indexChildren].money = 0
        }
      },
      buttonClick(el){
        console.log('000000000000000000000')

        console.log(el)
      },
      _getSubject(){},
      remoteMethodSubject(query) {
        if (query !== '') {
          this.loadingSubject = true;
          setTimeout(() => {
            this.loadingSubject = false;
            this.options4 = this.listSubject.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      upLoadSuccess(response, file, fileList){
        console.log('fileList==================')
        console.log(fileList)
      },
      handleChange(file,fileList){
        console.log(file)
        console.log(fileList)


        // if (file.status === 'loading' || file.status === 'finish' || file.status === 'fail'){
        //
        //   $(".el-upload").removeClass("upLoadClass")
        // } else {
        //   $(".el-upload").addClass("upLoadClass")
        // }
      },


      onSubmit(){},
      resetForm(name){
        this.$refs[name].resetFields();
      }
    }
  }
</script>

<style>


  .el-form-item{
    margin-bottom: 15px
  }

  .table-style .search .top-line .el-select .el-input{
    width:90%;
  }
  .classList .classTitle{
    padding: 10px;
  }
  .classList .classTitle span{
    font-size: 18px;
  }
  .classList .classChapter{
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .classList .classChapter span{
    font-size: 16px;
  }
  .classList .classSection{
    padding: 5px
  }
  .classList .classSection span{
    font-size: 15px;
  }
  .classList{
    padding: 20px;
    background: #fff;
  }
  .upLoadClass{
    display: none;
    /*text-align: center;*/
    /*cursor: pointer;*/
  }




</style>

