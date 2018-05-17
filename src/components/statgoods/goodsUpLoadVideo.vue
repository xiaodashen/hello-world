
<template>
  <div class="table-style">
    <div class="classContent">
        <span>课程内容：</span>
      <el-form
          :inline="true"
          :model="formInline"
          ref="formInlineRef"
          class="demo-form-inline"
          style="display: inline-block">
          <el-form-item prop="examName">
            <el-input v-model="formInline.examName"   placeholder="考试名称"  disabled="disabled"  style="width:210px"></el-input>
          </el-form-item>
          <el-form-item prop="subjectName">
                        <!--:rules="[{required: true, message: '关联科目不能为空', trigger: 'blur'}]">-->
            <el-select v-model="formInline.subjectName"
                       placeholder="关联科目"
                       filterable
                       remote
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

        </el-form>
      <!--添加章节信息-->
      <div style="margin-bottom: 10px; float:right;" >
        <el-input
          class="input-new-tag"
          v-show="inputContentVisible"
          v-model="inputContentValue"
          ref="saveTagInput"
          size="small"
          @blur="handleInputContentConfirm">
          @keyup.enter.native="handleInputContentConfirm"
        </el-input>
        <el-button v-show="!inputContentVisible" class="button-new-tag"
                   size="small" @click="showContentInput">点击添加章名称</el-button>
      </div>
      <el-tabs
        v-model="editableTabsValue2"
        type="card"
        closable
        style="width:80%;margin-bottom: 20px"
        @tab-click="tabClick"
        @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabs2"
          :key="item.name"
          :label="item.title"
          :name="item.name">
        </el-tab-pane>
      </el-tabs>
      <div style="font-size: 16px">
        <span style="margin-right: 50px">显示名称</span>
        <span style="margin-right: 298px">文件路径</span>
        <span style="margin-right: 49px">课程大小</span>
        <!--<span style="margin-right: 49px">课程长度</span>-->
        <span style="margin-right: 49px">课程权限</span>
      </div>
      <div v-for="(editableTabs,index) in editableTabs2">
        <new-list
          v-if="editableTabs.name == tagName"
          :goodsListTitle="editableTabs">
        </new-list>
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button type="warning" @click="resetForm">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import newList from 'common/content/newList'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, TIKA_GOODS,TIKA_SYSTEM} from 'api/config'
  export default {
    data() {
      return {
        formInline:{
          examName:'',
          subjectName:'',
        },
        options4: [],
        list: [],
        loading: false,
        editableTabsValue2: '1',
        editableTabs2: [],
        tabIndex: 0,
        inputContentVisible: false,
        inputContentValue: '',
        //商品列表
        goodsListArrays:{},
        tagName: ''

      }
    },
    mounted() {
      this._getSubjectsOfExam()
      this._getExamName()
    },

    components: {
      newList
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
      _getExamName(){
        let url="/v1/systemctl/treeExamInfo/ByExamCode/"+this.$route.params.examCode;
        let getData = {
          url: encodeURI(url),
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200){
            this.formInline.examName = res.result.examName
          } else {
            alert(res.message);
            return
          }
        })
      },
      _getSubjectsOfExam(){
        let url="/v1/systemctl/treeExamInfo/selectSubjectsOfExamByExamCode/"+this.$route.params.examCode;
        let getData = {
          url: encodeURI(url),
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200){
            this.esubjectData = [];
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.subjectCode +','+  item.subjectName;
              temp.label = item.subjectName;
              this.esubjectData.push(temp)
            })
            this.list = this.esubjectData.map(item => {
              return { value: item.value, label: item.label };
            })
          } else {
            alert(res.message);
            return
          }
        })
      },
      tabClick(val){//点击选中标签
        this.tagName = val.name
        console.log('tabClick(val){')
        console.log(this.tagName)
      },
      showContentInput() {//输入框与添加标签切换
        this.inputContentVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      removeTab(targetName) {//移除标签
        console.log('console.log(targetName)console.log(targetName)console.log(targetName)')
        console.log(targetName)
        let tabs = this.editableTabs2
        let activeName = this.editableTabsValue2
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        delete this.goodsListArrays[targetName]
        this.editableTabsValue2 = activeName
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName)
        this.tagName = this.editableTabsValue2
        console.log('removeTab(targetName) {//移除标签')
        console.log(this.tagName)
        console.log(this.goodsListArrays)
      },
      handleInputContentConfirm() {//添加标签
        let newTabName = ++this.tabIndex + ''
        let inputContentValue = this.inputContentValue
        let editableTabs2Length =this.editableTabs2.length
        let tempData = {}
        if(inputContentValue){
          tempData.title = inputContentValue
          tempData.child = [
            {
              name: '',
              url:'',
              classSize: '',
              classLength: '',
              classManger: '0',
              showUpLoad:true,
              delOrNo:false
            }
          ]
          if(editableTabs2Length === 0){
            tempData.name = '1'
          }else{
            this.editableTabs2[editableTabs2Length-1].name
            tempData.name = newTabName
          }
          this.editableTabs2.push(tempData)
        }
        this.editableTabsValue2 = newTabName
        this.inputContentVisible = false
        this.inputContentValue = ''
        this.goodsListArrays[newTabName] = inputContentValue    //添加
        this.tagName = newTabName
      },
      submit(){
        this.$refs.formInlineRef.validate((valid)=>{
          if (valid) {
            let flag = [];
            if (this.editableTabs2.length > 0){
              this.editableTabs2.forEach(item => {
                if (item.child.length > 0){
                  item.child.forEach(value => {
                    if (value.name === '' || value.url === ''){
                      flag.push('false');
                      return;
                    }else {
                      flag.push('true')
                    }
                  })
                }
              })
            }
            console.log(flag);
            if (-1 === $.inArray('false', flag)){
              this.postSubmitApi();
            }else {
              alert('显示名称未填或者视频未上传完成');
              return;
            }
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      postSubmitApi(){
        let url = "/v1/mall/MallMediaInfo/createmedia";
        let format = {
          createUserId : sessionStorage.getItem('userId'),
          productCode : this.$route.params.productCode,
          examCode : this.$route.params.examCode,
          examName : this.formInline.examName,
          subjectCode : this.formInline.subjectName.split(',')[0],
          subjectName : this.formInline.subjectName.split(',')[1],
          child:this.editableTabs2
        };
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_GOODS
          }
        }
        ApiPost(postData, URL_POST).then((res)=>{
          console.log(res);
          if (res.status === 200){
            alert('视频上传成功')
//            return;
            window.location.href = '#/statgoods/goodsList';
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      resetForm(){
        this.$refs.formInlineRef.resetFields();
        this.editableTabs2 = [];
      }

    }
  }
</script>

