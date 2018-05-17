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
              <el-button type="primary" style="msrgin-left: 15px" icon="plus" @click="addIndustry">新建根节点</el-button>
            </div>
          </div>
          <div class="el-tree-out">
            <div class="icon-style">
              <el-button type="primary" icon="plus" @click="addNode"></el-button>
              <el-button type="primary" icon="close" @click="deleteNode"></el-button>
              <el-button type="primary" icon="arrow-up" @click="upNode"></el-button>
              <el-button type="primary" icon="arrow-down" @click="downNode"></el-button>
            </div>
            <div class="clear"></div>
            <keep-alive>
              <el-tree
                :data="examTreeData"
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
        <div class="formRight" v-show = "showExamNo">
          <el-form :model="examTreeForm" ref="examTreeForm" label-width="100px" class="demo-dynamic" v-if="postOrPut==='post'">
            <el-form-item
              prop="industryName"
              label="节点名称:"
              v-if="industryAdd === 'industryAdd'"
              :rules="[
            {required: true, message: '节点名称不能为空', trigger: 'blur'},
          ]">
              <!--新增行业大类名称显示-->
              <el-select v-model="examTreeForm.industryName" placeholder="请选择大类名称">
                <el-option
                  v-for="item in industryNameArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              prop="industryName"
              label="节点名称:"
              v-if="subjectType === 'exam' && nodeAdd==='nodeAdd'"
              placeholder="请输入关键词"
              :rules="[
            {required: true, message: '节点名称不能为空',trigger: 'blur'}
          ]">
              <el-select
                v-model="examTreeForm.industryName"
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

            <!--新增知识点节点属性-->
            <el-form-item
              prop="extend3"
              label="节点属性:"
              v-if="subjectType === 'exam' && nodeAdd==='nodeAdd'">
              <el-input v-model="examTreeForm.extend3"  disabled="disabled"></el-input>
            </el-form-item>

            <!--新增行业大类节点属性-->
            <el-form-item
              prop="extend3"
              label="节点属性:"
              v-if="industryAdd === 'industryAdd'">
              <el-input v-model="examTreeForm.extend3"  disabled="disabled"></el-input>
            </el-form-item>

            <!--新增行业大类下考试或组别属性-->
            <el-form-item
              prop="extend3"
              label="节点属性:"
              v-if="subjectType === 'industry' && nodeAdd === 'nodeAdd'"
              :rules="[
            { required: true, message: '节点属性不能为空', trigger: 'blur'}
          ]">
              <el-select v-model="examTreeForm.extend3" placeholder="请选择节点属性"  :disabled="postOrPut === 'put'">
                <el-option
                  v-for="item in groupOrExam"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

            </el-form-item>


            <!--新增行业大类下的考试组别名称-->

            <el-form-item
              prop="industryName"
              v-if="(subjectType === 'industry' || subjectType === 'group') && nodeAdd==='nodeAdd'"
              label="节点名称:"
              :rules="[
            {required: true, message: '节点名称不能为空',trigger: 'blur'},
          ]">
              <el-input v-model="examTreeForm.industryName"  placeholder="请填写节点名称" ></el-input>
            </el-form-item>

            <!--新增组别下的考试的属性-->
            <el-form-item
              prop="extend3"
              label="节点属性:"
              v-if="subjectType === 'group'  && nodeAdd === 'nodeAdd'"
            >
              <el-input v-model="examTreeForm.extend3"  disabled="disabled"></el-input>
            </el-form-item>


            <!--新增行业大类节点图标-->
            <el-form-item
              label="节点图标:"
              prop="iconUrl"
              v-if="industryAdd === 'industryAdd'"
              :rules="[
            { required: true, message: '节点图标不能为空'}
          ]">
              <el-upload
                class="upload-demo"
                drag
                :data="qiNiuData"
                :show-file-list="false"
                :on-success="successRes"
                :before-upload="beforeAvatarUpload"
                action="http://upload.qiniu.com"
                multiple
                v-model="iconUrl">
                <img v-if="iconUrl" :src="iconUrl" style="width:135px; height:135px" class="avatar">
                <i v-else class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">格式JPG、PNG;大小＜50KB</div>
              </el-upload>
            </el-form-item>

            <!--行业大类的生效状态-->

            <el-form-item
              prop="lockStatus"
              label="生效状态:"
              v-if="industryAdd === 'industryAdd'">
              <el-select v-model="examTreeForm.lockStatus" placeholder="请选择生效状态">
                <el-option
                  v-for="item in LOCK_STATUES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              prop="lockStatus"
              label="是否显示:"
              v-if="(subjectType === 'industry' || subjectType === 'group') && nodeAdd==='nodeAdd'">
              <el-select v-model="examTreeForm.lockStatus" placeholder="请选择生效状态">
                <el-option
                  v-for="item in LOCK_STATUES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-checkbox v-model="checked" v-if="subjectType === 'industry' && examTreeForm.lockStatus === 'LOCK'" >子级显示</el-checkbox>
            </el-form-item>
            <el-form-item
              label="科目属性:"
              prop="property"
              v-if="subjectType === 'exam'" >
              <el-select v-model="examTreeForm.property" placeholder="请选择科目属性">
                <el-option
                  v-for="item in subjectTypeName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item prop="upNode" label="上级节点:"  v-if="nodeAdd === 'nodeAdd'">
              <el-input v-model="examTreeForm.upNode"  disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item
              v-if="extend3 === 'exam' && nodeAdd === 'nodeAdd'"
              prop="isdefault"
              label="默认展示:">
              <el-select v-model="examTreeForm.isdefault" placeholder="请选择默认展示">
                <el-option
                  v-for="item in zhanShiName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="description" label="备注:">
              <el-input v-model="examTreeForm.description"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit('examTreeForm')">保存</el-button>
              <el-button @click="resetForm('examTreeForm')">取消</el-button>
            </el-form-item>
          </el-form>

          <el-form :model="examTreeFormPut" ref="examTreeFormPut" label-width="100px" class="demo-dynamic" v-if="postOrPut==='put'">

            <!--行业大类,组别，考试，名称编辑-->

            <el-form-item
              prop="industryName"
              v-if="subjectType === 'industry' || subjectType === 'group'|| subjectType === 'exam'"
              label="节点名称:"
              :rules="[
            {required: true, message: '节点名称不能为空'},
          ]">
              <el-input v-model="examTreeFormPut.industryName"  placeholder="请填写节点名称3" :disabled="subjectType === 'industry'" ></el-input>
            </el-form-item>


            <el-form-item
              prop="industryName"
              label="节点名称:"
              v-if="subjectType === 'subject'"
              placeholder="请输入关键词"
              :rules="[
            {required: true, message: '节点名称不能为空',trigger: 'blur'}]">
              <el-select
                v-model="examTreeFormPut.industryName"
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
              prop="extend3"
              label="节点属性:" >
              <el-input v-model="examTreeFormPut.extend3"  disabled="disabled" ></el-input>
            </el-form-item>

            <!--编辑行业大类节点图标-->

            <el-form-item
              label="节点图标:"
              prop="iconUrl"
              v-if="subjectType === 'industry'"
              :rules="[
            { required: true, message: '节点图标不能为空'}
          ]">
              <el-upload
                class="upload-demo"
                drag
                :data="qiNiuData"
                :show-file-list="false"
                :on-success="successRes"
                :before-upload="beforeAvatarUpload"
                action="http://upload.qiniu.com"
                multiple
                v-model="iconUrl1">
                <img v-if="iconUrl1" :src="iconUrl1" style="width:135px; height:135px" class="avatar">
                <i v-else class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">格式JPG、PNG;大小＜50KB</div>
              </el-upload>
            </el-form-item>


            <el-form-item
              prop="lockStatus"
              label="生效状态:"
              v-if="subjectType === 'industry' || subjectType === 'group' || subjectType === 'exam'" >
              <el-select v-model="examTreeFormPut.lockStatus" @change="groupStatus" placeholder="请选择生效状态">
                <el-option
                  v-for="item in LOCK_STATUES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="subjectType === 'group' && examTreeFormPut.lockStatus === 'LOCK'"
              prop="checked">
              <el-checkbox v-model="examTreeFormPut.checked"  :checked=examTreeFormPut.checked>子级显示</el-checkbox>
            </el-form-item>

            <el-form-item
              label="科目属性:"
              prop="property"
              v-if="subjectType === 'subject'" >
              <el-select v-model="examTreeFormPut.property" placeholder="请选择科目属性">
                <el-option
                  v-for="item in subjectTypeName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="上级节点:" v-if="subjectType !== 'industry'">
              <el-input v-model="putUpNode"  disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item
              v-if="subjectType === 'subject'"
              prop="isdefault"
              label="默认展示:">
              <el-select v-model="examTreeFormPut.isdefault" placeholder="请选择默认展示">
                <el-option
                  v-for="item in zhanShiName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="description" label="备注:">
              <el-input v-model="examTreeFormPut.description"></el-input>
            </el-form-item>


            <el-form-item>
              <el-button type="primary" @click="onSubmit('examTreeFormPut')">保存</el-button>
              <el-button @click="resetForm('examTreeFormPut')">取消</el-button>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>
