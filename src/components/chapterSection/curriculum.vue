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
              :before-upload="beforeAvatarUpload"
              :on-success="upLoadSuccess"
              :on-remove="upLoadRemove"
              :file-list="tempChildren.fileList"
              :data="upLoadData">
              <el-button type="primary" size="mini"  @click="buttonClick(index,indexChildren)">点击上传</el-button>
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

      <el-row style="margin-top: 20px">
        <el-col :span="3">
          <el-input
            style="width: 80%;"
            placeholder="课时长度："
            :disabled="true">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            style="width: 80%;"
            placeholder="课时长度"
            icon="time"
            v-model="sumTime">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            style="width: 80%;"
            placeholder="全科金额："
            :disabled="true">
          </el-input>
        </el-col>
        <el-col :span="3">
          <span>{{sumMoneyCom.allMoney}}</span>
        </el-col>

        <el-col :span="12">
          <span>&nbsp;</span>
        </el-col>

      </el-row>

      <el-row style="margin-top: 20px;" :gutter="20" >
        <el-col :span="11">
          &nbsp;
        </el-col>
        <el-col :span="1">
          <el-button type="warning">取消</el-button>
        </el-col>
        <el-col :span="1">
          &nbsp;
        </el-col>
        <el-col :span="11">
          <el-button type="info" @click="onSubmit">提交</el-button>
        </el-col>
      </el-row>

    </div>
  </div>
</template>


<script>
  import $ from 'jquery'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, TIKA_AGENCY, TIKA_SYSTEM} from 'api/config'
  import { getQiNiuToken } from 'api/comFunction'
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
        movieList: [],
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
        ],
        sumTime: '',
        sumMoney: 0
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
          url: '/v1/systemctl/treeExamInfo/tree/ExamInfoLists?sourceStr=',
          value: TIKA_SYSTEM
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
      subjectChange(val){
        console.log(val)
      },
      buttonClick(index,indexChildren){
        this.orderNumClass = 0
        this.index=index
        this.indexChildren=indexChildren

        // if(this.index === 0){  //暂时不用
        //   this.orderNumClass = this.indexChildren
        // }else{
        //   this.orderNumClass += this.indexChildren
        //   for(let i=0;i<this.index;i++){
        //     this.orderNumClass += this.dateArrays[i].children.length
        //   }
        // }
        // console.log('this.orderNumClass========================')
        // console.log(this.orderNumClass)


      },
      upLoadSuccess(response, file, fileList){
        let url = this.domain + '/'+response.key;
        let temp={}
        temp.name=file.name
        temp.url=url
        this.movieList.push(temp)
        console.log('this.movieList====================')
        console.log(this.movieList)
      },
      upLoadRemove(file, fileList){
        console.log(fileList)
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
      beforeAvatarUpload(file){

        let flag = true
        this.dateArrays.forEach(res=>{
          res.children.forEach(resChildren=>{
            if(resChildren.name === file.name){
              flag = false
            }
            return
          })
          return
        })
        if(!flag){
          this.$message.error("您选择了同样名称的文件！！")
        }else{
          this.dateArrays[this.index].children[this.indexChildren].name = file.name
        }

        // console.log('111111111111111111111111111')
        // console.log(this.orderNumClass)  //暂时不用

        console.log('2222222222222222222222')
        console.log(this.dateArrays)
        return flag
      },
      onSubmit(){

        this.sumMoney=this.sumMoneyCom.allMoney
        console.log('this.sumMoney=========================')
        console.log(this.sumMoney)
        console.log('this.movieList====================')
        console.log(this.movieList)

        this.dateArrays.forEach((res,index)=>{
          res.children.forEach((resChildren,indexChildren)=>{
            this.movieList.forEach((resList,indexList)=>{
              if(resChildren.name=== resList.name){
                this.dateArrays[index].children[indexChildren].fileList[0] = resList
                delete this.movieList[indexList]
              }
            })
          })
        })
        console.log('this.dateArraysthis.dateArrays====================')
        console.log(this.dateArrays)
      },
      resetForm(name){
        this.$refs[name].resetFields();
      },
    },
    computed:{
      sumMoneyCom(){
        let allMoney=0
        this.dateArrays.forEach(res=>{
          res.children.forEach(res1=>{
            allMoney += parseInt(res1.money)
          })
        })
        return {allMoney:allMoney}
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

  .chapterSection .upload-demo{
    position: relative;
  }
  .chapterSection .el-upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    top: 0px;
    background: #fff;}

</style>

