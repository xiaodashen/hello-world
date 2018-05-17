<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="mobile" @blur="loseBlur" placeholder="账号关键字"></el-input>
          <el-select v-model="LockStatus" @change="changeLockStatus" placeholder="选择生效状态">
            <el-option
              v-for="item in SEARCH_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" style="msrgin-left: 15px" icon="plus" @click="addStudentInfo">新增学员</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号" width="80px"></el-table-column>
        <el-table-column  prop="mobile"  label="学员账号"></el-table-column>
        <el-table-column  prop="agencyName"  label="机构名称"></el-table-column>
        <el-table-column  prop="registerDate" label="注册时间"></el-table-column>
        <el-table-column  prop="lockStatus" label="生效状态"></el-table-column>
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
    <div class="formRight" v-show="showNo">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateFormRef"
        label-width="80px"
        class="demo-dynamic"
        :rules="rules2"
        v-if="postOrPut==='post'">
        <el-form-item
          prop="mobile"
          label="账户:">
          <el-input v-model="dynamicValidateForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="生效状态:">
          <el-select v-model="dynamicValidateForm.lockStatus" placeholder="请选当前状态">
            <el-option
              v-for="item in REC_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="agency" label="注册机构:">
          <el-input v-model="dynamicValidateForm.agency" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item  prop="VIPItemBank" label="VIP题库:">
          <el-select
            v-model="dynamicValidateForm.VIPItemBank"
            @change="changeVIPStatus"
            disabled
            placeholder="无">
            <el-option
              v-for="item in VIP_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="VIPExam" label="VIP考试:"
                       v-if="dynamicValidateForm.VIPItemBank === 'YES'"
                       :rules="[{required: true, message: 'VIP考试不能为空', trigger: 'blur'}]">
          <el-select v-model="dynamicValidateForm.VIPExam"
                     placeholder="填写考试关键字"
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

        <el-form-item>
          <el-button type="primary" @click="onSubmit('dynamicValidateFormRef')">保存</el-button>
          <el-button @click="resetForm('dynamicValidateFormRef')">取消</el-button>
        </el-form-item>
      </el-form>
      <el-form
        :model="dynamicValidateFormPut"
        ref="dynamicValidateFormPut"
        label-width="80px"
        class="demo-dynamic"
        v-if="postOrPut==='put'">
        <el-form-item prop="mobile" label="学员账户:">
          <el-input v-model="dynamicValidateFormPut.mobile"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="生效状态:">
          <el-select v-model="dynamicValidateFormPut.lockStatus" placeholder="请选当前状态">
            <el-option
              v-for="item in REC_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="agency" label="注册机构:">
          <el-input v-model="dynamicValidateFormPut.agency" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item  prop="VIPItemBank" label="VIP题库:">
          <el-select
            v-model="dynamicValidateFormPut.VIPItemBank"
            @change="changeVIPStatus"
            disabled
            placeholder="请选当前状态">
            <el-option
              v-for="item in VIP_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item  prop="extend2" label="VIP考试:"
                       v-if="dynamicValidateFormPut.VIPItemBank === 'YES'"
                       :rules="[{required: true, message: 'VIP考试不能为空', trigger: 'blur'}]">
          <el-select v-model="dynamicValidateFormPut.extend2"
                     placeholder="填写考试关键字"
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


        <el-form-item  prop="registerDate" label="创建时间:">
          <el-input v-model="dynamicValidateFormPut.registerDate" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('dynamicValidateFormPut')">保存</el-button>
          <el-button @click="resetForm('dynamicValidateFormPut')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT,TIKA_USER } from 'api/config'
  export default {
    data() {
      var checkMobile = (rule, value, callback) => {
        setTimeout(() => {
          var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
          if(!myreg.test(value)){
            callback(new Error('请输入有效电话号码'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        tableData: [],
        dynamicValidateFormPut: {
          lockStatus: '',
          mobile: '',
          registerDate: '',
          extend1: '',
          VIPItemBank : '',
          extend2: ''
        },
        dynamicValidateForm: {
          VIPItemBank: 'NO',
          VIPExam:'',
          mobile: '',
          lockStatus:'UNLOCK',
          agency: sessionStorage.getItem("agencyName")
        },
        mobile: '',
        LockStatus: '',
        options: [],
        REC_STATUSS: [{
          value: 'UNLOCK',
          label: '生效'
        }, {
          value: 'LOCK',
          label: '禁用'
        }],
        SEARCH_STATUSS: [
          {
            value: '',
            label: '所有'
          },
          {
            value: 'UNLOCK',
            label: '生效'
          },
          {
            value: 'LOCK',
            label: '禁用'
          }
        ],
        VIP_STATUSS: [{
          value: 'YES',
          label: '有'
        }, {
          value: 'NO',
          label: '无'
        }],
        value: '',
        showNo: false,
        postOrPut : 'post',
        current: 1,
        size: 10,
        total:0,
        userId: '',
        rowTemp: '',
        searchLockStatus: '',
        searchMobile: '',
        searchLocalStatus: '',
        options4: [],
        list: [],
        loading: false,
        examData:[],
        dynamicValidateFormRef: {
          mobile: ''
        },
        rules2:{
          mobile:[{required: true, message: '账号不能为空',trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this._getStudentLists()
    },
    methods: {
      loseBlur(){
        this.searchMobile = this.mobile
        this._getStudentLists()
      },
      addStudentInfo(){
        this.options4=[];
        this.showNo = true
        this.postOrPut = 'post'
        this.$nextTick(function() {
          this.$refs['dynamicValidateFormRef'].resetFields()
        })
      },
      changeLockStatus(val){
        this.searchLocalStatus = val
        this._getStudentLists()
      },
      changeVIPStatus(val){
        if ('YES' === val){
          this.options4=[];
        } else {
          this.dynamicValidateFormPut.extend2 = ''
          this.dynamicValidateForm.VIPExam = ''
        }
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
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.postOrPut === 'put') {
              this.onSubmitApi()
            } else {
              this.postSubmitApi()
            }
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },

      onSubmitApi() {
        let extend1,extend2;
        let lockStatus = this.dynamicValidateFormPut.lockStatus
        let userId= this.userId
        let length =  this.dynamicValidateFormPut.extend2.split(',').length
        if('YES' === this.dynamicValidateFormPut.VIPItemBank){
          if(length === 1 ){
            extend1 = this.dynamicValidateFormPut.extend1
            extend2 = this.dynamicValidateFormPut.extend2
          }else{
            extend1 = this.dynamicValidateFormPut.extend2.split(',')[0]
            extend2 = this.dynamicValidateFormPut.extend2.split(',')[1]
          }

        }else {
          extend1 = ''
          extend2 = ''
        }
        let format = {
          lockStatus: lockStatus,
          extend1: extend1,
          extend2: extend2,
          lockUserId: sessionStorage.getItem("userId"),
          recUserId: sessionStorage.getItem("userId"),
          agencyCode: sessionStorage.getItem("agencyCode")
        }
        let url = '/v1/publicuser/userinfo/' + userId
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_USER
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200){
            this.resetForm('dynamicValidateFormPut')
            if(this.dynamicValidateFormPut.lockStatus === "UNLOCK"){
              this.rowTemp.lockStatus = '生效'
            }else{
              this.rowTemp.lockStatus = '禁用'
            }
          } else {
            alert("个人信息编辑出现错误："+res.message)
            return
          }
        })
      },
      postSubmitApi(){
        let mobile= this.dynamicValidateForm.mobile
        let lockStatus = this.dynamicValidateForm.lockStatus
        let extend1 = this.dynamicValidateForm.VIPExam.split(',')[0] || ""
        let extend2 = this.dynamicValidateForm.VIPExam.split(',')[1] || ""

        let format = {
          mobile :mobile,
          lockStatus: lockStatus,
          extend1: extend1,
          extend2:extend2,
          agencyCode:sessionStorage.getItem('agencyCode'),
          agencyName:sessionStorage.getItem('agencyName'),
          recUserId: sessionStorage.getItem("userId")
        }
        let url = '/v1/publicuser/userinfo/creatUser'
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_USER
          }
        }

        console.log(postData)

        ApiPost(postData, URL_POST).then((res)=>{
          if (res.status === 200){
            this.resetForm('dynamicValidateFormRef')
            this._getStudentLists('true')
          }else {
            alert("个人信息新增出现错误："+res.message)
            return
          }
        })
      },

      _getStudentLists(data) {//获取学员信息 分页信息列表 mobile/lockStatus
        let agencyCode = sessionStorage.getItem('agencyCode')
        let url = "/v1/publicuser/userinfo/page?current="+ this.current + "&size=" + this.size + "&mobile=" + this.searchMobile +
          "&lockStatus=" + this.searchLocalStatus + '&agencyCode='+agencyCode
        let getData = {
          url: encodeURI(url),
          value: TIKA_USER
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200){
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
            var temp = {}
            resData.forEach((temp) => {
              if(this.total < this.size){
                temp.num = i
                i++
              }else{
                temp.num = (current-1)*this.size + i
                i++
              }
              if(temp.lockStatus === 'LOCK'){
                temp.lockStatus = '禁用'
              }else{
                temp.lockStatus = '生效'
              }
              this.options.forEach((item)=>{
                if(temp.parentId === item.value){
                  temp.infoTypeDicValue = item.label
                }
              })
              resDataTemp.push(temp)
            })
            this._mesLists(resDataTemp, pages, current)
          } else {
            alert(res.message)
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
        this._getStudentLists()
      },
      handleCurrentChange(val) {
        this.current=val
        this._getStudentLists()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.showNo = false
      },
      tableClick(row){
        this.options4=[];
        this.postOrPut = 'put'
        this.rowTemp = row
        this.lockStatus = row.lockStatus
        this.userId = row.userId
        let getData = {
          url: "/v1/publicuser/userinfo/"+ this.userId,
          value: TIKA_USER
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            var resTemp = res.result
            this.dynamicValidateFormPut.lockStatus = resTemp.lockStatus
            this.dynamicValidateFormPut.mobile = resTemp.mobile
            this.dynamicValidateFormPut.agency = sessionStorage.getItem("agencyName")
            this.dynamicValidateFormPut.registerDate = resTemp.registerDate
            this.dynamicValidateFormPut.extend1 = resTemp.extend1
            this.dynamicValidateFormPut.extend2 = resTemp.extend2
            if ('' === resTemp.extend2){
              this.dynamicValidateFormPut.VIPItemBank = 'NO'
            }else {
              this.dynamicValidateFormPut.VIPItemBank = 'YES'
            }
            if(!this.showNo){
              this.showNo = true
            }
          }else {
            alert(res.message)
            return
          }
        })
      },
//      _getOptions(){
//        let getData = {
//          url: "/v1/staticinfo/staticinfotype/selectAllStaticInfoType",
//          value: TIKA_APP
//        }
//        ApiGet(getData, URL_GET).then((res)=>{
//          if(res.status === 200){
//            res.result.forEach(item=>{
//              let temp = {}
//              temp.value = item.sequenceNbr
//              temp.label = item.typeName
//              this.options.push(temp)
//            })
//          }
//        })
//      },
//      _getVIPExams(){
//        let agencyCode=sessionStorage.getItem('agencyCode')
//        let getData = {
//          url: '/v1/privilege/resource/agencyresourcelist?agencyCode='+agencyCode,
//          value:TIKA_WEB
//        }
//        ApiGet(getData, URL_GET).then((res)=>{
//          console.log(res)
//          if (res.status === 200) {
//            this.examData = [];
//            if(res.result.status !== 200){
//              alert('获取机构考试出错！！')
//              return
//            }
//            let resTemp = eval('('+ res.result.result+')')
//            resTemp.forEach(item=>{
//              let temp = {}
//              temp.label = item.examName
//              temp.value = item.examCode+','+item.examName
//              this.examData.push(temp)
//            })
//            this.list = this.examData.map(item => {
//              return { value: item.value, label: item.label };
//            })
//
//          } else {
//            alert('获取所有考试出错：'+res.message)
//            return
//          }
//
//        })
//      },
    }
  }
</script>

<style>

  .formRight .form-style{
    margin-top: 50px;
    margin-left: 5px;
  }
  .el-form-item{
    margin-bottom: 15px
  }

  .el-table .info-row {
    background: #c9e5f5;
  }
  .el-table .positive-row {
    background: #e2f0e4;
  }
  .el-table tr.current-row>td {
    background: #409eff
  }

  .table-style .search .top-line .el-select .el-input{
    width:90%;
  }

</style>