</template>


<script>
  import axios from 'axios'

  import { ApiGet, ApiDel, ApiPost } from 'api/recommand'
  import { URL_GET, URL_DEL, URL_POST, URL_PUT, TIKA_SYSTEM } from 'api/config'
  import { getQiNiuToken, upQiNiuFile, levelMap, getDictionaryData } from 'api/comFunction'
  export default {
    data() {
      return {
        examTreeData: [],
        defaultProps: {
          children: 'child',
          label: 'industryName'
        },

        examTreeForm: {
          industryName: '',
          industryCode: '',
          iconUrl: '',
          description: '',
          lockStatus: '',
          extend3: '',
          property: '',
          upNode: '',
          isdefault: 0
        },
        examTreeFormPut: {
          industryName: '',
          extend3: '',
          iconUrl: '',
          isdefault: 0,
          description: '',
          lockStatus: '',
          property: '',
          checked: false
        },
        LOCK_STATUES: [{
          value: 'UNLOCK',
          label: '生效'
        }, {
          value: 'LOCK',
          label: '禁用'
        }],
        zhanShiName:[
          {
            value: 1,
            label: '是'
          }, {
            value: 0,
            label: '否'
          }
        ],
        industryNameArray: [],
        groupOrExam: [{
          value: 'group',
          label: '组别'
        },{
          value: 'exam',
          label: '考试'
        }],
        subjectTypeName: [{
          value: '公共',
          label: '公共'
        },{
          value: '专业',
          label: '专业'
        }],
        extend3: '',
        startTime: 0,
        showExamNo: false,
        industryAdd: '', //是否为行业大类
        nodeAdd:'',//是否添加大类下的子节点
        subjectType: '',//小加号的类型
        upFlag: 0,
        highlight: true,
        levelMap: [],
        options4:[],
        list: [],
        loading: false,
        statesData: [],
        defaultExamTreeKeysMenu: [],
        checked: false,
        qiNiuData: {},
        iconUrl: '',
        iconUrl1: '',


        postOrPut: 'post',
        putExtend3: '',
        putUpNode: '',
        putDescription: '',
        putProperty: '',
        putIndustryName: '',
        putIsdefault: '',
      }
    },
    mounted() {
      this._getExamTreeData()
      this._getQiNiuToken()
      this._getIndustryTypeData()
    },
    components: {

    },
    methods: {
      _getExamTreeData(){
        let getData = {
          // url: "/v1/itembank/itembankIndustryInfo/itembank/rootItembankIndustryInfos/tree",
          url: "/v1/systemctl/treeIndustryInfo/tree/rootTreeIndustryInfos/tree",
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.examTreeData=res.result
          }else if(res.status !== 401){
            console.log('考试树获取数据出现错误：'+res.message)
            return
          }
        })
      },
      _getIndustryTypeData(){
        getDictionaryData('INDUSTRY_TYPE').then(res=>{
          if(res){
            this.industryNameArray=[]
            res.forEach(item=>{
              let temp = {}
              temp.value = item.dictDataValue
              temp.label = item.dictDataValue
              this.industryNameArray.push(temp)
            })
          }else{
            console.log('获取行业大类字典信息出错！！')
            return
          }
        })
      },
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.qiNiuData.token = res.upToken
          this.domain = res.domain
        })
      },
      addIndustry(){

        //this.levelMap = []
        this.postOrPut='post'
        this.industryAdd = 'industryAdd'
        this.nodeAdd = ''
        this.examTreeForm.iconUrl=''
        this.iconUrl=''
        this.extend3 = 'industry'
        this.examTreeForm.extend3 = '行业'
        this.examTreeForm.lockStatus = 'LOCK'
        //this._getIndustryType('INDUSTRY_TYPE')
        this.showExamNo =true
      },
      deleteNode(){//刷新树  记录节点111
        this.showSubjectNo = false
        this.postOrPut='post'
        let url = ''
        let format={}

        if(this.extend3 === 'subject'){
          // url = "/v1/itembank/itembankExamSuject/delete/examAndSubject?subjectCode=" + this.subjectCode + "&examCode=" + this.parentId //待确认
          url = "/v1/systemctl/treeExamSuject/delete/examAndSubject?subjectCode=" + this.subjectCode + "&examCode=" + this.parentId //待确认

          let getData = {
            url: url,
            value: TIKA_SYSTEM
          }
          ApiGet(getData, URL_GET).then((res)=>{
            if(res.status === 200){
              let num = this.levelMap.length
              if(num === 3){
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child.splice(this.levelMap[2],1);
              }
              if(num === 4){
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child.splice(this.levelMap[3],1);
              }
            }else if(res.status !== 401){
              console.log('删除科目、考试关系出现错误：'+res.message)
              return
            }
          })
        }else{
          if(this.extend3 === 'industry' || this.extend3 === 'group' ){
            // url = '/v1/itembank/itembankIndustryInfo/hide/' + this.sequenceNbr
            url = '/v1/systemctl/treeIndustryInfo/hide/' + this.sequenceNbr
          }else if(this.extend3 === 'exam'){
            // url = '/v1/itembank/itembankExamInfo/hide/' + this.sequenceNbr
            url = '/v1/systemctl/treeExamInfo/hide/' + this.sequenceNbr
          }
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
                this.examTreeData.splice(this.levelMap[0],1);
              }
              if(num === 2){
                this.examTreeData[this.levelMap[0]].child.splice(this.levelMap[1],1);
              }
              if(num === 3){
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child.splice(this.levelMap[2],1);
              }
              this.sequenceNbr = ''
            }else if(res.status !== 401){
              alert(res.message)
              return
            }
          })
        }
      },
      addNode(){
        this.postOrPut='post'
        this.industryAdd=''
        this.nodeAdd = 'nodeAdd'
        if(this.extend3 === 'subject'){
          alert('科目无法下挂节点！！')
          this.showExamNo = false
          return
        }
        if(this.subjectType === "" || this.subjectType ==="subject" || this.sequenceNbr === ''){
          alert('请选择可添加的节点！！')
          this.showExamNo = false
          return
        }
        if(!this.subjectType){
          this.showExamNo = false
          alert('请选择节点')
          return
        }
        this.examTreeForm.property = ''
        this.examTreeForm.industryName=''
        this.putIndustryName = ''
        this.examTreeForm.lockStatus = 'UNLOCK'
        this.addType = 'industryNode'
        let tempData = ''
        let subjectType=''
        if(this.subjectType === "industry"){
          tempData='group'
          subjectType = '行业'
        }
        if(this.subjectType === "group"){
          tempData = "考试"
          subjectType = '组别'
        }
        if(this.subjectType === "exam"){
          tempData = "科目"
          subjectType = '考试'
        }
        this.examTreeForm.upNode= this.industryName + '/' + subjectType
        this.examTreeForm.extend3 = tempData
        this.showExamNo = true

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
      onSubmitApi(){
        if(this.postOrPut === 'post'){
          let format = this.examTreeForm
          format.industryCode = format.industryName
          format.parentId = this.industryCode
          format.createUserId = format.lockUserId =  format.recUserId = sessionStorage.getItem("userId")
          format.agencyCode = sessionStorage.getItem("agencyCode")
          delete format.upNode

          if(this.examTreeForm.extend3==='考试' || this.examTreeForm.extend3==='exam'){
            format.extend3 = 'exam'
            format.examName = format.examCode = format.industryName
            delete format.industryName
            delete format.industryCode
            delete format.iconUrl
            delete format.parentId
            delete format.isdefault
            format.industryCode = this.industryCode
            // let url = '/v1/itembank/itembankExamInfo'
            let url = '/v1/systemctl/treeExamInfo'

            let postData = {
              url: url,
              data: {
                format: format,
                value: TIKA_SYSTEM
              }
            }
            delete format.property
            ApiPost(postData, URL_POST).then((res) => {
              if(res.status === 200){
                delete res.result.child
                res.result.child = []
                res.result.industryName = res.result.examName
                this.defaultExamTreeKeysMenu[0] = res.result.sequenceNbr
                if(this.levelMap.length === 1){
                  this.examTreeData[this.levelMap[0]].child.push(res.result)
                }else{
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child.push(res.result)
                }
                this.resetForm('examTreeForm')
              }else if(res.status !== 401){
                this.resetForm('examTreeForm')
                alert('添加考试出错：'+res.message)
                return
              }
            })

          }else if(this.examTreeForm.extend3 === 'industry' || this.examTreeForm.extend3=== '行业' || this.examTreeForm.extend3==='group' || this.examTreeForm.extend3==='组别'){//创建行业大类和组别
            format.extend1 = this.checked
            if(this.examTreeForm.extend3==='industry' || this.examTreeForm.extend3=== '行业'){
              format.extend3 = 'industry'
              format.parentId = "ROOT"
            }
            if(this.examTreeForm.extend3==='group' || this.examTreeForm.extend3==='组别'){
              format.extend3 = 'group'
              format.parentId = this.industryCode
              format.extend1 = this.checked
              format.industryName = format.industryName
            }
            delete format.examCode
            delete format.examName
            delete format.property
            delete format.isdefault
            // let url = '/v1/itembank/itembankIndustryInfo'
            let url = '/v1/systemctl/treeIndustryInfo'
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
                this.defaultExamTreeKeysMenu[0] = res.result.sequenceNbr
                if(this.industryAdd === 'industryAdd'){  //行业大类动态添加
                  this.examTreeData.push(res.result)
                }else{
                  this.examTreeData[this.levelMap[0]].child.push(res.result)
                }
                this.resetForm('examTreeForm')
              }else if(res.status !== 401){
                alert('添加行业大类或组别出错')
                this.resetForm('examTreeForm')
                return
              }
            })
          }else if(this.examTreeForm.extend3==='科目' || this.examTreeForm.extend3==='subject'){ //科目与考试关联
            let strArray=[]
            strArray = this.examTreeForm.industryName.split("  ")
            format.subjectName = strArray[0]
            format.subjectVersion = strArray[1]
            format.examCode = this.examCode
            format.property = this.examTreeForm.property
            delete format.industryName
            delete format.industryCode
            delete format.iconUrl
            delete format.parentId
            delete format.extend3
            delete format.lockStatus
            delete format.examName
            delete format.createUserId
            delete format.lockUserId
//            let num = this.levelMap[0]
//            format.industryCode = this.examTreeData[num].industryCode
//             let url = '/v1/itembank/itembankExamSuject'
            let url = '/v1/systemctl/treeExamSuject'

            let postData = {
              url: url,
              data: {
                format: format,
                value: TIKA_SYSTEM
              }
            }
            ApiPost(postData, URL_POST).then((res) => {
              let levelNum = this.levelMap.length
              if(res.status === 200){
                res.result.industryName = res.result.subjectName+'('+res.result.subjectVersion+')'
                let levelData = this.examTreeData[this.levelMap[0]].child[this.levelMap[1]]
                if(levelNum === 2){
                  if(levelData.child.length === 0){
                    this._getExamTreeData()
                    this.defaultExamTreeKeysMenu[0] = levelData.sequenceNbr
                  }
                  levelData.child.push(res.result)
                } else{
                  if(levelData.child[this.levelMap[2]].child.length === 0){
                    this._getExamTreeData()
                    this.defaultExamTreeKeysMenu[0] = levelData.child[this.levelMap[2]].sequenceNbr
                  }
                  levelData.child[this.levelMap[2]].child.push(res.result)
                }
                this.resetForm('examTreeForm')
              }else if(res.status !== 401){
                this.resetForm('examTreeForm')
                alert('科目考试挂载出错：'+res.message)
                return
              }
            })
          }
        }else if(this.postOrPut==='put'){
          let format={}
          format.recUserId = sessionStorage.getItem("userId")
          format.lockUserId = sessionStorage.getItem("userId")
          let url = ''
          if(this.extend3 === 'industry' || this.extend3 === 'group' ){
            //url = '/v1/itembank/itembankIndustryInfo/' + this.sequenceNbr
            url ='/v1/systemctl/treeIndustryInfo/' + this.sequenceNbr
            if(this.extend3 === 'industry'){
              format.iconUrl = this.putIconUrl
            }else{
              format.industryName = this.examTreeFormPut.industryName
              format.extend1 = this.examTreeFormPut.checked
            }

            format.description= this.examTreeFormPut.description
            format.lockStatus= this.examTreeFormPut.lockStatus
          }else if(this.extend3 === 'exam'){
            // url = '/v1/itembank/itembankExamInfo/' + this.sequenceNbr
            url = '/v1/systemctl/treeExamInfo/' + this.sequenceNbr
            format.examName = this.examTreeFormPut.industryName
            format.description= this.examTreeFormPut.description
            format.lockStatus= this.examTreeFormPut.lockStatus
          }else{
            // url = "/v1/itembank/itembankExamSuject/updateTheSubjectAndExam?subjectCode=" + this.subjectCode + "&examCode=" + this.parentId
            url = "/v1/systemctl/treeExamSuject/updateTheSubjectAndExam?subjectCode=" + this.subjectCode + "&examCode=" + this.parentId

            let putArray = this.examTreeFormPut.industryName.split(' ')
            format.subjectName=putArray[0]
            format.subjectVersion=putArray[1]
            format.property = this.examTreeFormPut.property
            format.isdefault= this.examTreeFormPut.isdefault
            format.description= this.examTreeFormPut.description
          }
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
                this.examTreeData[this.levelMap[0]].iconUrl = res.result.iconUrl
                this.examTreeData[this.levelMap[0]].description= res.result.description
                this.examTreeData[this.levelMap[0]].lockStatus= res.result.lockStatus
              }
              if(num === 2){
                if(this.examTreeFormPut.extend3 === '组别'){
//                  this.examTreeFormPut.checked = res.result.extend1
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].industryName = res.result.industryName
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].extend1 = res.result.extend1
                }else{
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].industryName = res.result.examName
                }
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].description = res.result.description
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].lockStatus = res.result.lockStatus
              }
              if(num === 3){
                if(this.examTreeFormPut.extend3 === '考试'){
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].industryName = res.result.examName
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].description = res.result.description
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].lockStatus = res.result.lockStatus
                }else{
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].industryName = res.result.subjectName + '('+res.result.subjectVersion + ')'
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].subjectName = res.result.subjectName
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].parentName = res.result.examName
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].property = res.result.property
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].isdefault = res.result.isdefault
                  this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].thridDescription = res.result.description
                }
              }
              if(num === 4){
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].industryName = res.result.subjectName + '('+res.result.subjectVersion + ')'
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].subjectName = res.result.subjectName
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].parentName = res.result.examName
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].property = res.result.property
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].isdefault = res.result.isdefault
                this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].child[this.levelMap[3]].thridDescription = res.result.description
              }
              this.showExamNo = false
            }else if(res.status !== 401){
              alert('更新节点出错：'+res.message)
              return
            }
          })

        }
      },
      handleNodeClick(clickData,node,nodeGroup) {
        if(!clickData.child){
          delete clickData.child
          clickData.child = []
        }
        console.log(clickData)
        let sequrenceNbr = clickData.sequenceNbr
        this.sequrenceNbr = sequrenceNbr
        if(clickData.examCode){
          this.examCode = clickData.examCode
        }
        if(clickData.subjectCode){
          this.subjectCode = clickData.subjectCode
        }
        if(clickData.parentId){
          this.parentId = clickData.parentId
        }


        this.levelMap=[]
        this.levelMap = levelMap(node, this.examTreeData, sequrenceNbr, 'child')


        if(clickData.extend3 === 'exam'){ //获去搜索的数据
          this._getSubjectName(clickData.examCode)
        }

        this.showExamNo = false
        let timeData = new Date().getTime()
        let sunTime = timeData - this.startTime
        let subjectType = clickData.extend3
        let industryName = clickData.industryName
        let temp = false
        if(industryName === this.industryName){
          temp = true
        }
        this.subjectType = subjectType
        this.industryName = industryName
        this.industryCode = clickData.industryCode
        this.sequenceNbr = clickData.sequenceNbr
        this.extend3 = clickData.extend3
        this.startTime = timeData
        if(sunTime<1000 && temp){ //间隔 内容判断是否是单双击
          this.postOrPut='put'
          if(node.level === 1){
            this.examTreeFormPut.extend3 = '行业'
            this.examTreeFormPut.industryName  = clickData.industryName
            this.examTreeFormPut.iconUrl       = clickData.iconUrl
            this.examTreeFormPut.description  = clickData.description
            this.examTreeFormPut.lockStatus    = clickData.lockStatus
            this.iconUrl1       = this.domain + '/' + clickData.iconUrl
            this.showExamNo =true
            console.log(this.examTreeFormPut)
          }
          if(node.level === 2){
            if(clickData.extend3 === 'group'){
              this.examTreeFormPut.extend3 = '组别'
              if(clickData.extend1 === 'true'){
                this.examTreeFormPut.checked = true
              }else{
                this.examTreeFormPut.checked = false
              }
            }else{
              this.examTreeFormPut.extend3 = '考试'
            }
            this.examTreeFormPut.industryName  = clickData.industryName
            this.examTreeFormPut.description   = clickData.description
            this.examTreeFormPut.lockStatus    = clickData.lockStatus
            this.putUpNode= this.examTreeData[this.levelMap[0]].industryName+'/行业'

            this.showExamNo =true
          }

          if(node.level === 3){
            if(clickData.extend3 === 'exam'){
              this.examTreeFormPut.extend3 = '考试'
              this.examTreeFormPut.industryName  = clickData.industryName
              this.examTreeFormPut.description   = clickData.description
              this.examTreeFormPut.lockStatus    = clickData.lockStatus
              this.putUpNode= this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].industryName+'/组别'
            }else{
              this.examTreeFormPut.extend3 = '科目'
              this.examTreeFormPut.industryName  = clickData.subjectName + ' ' + clickData.subjectVersion
              this.examTreeFormPut.property      = clickData.property
              this.examTreeFormPut.isdefault     = clickData.isdefault
              this.examTreeFormPut.description   = clickData.thridDescription
              this.putUpNode= this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].industryName+'/考试'
            }
            this.showExamNo =true
          }
          if(node.level === 4){
            this.examTreeFormPut.extend3 = '科目'
            this.examTreeFormPut.industryName   = clickData.subjectName + ' ' + clickData.subjectVersion
            this.examTreeFormPut.property       = clickData.property
            this.examTreeFormPut.isdefault      = clickData.isdefault
            this.examTreeFormPut.description    = clickData.thridDescription
            this.putUpNode= this.examTreeData[this.levelMap[0]].child[this.levelMap[1]].child[this.levelMap[2]].industryName+'/考试'

            this.showExamNo =true
          }
        }else{
          this.start = 0
        }
      },
      resetForm(formName){
        this.showExamNo = false
        this.postOrPut = 'post'
        this.$refs[formName].resetFields()
//        this.examTreeForm.industryName=''
//        this.examTreeForm.property = ''

      },
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
      _getSubjectName(val){
        let getData = {
          // url: `/v1/itembank/itembankSubject/itembank/selectAllSubjectsOfExam/${val}`,
          url: `/v1/systemctl/treeSubject/tree/selectAllSubjectsOfExam/${val}`,
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            res.result.forEach((item,index)=>{
              this.statesData[index] = item.subjectName + '  ' + item.subjectVersion
            })
            this.list = this.statesData.map(item => {
              return { value: item, label: item };
            })
          } else if(res.status !== 401) {
            alert(res.message)
            return
          }
        })
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      successRes(res){
        this.iconUrl = this.domain + '/' + res.key
        this.iconUrl1 = this.domain + '/' + res.key
        this.examTreeForm.iconUrl = res.key
        this.putIconUrl = res.key
      },
      beforeAvatarUpload(file) {    //在图片提交前进行验证
        const isJPG = file.type === 'image/jpg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size/ 1024 < 50
        let logo = isPNG || isJPG
        if (!logo) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 50KB!')
        }
        return logo && isLt2M
      },
      groupStatus(val){
        if(val === 'UNLOCK'){
          this.examTreeFormPut.checked = false
        }
      },
      upNode(){
        let levelMapLength = this.levelMap.length
        this.defaultExamTreeKeysMenu.push(this.sequrenceNbr)

        if(levelMapLength === 0) {
          alert('请选择节点！！')
          return
        }
        if(levelMapLength ===1){
          let levelMap0 = this.levelMap[0]
          if( levelMap0===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let temp = this.examTreeData[levelMap0]
            this.examTreeData[levelMap0] = this.examTreeData[levelMap0-1]
            this.examTreeData[levelMap0-1] = temp
            let changeData = []
            changeData = this.examTreeData
            this.examTreeData=[]
            changeData.forEach(res=>{
              this.examTreeData.push(res)
            })
          }
        }
        if(levelMapLength ===2){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]

          if( levelMap1===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let temp2 = {}
            temp2 = this.examTreeData[levelMap0].child[levelMap1-1]
            this.examTreeData[levelMap0].child[levelMap1-1] = this.examTreeData[levelMap0].child[levelMap1]
            this.examTreeData[levelMap0].child[levelMap1] = temp2
            let examTreeData2 = []
            examTreeData2 = this.examTreeData
            this.examTreeData = []
            examTreeData2.forEach(res=>{
              this.examTreeData.push(res)
            })
          }
        }
        if(levelMapLength ===3){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]
          let levelMap2 = this.levelMap[2]
          this.defaultExamTreeKeysMenu.push(this.sequrenceNbr)
          if( levelMap2===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let temp3 = {}
            temp3 = this.examTreeData[levelMap0].child[levelMap1].child[levelMap2-1]
            this.examTreeData[levelMap0].child[levelMap1].child[levelMap2-1] = this.examTreeData[levelMap0].child[levelMap1].child[levelMap2]
            this.examTreeData[levelMap0].child[levelMap1].child[levelMap2] = temp3
            let examTreeData2 = []
            examTreeData2 = this.examTreeData
            this.examTreeData = []
            examTreeData2.forEach(res=>{
              this.examTreeData.push(res)
            })
          }
        }
        if(levelMapLength ===4){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]
          let levelMap2 = this.levelMap[2]
          let levelMap3 = this.levelMap[3]
          this.defaultExamTreeKeysMenu.push(this.sequrenceNbr)

          if( levelMap3===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let temp4 = {}
            temp4 = this.examTreeData[levelMap0].child[levelMap1].child[levelMap2].child[levelMap3-1]
            this.examTreeData[levelMap0].child[levelMap1].child[levelMap2].child[levelMap3-1] = this.examTreeData[levelMap0].child[levelMap1].child[levelMap2].child[levelMap3]
            this.examTreeData[levelMap0].child[levelMap1].child[levelMap2].child[levelMap3] = temp4
            let examTreeData2 = []
            examTreeData2 = this.examTreeData
            this.examTreeData = []
            examTreeData2.forEach(res=>{
              this.examTreeData.push(res)
            })
          }
        }
      },
      downNode(){
        let examTreeLength = this.examTreeData.length-1
      }
    }
  }
</script>

<style>
  .search .el-input{
    width: 18%;
    display: inline-block;
  }
  .formRight .el-upload-dragger {
    height: 100%;
    width: 100%
  }
  .formRight .el-select {
    width: 100%
  }
  .formRight .el-form-item__label{
    width: 100px
  }
  .formRight .el-form-item__content{
    margin-left: 100px;
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color:#afe1f9;
  }

</style>

