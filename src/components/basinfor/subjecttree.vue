<template>
  <div class="content-right">
    <div class="content-text">
      <div class="table-style">
        <div class="search">
          <div class="top-line">
            <el-input placeholder="一级节点"></el-input>
            <el-input placeholder="行业"></el-input>
            <el-input placeholder="节点名称"></el-input>
            <el-input placeholder="全部收齐"></el-input>
            <el-button type="primary" style="msrgin-left: 15px" icon="plus" @click="addSubject">新建根节点</el-button>
          </div>
        </div>

        <div class="el-tree-out">
          <div class="icon-style">
            <el-button type="primary" icon="plus" @click="addNode"></el-button>
            <el-button type="primary" icon="close" @click="deleteNode"></el-button>
            <el-button type="primary" icon="arrow-up" @click="upNodeNode"></el-button>
            <el-button type="primary" icon="arrow-down" @click="downNode"></el-button>
          </div>
          <div class="clear"></div>
          <keep-alive>
            <el-tree
              :data="subjectTreeData"
              :props="defaultProps"
              :highlight-current="highlight"
              accordion
              highlight-current
              @node-click="handleNodeClick"
              node-key="sequenceNbr"
              :expand-on-click-node="false"
              :default-expanded-keys='defaultExamTreeKeysMenu'></el-tree>
          </keep-alive>

        </div>
      </div>
      <div class="formRight" v-show="showSubjectNo" style="">
        <el-form :model="subjectTreeForm" ref="subjectTreeForm" label-width="100px" class="demo-dynamic">
          <el-form-item
            label="节点名称:"
            prop="nodeNamePut"
            v-if="postOrPut === 'put'"
            :rules="[
              {required: true, message: '节点名称不能为空2', trigger: 'blur' },
              {min:2, max:32, message:'汉字长度2~32个'}
            ]">
            <el-input v-model="subjectTreeForm.nodeNamePut"></el-input>
          </el-form-item>

          <el-form-item
            v-if="postOrPut === 'post'"
            prop="nodeName"
            label="节点名称:"
            :rules="[
              {required: true, message: '节点名称不能为空123' ,trigger: 'blur'},
              {min:2, max:32, message:'汉字长度2~32个'}
            ]">
            <el-input v-model="subjectTreeForm.nodeName"  placeholder="请填写节点名称"></el-input>
          </el-form-item>

          <el-form-item label="节点属性:" v-if="postOrPut === 'post'">
            <el-input v-model="subjectTreeForm.nodeType"  disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="节点属性:" v-if="postOrPut === 'put'">
            <el-input v-model="putExtend3"  disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item label="上级节点:"  v-if="addType !== 'subject' && postOrPut === 'post'">
            <el-input v-model="subjectTreeForm.upNode"  disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="上级节点:"  v-if="putExtend3 !== '科目' && postOrPut === 'put'">
            <el-input v-model="upNode"  disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item prop="lockStatus" label="生效状态:" v-if="addType === 'subject' && postOrPut === 'post'">
            <el-select v-model="subjectTreeForm.lockStatus" placeholder="请选择生效状态">
              <el-option
                v-for="item in REC_STATUSS"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生效状态:" v-if="putExtend3 === '科目' && postOrPut === 'put'">
            <el-select v-model="lockStatus" placeholder="请选择生效状态">
              <el-option
                v-for="item in REC_STATUSS"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="subjectVersion"
            label="版本信息:"
            :rules="[
              { required: true, message: '版本信息不能为空',trigger: 'blur' }
            ]"
            v-if="addType === 'subject' && postOrPut === 'post'">
            <el-select v-model="subjectTreeForm.subjectVersion" placeholder="请选择版本信息">
              <el-option
                v-for="item in versionInformations"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="版本信息:"
            v-if="putExtend3 === '科目' && postOrPut === 'put'">
            <el-select v-model="subjectVersion" placeholder="请选择版本信息">
              <el-option
                v-for="item in versionInformations"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            prop="industryCode"
            label="所属考试:"
            v-if="addType === 'subject' && postOrPut === 'post'"
            :rules="[
              { required: true, message: '所属考试不能为空' }
            ]">
            <el-select
              v-model="subjectTreeForm.industryCode"
              filterable
              remote
              placeholder="请输入关键词"
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



          <el-form-item
            label="所属考试:"
            v-if="putExtend3 === '科目' && postOrPut === 'put'"
          >
          <el-input v-model="industryCode"  disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item prop="description" label="备注:" v-if="postOrPut === 'post'">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="subjectTreeForm.description">
            </el-input>
          </el-form-item>

          <el-form-item label="备注2:" v-if="postOrPut === 'put'">

            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="description">
            </el-input>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit('subjectTreeForm')">保存</el-button>
            <el-button @click="resetForm('subjectTreeForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_APP, TIKA_WEB, TIKA_SYSTEM } from 'api/config'
  import { getQiNiuToken, upQiNiuFile, getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      return {
        subjectTreeData: [],
        defaultProps: {
          children: 'child',
          label: 'chaptersTitle'
        },
        subjectTreeForm: {
          nodeName: '',
          nodeType:'',
          subjectVersion: '',
          lockStatus: 'UNLOCK',
          upNode: '',
          industryCode: '',
          description: '',
          nodeNamePut: ''
        },

        REC_STATUSS: [{
          value: 'UNLOCK',
          label: '生效'
        }, {
          value: 'LOCK',
          label: '禁用'
        }],
        versionInformations: [],
        industryNameArray: [],
        startTime: 0,
        showSubjectNo: false,
        addType: '',
        upFlag: 0,
        subjectType: '',
        highlight: true,
        levelMap: [],


        defaultExamTreeKeysMenu: [],
        purExtend3: '',
        postOrPut: 'post',
        nodeLevel: 0,

        nodeName: '',
        putExtend3: '',
        industryCode: '',
        subjectVersion: '',
        upNode: '',
        description: '',
        lockStatus: '',


        options4:[],
        list: [],
        loading: false,
        statesData: [],


      }
    },
    mounted() {
      this._getSubjectTreeData()
      this._getQiNiuToken()
      this._getIndustryData()//获取行业大类信息
      this._getVersionData()//获取版本信息
      this._getAllSubjectName()// 获取所有考试
    },
    components: {

    },
    methods: {

      _getAllSubjectName(){
        let getData = {
          // url: '/v1/itembank/itembankExamInfo/itembank/itembankExamInfoLists',
          url: '/v1/systemctl/treeExamInfo/tree/treeExamInfoLists',
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200) {
            this.list = res.result.map(item => {
              return { value: item.examCode+','+item.examName, label: item.examName };
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
      _getIndustryData(){
        let getData = {
          // url: "/v1/itembank/itembankIndustryInfo/itembank/rootItembankIndustryInfos",
          url: "/v1/systemctl/treeIndustryInfo/tree/rootTreeIndustryInfos",

          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            this.industryNameArray= []
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.industryCode
              temp.label = item.industryName
              this.industryNameArray.push(temp)
            })
          } else {
            alert(res.message)
            return
          }
        })
      },
      _getVersionData(){
        getDictionaryData('SUBJECT_VERSION').then(res=>{
          if(res){
            this.versionInformations= []
            res.forEach(item=>{
              let temp = {}
              temp.value = item.dictDataValue
              temp.label = item.dictDataValue
              this.versionInformations.push(temp)
            })
          }else{
            console.log('获取版本信息失败')
            return
          }
        })
      },
      _getSubjectTreeData(){
        let getData = {
          // url: "/v1/itembank/itembankSubject/itembank/rootItembankSubejctInfos/tree",
          url: "/v1/systemctl/treeSubject/tree/rootTreeSubejctInfos/tree",

          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.subjectTreeData=res.result
          }else{
            console.log('科目树获取数据出现错误：'+res.message)
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
      addSubject(){ //点击添加科目
        this.postOrPut='post'
        this.addType = 'subject'
        this.subjectTreeForm.nodeType = '科目'
        this.subjectTreeForm.industryCode= ''
        this.showSubjectNo =true
      },
      deleteNode(){//刷新树  记录节点111
        if(!this.sequrenceNbr){
          alert('请选择要删除的节点！！')
          return
        }
        this.showSubjectNo = false
        this.postOrPut='post'
        let url = ''
        let format={}
        if(this.extend3 === 'subject'){
          // url = '/v1/itembank/itembankSubject/hide/' + this.sequrenceNbr
          url = '/v1/systemctl/treeSubject/hide/' + this.sequrenceNbr

        }else if(this.extend3 === 'chapter'){
          // url = '/v1/itembank/itembankChaptersInfo/hide/' + this.sequrenceNbr
          url = '/v1/systemctl/treeChaptersInfo/hide/' + this.sequrenceNbr

        }else if(this.extend3 === 'section'){
          // url = '/v1/itembank/ItembankSectionsInfo/hide/' + this.sequrenceNbr
          url = '/v1/systemctl/treeSectionsInfo/hide/' + this.sequrenceNbr

        }
//        else{
//          url = '/v1/itembank/itembankKnowledgeInfo/hide/' + this.sequrenceNbr
//        }
        format.recStatus = 'INACTIVE'
        format.recUserId = sessionStorage.getItem("userId")
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_SYSTEM
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200 && res.result.recStatus === 'INACTIVE'){
            let num = this.levelMap.length
            if(num === 1 ){
              this.subjectTreeData.splice(this.levelMap[0],1);
            }
            if(num === 2){
              this.subjectTreeData[this.levelMap[0]].child.splice(this.levelMap[1],1);
            }
            if(num === 3){
              this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child.splice(this.levelMap[2],1);
            }
//            if(num === 4){
//              this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child.splice(this.levelMap[3],1);
//            }
            this.sequrenceNbr = ''
          }else{
            alert(res.message)
            return
          }
        })
      },
      addNode(){
        this.postOrPut='post'
        if(!this.subjectNextType || this.sequenceNbr === ''){
          alert('请单击选择节点')
          return
        }
        this.subjectTreeForm.nodeName = ''

        if(this.subjectTreeForm.nodeType === '科目'){
          this.subjectTreeForm.nodeType = '章'
        }
        if(this.subjectTreeForm.nodeType === '科目' && this.subjectTreeForm.nodeType === '章'){
          this.subjectTreeForm.nodeType = '节'
        }
        if(this.extend3 === 'section'){
          alert('无下级结点添加！！')
          return
        }
        this.addType = ''
        this.showSubjectNo = true
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.onSubmitApi()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      onSubmitApi(){ //表单提交增加、更改
        if(this.postOrPut === 'post'){
          let format = {}
          format.recUserId = format.lockUserId = format.createUserId = sessionStorage.getItem("userId")
          format.agencyCode = sessionStorage.getItem("agencyCode")
          if(this.addType === 'subject'){
            let examArray = []
            examArray = this.subjectTreeForm.industryCode.split(',')
            format.subjectCode = format.subjectName = this.subjectTreeForm.nodeName
            format.subjectVersion = this.subjectTreeForm.subjectVersion
            format.lockStatus = this.subjectTreeForm.lockStatus
            format.extend1 = examArray[0]
            format.extend2 = examArray[1]
            format.description = this.subjectTreeForm.description
            // let url = '/v1/itembank/itembankSubject'
            let url = '/v1/systemctl/treeSubject'

            let postData = {
              url: url,
              data: {
                format: format,
                value: TIKA_SYSTEM
              }
            }
            ApiPost(postData, URL_POST).then((res) => {
              if(res.status === 200){
                delete res.result.child
                res.result.child = []
                res.result.chaptersTitle = res.result.subjectName+'('+ res.result.subjectVersion + ')'
                this.subjectTreeData.push(res.result)
                this.resetForm('subjectTreeForm')
              }else if(res.status !== 401){
                alert('添加科目出现错误：'+res.message)
                return
              }
            })
          }else if(this.subjectNextType === 'subject'){  //创建章
            format.chaptersTitle = this.subjectTreeForm.nodeName //章名称
            format.extend3 = 'chapter'
            format.description = this.subjectTreeForm.description//注释
            format.subjectCode = this.subjectTreeForm.subjectCode//所属科目code

            delete format.lockUserId  //删除lockUserId
            // let url = "/v1/itembank/itembankChaptersInfo"
            let url = "/v1/systemctl/treeChaptersInfo"
            let postData = {
              url: url,
              data: {
                format: format,
                value: TIKA_SYSTEM
              }
            }
            ApiPost(postData, URL_POST).then((res) => {
              if(res.status === 200){
                delete res.result.child
                res.result.child = []
                this.subjectTreeData[this.levelMap[0]].child.push(res.result)
                this.defaultExamTreeKeysMenu[0] = res.result.sequenceNbr
                this.resetForm('subjectTreeForm')
              }else if(res.status !== 401){
                alert("添加章出现错误："+res.message)
                return
              }
            })
          }else if( this.subjectNextType === 'chapter'){//创建节
            format.chaptersCode= this.subjectTreeForm.parentId
            format.sectionsTitle = this.subjectTreeForm.nodeName
            format.description=this.subjectTreeForm.description
            format.extend3="section"
            delete format.lockUserId
            // let url = "/v1/itembank/ItembankSectionsInfo"
            let url = "/v1/systemctl/treeSectionsInfo"

            let postData = {
              url: url,
              data: {
                format: format,
                value: TIKA_SYSTEM
              }
            }
            ApiPost(postData, URL_POST).then((res) => {
              if(res.status === 200){
                res.result.chaptersTitle = res.result.sectionsTitle
                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child.push(res.result)
                this.defaultExamTreeKeysMenu[0] = res.result.sequenceNbr
                this.resetForm('subjectTreeForm')
              }else if(res.status !== 401){
                alert("添加节出现错误："+res.message)
                return
              }
            })

          }
        }else if(this.postOrPut === 'put'){
          let format={}
          format.recUserId = sessionStorage.getItem("userId")
          let url = ''

          if(this.extend3 === 'subject'){
            // url = '/v1/itembank/itembankSubject/' + this.sequrenceNbr
            url = '/v1/systemctl/treeSubject/' + this.sequrenceNbr

            format.lockStatus = this.lockStatus
            format.subjectVersion = this.subjectVersion
            format.subjectName = this.subjectTreeForm.nodeNamePut

          }else if(this.extend3 === 'chapter'){
            // url = '/v1/itembank/itembankChaptersInfo/' + this.sequrenceNbr
            url = '/v1/systemctl/treeChaptersInfo/' + this.sequrenceNbr

            format.chaptersTitle = this.subjectTreeForm.nodeNamePut
          }else if(this.extend3 === 'section'){
            // url = '/v1/itembank/ItembankSectionsInfo/' + this.sequrenceNbr
            url = '/v1/systemctl/treeSectionsInfo/' + this.sequrenceNbr

            format.sectionsTitle = this.subjectTreeForm.nodeNamePut
          }
          format.description = this.description
          let postData = {
            url: url,
            data: {
              format: format,
              value: TIKA_SYSTEM
            }
          }

          ApiPost(postData, URL_PUT).then((res) => {
            if(res.status === 200){
              let num = this.levelMap.length
              if(num === 1){
                this.subjectTreeData[this.levelMap[0]].chaptersTitle = res.result.subjectName +'('+res.result.subjectVersion+')'
                this.subjectTreeData[this.levelMap[0]].subjectVersion = res.result.subjectVersion
                this.subjectTreeData[this.levelMap[0]].industryCode = res.result.industryCode
                this.subjectTreeData[this.levelMap[0]].description= res.result.description
                this.subjectTreeData[this.levelMap[0]].lockStatus= res.result.lockStatus
              }
              if(num === 2){
                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].chaptersTitle = res.result.chaptersTitle
                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].description = res.result.description
              }
              if(num === 3){
                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].chaptersTitle = res.result.sectionsTitle
                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].description = res.result.description
              }
//              if(num === 4){
//                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].chaptersTitle = res.result.knowledgeTitle
//                this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].description = res.result.description
//
//              }
              this.showSubjectNo = false
            }else{
              alert('更新节点出错：'+res.message)
              return
            }
          })
        }
      },
      handleNodeClick(clickData,node,nodeGroup) {
        this.extend3 = clickData.extend3
        this.nodeLevel = node.level
        let sequrenceNbr = clickData.sequenceNbr
        this.sequrenceNbr = clickData.sequenceNbr

        this.addType = ''
        if(clickData.extend3 === 'subject'){
          this.subjectTreeForm.upNode = clickData.subjectName + '/科目'
          this.subjectTreeForm.subjectCode = clickData.subjectCode
//          this.subjectTreeForm.industryCode = clickData.industryCode
          this.subjectTreeForm.parentId = 'ROOT'
          this.subjectTreeForm.nodeType = '章'
          console.log('this.subjectTreeForm  subject===================')
          console.log(this.subjectTreeForm)
        }else if(clickData.extend3 === 'chapter'){
          this.subjectTreeForm.upNode = clickData.chaptersTitle + '/章'
          this.subjectTreeForm.subjectCode = clickData.subjectCode
          this.subjectTreeForm.parentId = clickData.chaptersCode
          this.subjectTreeForm.nodeType = '节'
        }

        // else if(clickData.extend3 === 'section'){
        //   this.subjectTreeForm.upNode = clickData.chaptersTitle + '/节'
        //   this.subjectTreeForm.parentId = clickData.chaptersCode
        //   this.subjectTreeForm.nodeType = '知识点'
        // }

//获取节点级别数组
        this.levelMap=[]
        if(node.level === 1){
          this.subjectTreeData.forEach((tempData,index)=>{
            if(sequrenceNbr === tempData.sequenceNbr){
              this.levelMap.push(index)
            }
          })
        }
        if(node.level === 2){
          this.subjectTreeData.forEach((tempData,index)=>{
            if(node.parent.data.sequenceNbr === tempData.sequenceNbr){
              this.levelMap.push(index)
            }
          })
          let orderNum = this.levelMap[0]
          let getFirstExamTreeData = this.subjectTreeData[orderNum].child
          getFirstExamTreeData.forEach((tempData,index)=>{
            if(tempData.sequenceNbr === sequrenceNbr ){
              this.levelMap.push(index)
            }
          })
        }
        if(node.level === 3){
          this.subjectTreeData.forEach((tempData,index)=>{
            if(node.parent.parent.data.sequenceNbr === tempData.sequenceNbr){
              this.levelMap.push(index)
            }
          })
          let firstOrderNum = this.levelMap[0]
          let getSecondExamTreeData = this.subjectTreeData[firstOrderNum].child
          getSecondExamTreeData.forEach((tempData,index)=>{
            if(tempData.sequenceNbr === node.parent.data.sequenceNbr ){
              this.levelMap.push(index)
            }
          })
          let secondOrderNum = this.levelMap[1]
          let getThirdExamTreeData = this.subjectTreeData[firstOrderNum].child[secondOrderNum].child
          getThirdExamTreeData.forEach((tempData,index)=>{
            if(tempData.sequenceNbr === sequrenceNbr ){
              this.levelMap.push(index)
            }
          })
        }
        if(node.level === 4){
          this.subjectTreeData.forEach((tempData,index)=>{
            if(node.parent.parent.parent.data.sequenceNbr === tempData.sequenceNbr){
              this.levelMap.push(index)
            }
          })
          let firstOrderNum = this.levelMap[0]
          let getSecondExamTreeData = this.subjectTreeData[firstOrderNum].child
          getSecondExamTreeData.forEach((tempData,index)=>{
            if(tempData.sequenceNbr === node.parent.parent.data.sequenceNbr ){
              this.levelMap.push(index)
            }
          })
          let secondOrderNum = this.levelMap[1]
          let getThirdExamTreeData = this.subjectTreeData[firstOrderNum].child[secondOrderNum].child
          getThirdExamTreeData.forEach((tempData,index)=>{
            if(tempData.sequenceNbr === node.parent.data.sequenceNbr ){
              this.levelMap.push(index)
            }
          })
          let thirdOrderNum = this.levelMap[2]
          let getForthExamTreeData = this.subjectTreeData[firstOrderNum].child[secondOrderNum].child[thirdOrderNum].child
          getForthExamTreeData.forEach((tempData,index)=>{
            if(tempData.sequenceNbr === sequrenceNbr ){
              this.levelMap.push(index)
            }
          })
        }

//双击单击判断
        this.subjectNextType = clickData.extend3
        let timeData = new Date().getTime()
        let sunTime = timeData - this.startTime
        let temp = false
        if(sequrenceNbr === this.sequrenceNbr){
          temp = true
        }
        this.startTime = timeData
        this.showSubjectNo = false
        if(sunTime<800 && temp){ //间隔 内容判断是否是单双击
          console.log('双击编辑')
          this.postOrPut='put'
          if(node.level === 1){
            this.subjectTreeForm.nodeNamePut = clickData.subjectName
            this.putExtend3 = '科目'
            this.subjectVersion = clickData.subjectVersion
            this.lockStatus = clickData.lockStatus
            this.industryCode = clickData.extend2
            this.description = clickData.description
          }
          if(node.level === 2){
            this.subjectTreeForm.nodeNamePut = clickData.chaptersTitle
            this.putExtend3 = '章'
            this.upNode = this.subjectTreeData[this.levelMap[0]].subjectName+'/科目'
            this.description = clickData.description
          }
          if(node.level === 3){
            this.subjectTreeForm.nodeNamePut = clickData.chaptersTitle
            this.putExtend3 = '节'
            this.upNode = this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].chaptersTitle+'/章'
            this.description = clickData.description
          }


          // if(node.level === 4){
          //   this.subjectTreeForm.nodeNamePut = clickData.chaptersTitle
          //   this.putExtend3 = '知识点/一级'
          //   this.upNode = this.subjectTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].chaptersTitle+'/节'
          //   this.description = clickData.description
          // }
          this.showSubjectNo = true
        }else{
          this.start = 0
          console.log('dan击开始添加')
        }
      },
      resetForm(formName){ //表单清空
        this.showSubjectNo = false  //隐藏表单
        console.log(formName)
        this.postOrPut='post'
        this.$refs[formName].resetFields()
        // this.showSubjectNo = false  //隐藏表单
      },
      upNodeNode(){
        console.log('upNode')

      },
      downNode(){
        console.log('downNode')
      }
    }
  }
</script>

<style>

  .formRight .form-style{
    margin-top: 50px;
    margin-left: 5px;
  }


  .formRight .el-upload-dragger {
    height: 100%;
    width: 100%
  }
  .formRight .el-select {
    width: 100%
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color:#afe1f9;
  }


</style>

