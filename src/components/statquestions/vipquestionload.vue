<template>
  <div class="content-right">
    <div class="tempExam">
      <el-button type="primary">模板填写样例</el-button>
      <el-table  :data="tableData" border style="width: 100%;margin-bottom: 20px">
        <el-table-column  prop="title"  label="题干"  width="260">
        </el-table-column>
        <el-table-column   prop="type" label="题型">
        </el-table-column>
        <el-table-column prop="item" label="选项" width="230">
        </el-table-column>
        <el-table-column prop="answer" label="答案">
        </el-table-column>
        <el-table-column prop="questionType" label="试题类型">
        </el-table-column>
        <el-table-column  prop="hard" label="难度">
        </el-table-column>
        <el-table-column prop="knowledge" label="知识点" width="240">
        </el-table-column>
      </el-table>
      <div class="loadDes">
        <span>模板要求:</span>
        <p>模板内“*”列数据为必填字段，不可为空；</p>
        <p> 一种模板只可导入一种试题；</p>
        <p>选项填写：当试题有多个选项时，序号用“####”隔开</p>

        <p>答案填写：当试题有多个答案时，序号用“，”隔开；</p>
        <p>难度填写：难度区间从0~10，根据实际情况填写；</p>
        <p>知识点填写：当试题有多个知识点时，用“####”隔开；知识点名称必须按照章节科目树中知识点名称输入，否则导入将不成功。</p>
      </div>
    </div>
    <div class="questionTempExam">
      <el-button type="primary">试题导入模板</el-button>

      <el-row style="margin-top: 10px">
        <el-col
          :span="12"
          v-for="(colData,index) in colDatas"
          :key="index">
          <el-row>
            <el-col :span="1">{{index+1}}.</el-col>
            <el-col :span="19" v-html="colData.title"></el-col>
            <el-col :span="4">
              <a :href="colData.downLoadName">点击下载</a>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="questionLoad">
      <div class="editor-xls" style="margin-top: 10px;margin-bottom: 20px">
        <div class="uploadQiNiu">
          <el-button type="primary" style="margin-top: 10px;margin-bottom: 20px">试题导入</el-button>
          <br>
          <input type="file" id="file_upload"/>
          <br>
          <div class="loadDes">
            <span>导入说明：</span>
            <p>必须按照标准文件名进行导入文件的命名，方可进行试题的导入；</p>
            <p>如需要导入二级建造师，历年真题，单项选择题;</p>
            <p>导入文件的名称应为：二级建造师-历年真题-单项选择题。</p>
            <span>模板要求：</span>
            <p>必须下载指定模板进行试题内容填充，自定义表格会出现导入出错；</p>
            <p>模板内“*”列数据为必填字段，不可为空；</p>
            <p>一种模板只可导入一种试题。</p>
          </div>
          <el-button type="primary" @click="submitUpload"  v-if="uploadQiNiu">上传到服务器</el-button>
          <el-button type="success" @click="lastStep" v-if="uploadEnd">下载标识文件</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { ApiGet,ApiPost,ApiMul } from 'api/recommand'
  import { URL_GET, TIKA_SYSTEM, LOAD_URL} from 'api/config'
  import { getQiNiuToken, upQiNiuFile, getDictionaryData } from 'api/comFunction'


  export default {
    data() {
      return {
        tableData: [
          {
            title: '以下选项中说法正确的是（       ）',
            type: '多项选择题',
            item: '第1选项####第2选项####第3选项####第4选项',
            answer: '2,4',
            questionType: '历年真题',
            hard: 3,
            knowledge: '承包商的定义####承包商的资格'
          },
          {
            title: '对于承包商的这项说法，是否正确？',
            type: '是非题',
            item: '正确####错误',
            answer: 2,
            questionType: '普通试题',
            hard: 2,
            knowledge: '承包商的定义'
          },
          {
            title: '以下关于防水缝描述正确的是（   ）',
            type: '单项选择题',
            item: '第1选项####第2选项####第3选项####第4选项',
            answer: 3,
            questionType: 'VIP试题',
            hard: 4,
            knowledge: '防水缝的技术参数'
          }
        ],
        colDatas: [
          {
            title: '题咖教育-考试名-试题类型-简单题模板',
            downLoadName: LOAD_URL + ":10005/v1/itembank/questionimport/downLoadTemplate?type=1"
          },
          {
            title: '题咖教育-考试名-试题类型-复杂题模板',
            downLoadName: LOAD_URL + ":10005/v1/itembank/questionimport/downLoadTemplate?type=2"
          }
        ],

        logoData: [
          {
            endData: '合格数据',
            numData: 481,
            item: '对号'
          },
          {
            endData: '错误数据',
            numData: 13,
            item: '错号'
          },
          {
            endData: '未识别数据',
            numData: 13,
            item: '叹号'
          }
        ],
        loadData: [
          {
            endLoadData: '导入结果',
            numLoadData: '',
            itemLoadData: ''
          },
          {
            endLoadData: '导入成功',
            numLoadData: 481,
            itemLoadData: '对号'
          },
          {
            endLoadData: '导入失败',
            numLoadData: 19,
            itemLoadData: '错号'
          }
        ],

        qiNiuData:{},

        uploadQiNiu: true,
        uploadEnd: false,
        domain: ''
      }

    },
    mounted(){

    },
    methods:{

      lastStep(){
        alert('点击下载')
      },
      submitUpload() {
        // let loadingInstance = Loading.service(this.options);
        let that = this
        let nameString = $("#file_upload")[0].files[0].name
        var formData = new FormData()
        formData.append('file',$("#file_upload")[0].files[0])    //将文件转成二进制形式
        formData.append('agencyCode',sessionStorage.getItem("agencyCode"))
        formData.append('userId',sessionStorage.getItem("userId"))
        formData.append('fileName',nameString)

        let examName =  nameString.split('-')[1]
        let subjectName =  nameString.split('-')[2]
          // let url= "/v1/itembank/itembankSubject/selectSubject?examName="+ examName + "&subjectName=" + subjectName
        let url= "/v1/systemctl/treeSubject/selectSubject?examName="+ examName + "&subjectName=" + subjectName

        let getData = {
            url: encodeURI(url),
            value: TIKA_SYSTEM
          }
          ApiGet(getData, URL_GET).then((res)=>{
            if(res.status === 200){
              if(!res.result.subjectCode){
                alert('科目获取错误！！！')
                return
              }
              formData.append('subjectCode',res.result.subjectCode)
              $.ajax({
                type:"post",
                url:LOAD_URL + ":10005/v1/viptiku/vipquestionimport/questionVIPImport",
                async:false,
                contentType: false,     //这个一定要写
                processData: false,     //这个也一定要写，不然会报错
                data:formData,
                dataType:'json',        //返回类型，有json，text，HTML。这里并没有jsonp格式，所以别妄想能用jsonp做跨域了。
                success:function(data){
                  // loadingInstance.close();
                  if(data.status === 200 && data.result > 0){
                    alert('导入成功！！')
                    that.uploadQiNiu = false
                    that.uploadEnd= true
                  }else if(data.status === 200 && data.result === 0){
                    alert('导入数据为空！！')
                    return
                  }else{
                    return
                  }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown, data){
                  // loadingInstance.close();
                  alert('导入失败！！')
                  console.log('errorThrown====================')
                  console.log(errorThrown)
                }
              })

            }else if(res.status !== 200){
              alert(res.message)
              return
            }
          })

      },
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.uptoken = res.upToken
          this.domain = res.domain
          let colDatasTemp = []
          this.colDatas.forEach(res=>{
            let temp = {}
            temp.downLoadName = this.domain+ '/' + res.downLoadName
            temp.title = res.title
            colDatasTemp.push(temp)
          })
          this.colDatas=[]
          this.colDatas = colDatasTemp
          this.qiNiuData.token = res.upToken
        })
      }
    }
  }
</script>

<style>
  .content-right .tempExam{
    width: 70%
  }
  .content-right .questionTempExam{
    /*margin-top: 10px;*/
    /*margin-left: 10px;*/
    /*margin-bottom: 10px;*/
    width: 70%
  }

  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .content-right .questionLoad{
    margin-top: 10px;
    margin-left: 10px;
    width: 70%
  }
  .loadDes span{
    color: red;
    margin-left: 40px;
    margin-top: 20px;
  }
  .loadDes p{
    margin-left: 60px;
  }


</style>




