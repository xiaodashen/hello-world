<template>
  <div>
    <div class="table-style">
      <div class="searchGoods">
        <div class="top-line">
          <el-input v-model="goodsName" @blur="loseBlur" placeholder="视频名称" ></el-input>
          <el-input v-model="goodsLargeClass" @blur="loseBlur" placeholder="视频大类" ></el-input>
          <el-input v-model="goodsSmallClass" @blur="loseBlur" placeholder="视频小类" ></el-input>
          <el-input v-model="goodsTeacher" @blur="loseBlur" placeholder="视频教师" ></el-input>
          <br><br>
          <el-input v-model="goodsVersion" @blur="loseBlur" placeholder="视频版本" ></el-input>
          <el-input v-model="goodsStatus" @blur="loseBlur" placeholder="视频状态" ></el-input>
          <el-input v-model="goodsKeyWord" @blur="loseBlur" placeholder="视频关键字" ></el-input>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          v-if="tableData"
          highlight-current-row
          @row-dblclick="tableClick">
          <el-table-column  prop="num"  label="序号" width="80px"></el-table-column>
          <el-table-column  prop="productName"  label="视频名称"></el-table-column>
          <el-table-column  prop="extend1"  label="视频大类"></el-table-column>

          <el-table-column  prop="extend2"  label="视频小类" ></el-table-column>
          <el-table-column  prop="agencyName" label="创建机构"></el-table-column>
          <el-table-column  prop="teacher" label="视频教师"></el-table-column>
          <el-table-column  prop="extend3" label="视频版本"></el-table-column>
          <el-table-column  prop="status" label="视频状态"></el-table-column>
          <el-table-column  prop="keyWords" label="视频关键字"></el-table-column>
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
    <div class="formRight" v-show = "showNo">
      <el-form :model="goodsDataForm" ref="goodsDataFormRef" label-width="100px" class="demo-dynamic">
        <el-form-item
          label="视频名称:">
          <el-input v-model="goodsDataForm.goodsName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="视频关键字:">
          <el-input v-model="goodsDataForm.goodsKeyWords" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="视频大类:">
          <el-input v-model="goodsDataForm.goodsLargeClass" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="视频小类:">
          <el-input v-model="goodsDataForm.goodsSmallClass" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="创建机构:">
          <el-input v-model="goodsDataForm.agencyName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="视频教师:">
          <el-input v-model="goodsDataForm.goodsTeacher" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="视频版本:">
          <el-input v-model="goodsDataForm.goodsVersion" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="视频状态:">
          <el-input v-model="goodsDataForm.goodsStatus" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="生效时间:">
          <el-input v-model="goodsDataForm.effectiveTime" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          prop="uploadTime"
          label="上传时间:">
          <el-input v-model="goodsDataForm.uploadTime" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="备注:">
          <el-input type='textarea' v-model="goodsDataForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <router-link :to="{path:`/statgoods/goodsEdit/${sequenceNbr}`}"  target = "_blank">
            <el-button type="primary" >视频信息修改</el-button>
          </router-link>
          <router-link :to="{path:`/statgoods/goodsUpLoadVideo/${productCode}/${examCode}`}" target = "_blank">
            <el-button type="primary" >视频信息维护</el-button>
          </router-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import newList from 'common/content/newList'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_GOODS} from 'api/config'
  export default {
    data() {
      return {
        goodsName:'',
        goodsLargeClass:'',
        goodsSmallClass:'',
        goodsKeyWord:'',
        goodsVersion:'',
        goodsTeacher:'',
        goodsStatus:'',
        tableData: [],
        goodsDataForm:{
          goodsName:'',
          goodsKeyWords:'',
          goodsLargeClass:'',
          goodsSmallClass:'',
          agencyName:'',
          goodsTeacher:'',
          goodsVersion:'',
          goodsStatus:'',
          effectiveTime:'',
          uploadTime:'',
          description:'',
        },

        value: '',
        showNo: false,
        current: 1,
        size: 10,
        total:0,

        editableTabsValue2: '1',
        editableTabs2: [],
        tabIndex: 0,
        inputContentVisible: false,
        inputContentValue: '',
        //视频列表
        goodsListArrays:{},
        tagName: '',
        sequenceNbr:''

      }
    },
    mounted() {
      this._getGoodsLists()
    },
    components: {
      newList
    },
    methods: {
      loseBlur(){
        this.productName = this.goodsName;
        this.extend1 = this.goodsLargeClass;
        this.extend2 = this.goodsSmallClass;
        this.keyWords = this.goodsKeyWord;
        this.extend3 = this.goodsVersion;
        this.teacher = this.goodsTeacher;
        this.status = this.goodsStatus;
        this._getGoodsLists()
      },

      _getGoodsLists(data) {//获取视频列表信息 分页信息列表 mobile/lockStatus
        let agencyCode = sessionStorage.getItem('agencyCode')
        let url = "/v1/mall/productinfo/page?current="+ this.current + "&size=" + this.size +
          "&productName=" + this.goodsName + "&extend1=" + this.goodsLargeClass +"&extend2=" + this.goodsSmallClass +
          "&keyWords=" + this.goodsKeyWord + "&extend3=" + this.goodsVersion +
          "&teacher=" + this.goodsTeacher + "&status=" + this.goodsStatus+'&agencyCode='+agencyCode;
        let getData = {
          url: encodeURI(url),
          value: TIKA_GOODS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200){
            let resDataTemp = []
            this.total = res.result.total;
            let pages = res.result.pages;
            let resData = res.result.records;
            let current =  0;
            if(!data){
              current = res.result.current;
            }else{
              current = pages;
            }
            var i = 1;
            var temp = {};
            resData.forEach((temp) => {
              if(this.total < this.size){
                temp.num = i;
                i++;
              }else{
                temp.num = (current-1)*this.size + i;
                i++;
              }
              resDataTemp.push(temp);
            });
            this._mesLists(resDataTemp, pages, current);
          } else {
            alert(res.message);
            return
          }
        })
      },

      onSubmit(){
        this.$refs['goodsDataFormRef'].validate((valid) => {
          if (valid) {
            this.onSubmitPut();
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      onSubmitPut() {
        let description = this.goodsDataForm.description;
        let format = {
          description: description,
          recUserId : sessionStorage.getItem('userId')
        }
        let url = '/v1/mall/productinfo/update/' + this.sequenceNbr
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_GOODS
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200){
            this.showNo = false;
            this._getGoodsLists()
            console.log(this.showNo);
          } else {
            alert("个人信息编辑出现错误："+res.message)
            this.resetForm()
            return
          }
        })
      },

      _mesLists(resDatas, pages, current){
        this.tableData = resDatas;
        this.pages = pages;
        this.current = current;
      },
      handleSizeChange(val) {
        this.size= val;
        this._getGoodsLists()
      },
      handleCurrentChange(val) {
        this.current=val;
        this._getGoodsLists()
      },
      resetForm() {
        this.$refs['goodsDataFormRef'].resetFields()
        this.showNo = false
      },
      tableClick(row){
        this.rowTemp = row;
        this.sequenceNbr = row.sequenceNbr;
        this.examCode = row.productExam;
        let getData = {
          url: "/v1/mall/productinfo/selectone/"+ this.sequenceNbr,
          value: TIKA_GOODS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            var resTemp = res.result;
            this.goodsDataForm.goodsName = resTemp.productName;
            this.goodsDataForm.goodsKeyWords = resTemp.keyWords;
            this.goodsDataForm.goodsLargeClass =resTemp.extend1;
            this.goodsDataForm.goodsSmallClass = resTemp.extend2;
            this.goodsDataForm.agencyName = resTemp.agencyName;
            this.goodsDataForm.goodsTeacher = resTemp.teacher;
            this.goodsDataForm.goodsVersion = resTemp.extend3;
            this.goodsDataForm.goodsStatus = resTemp.status;
            this.goodsDataForm.effectiveTime = resTemp.startDate + '至'+resTemp.endDate;
            this.goodsDataForm.uploadTime = resTemp.startDate;
            this.goodsDataForm.description = resTemp.description;
            this.productCode =resTemp .productCode
            if(!this.showNo){
              this.showNo = true
            }
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
      }

    }
  }
</script>

<style>
  .table-style .searchGoods{
    height:150px;
    /*margin-top: 110px;*/
    margin-bottom: 20px;
    width:100%;
    background: #fff;
  }

  .table-style .searchGoods .top-line{
    padding-top: 25px
  }

  .table-style .searchGoods .el-button--primary{
    float: right;
    width: 20%
  }
  .searchGoods .el-input{
    width: 18%;
    display: inline-block;
  }

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
  .elDialog .topLeftRight .topLeft{
    float : left;
    width : 60%
  }
  .elDialog .topLeftRight .topRight{
    float : right;
    width : 40%
  }
</style>


