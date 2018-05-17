<template>

  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="userName" @blur="loseBlur" placeholder="人员名称"></el-input>

          <el-input v-model="phone1" @blur="loseBlur" placeholder="账号关键字"></el-input>
          <el-select v-model="LockStatus" @change="changeLockStatus" placeholder="选择生效状态">
            <el-option
              v-for="item in SEARCH_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" style="msrgin-left: 15px" icon="plus" @click="addPersonInfo">新增人员</el-button>
        </div>
        <!--<div class="bottom-line">-->
          <!--<el-input placeholder="注册时间起"></el-input>-->
          <!--<el-input placeholder="注册时间终"></el-input>-->
          <!--<el-input placeholder="考试行业名称"></el-input>-->
          <!--<el-input placeholder="考试名称"></el-input>-->
        <!--</div>-->
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号" width="80px"></el-table-column>
        <el-table-column  prop="userName"  label="人员名称"></el-table-column>
        <el-table-column  prop="phone1"  label="账号"></el-table-column>
        <el-table-column  prop="agencyName"  label="机构"></el-table-column>
        <!--<el-table-column  prop="recStatus" label="注册状态"></el-table-column>-->
        <!--<el-table-column  prop="" label="考试行业"></el-table-column>-->
        <!--<el-table-column  prop="description" label="所选考试"></el-table-column>-->
        <el-table-column  prop="createTime" label="创建时间"></el-table-column>
        <el-table-column  prop="createUserId" label="创建人"></el-table-column>
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
        ref="dynamicValidateForm"
        label-width="90px"
        class="demo-dynamic"
        v-if="postOrPut==='post'">
        <el-form-item
          prop="userName"
          label="人员名称:"
          :rules="[{required: true, message: '人员名称不能为空', trigger: 'blur'}]">
          <el-input v-model="dynamicValidateForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="phone1" label="账号:"
          :rules="[{required: true, message: '账号不能为空'},
          {type: 'number', message: '账号必须为数字值'}]">
          <el-input v-model.number="dynamicValidateForm.phone1"></el-input>
        </el-form-item>
        <el-form-item prop="extend1" label="所在机构:">
          <el-input v-model="dynamicValidateForm.extend1" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="当前状态:">
          <el-select v-model="dynamicValidateForm.lockStatus" placeholder="请选当前状态">
            <el-option
              v-for="item in REC_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--{{dynamicValidateForm.roleNameList}}-->
        <el-form-item prop="roleNameList" label="分配角色:">
          <el-select
            v-model="dynamicValidateForm.roleNameList"
            multiple
            filterable
            allow-create>
            <el-option
              v-for="item in options5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('dynamicValidateForm')">保存</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">取消</el-button>
        </el-form-item>
      </el-form>
      <el-form
        :model="dynamicValidateFormPut"
        ref="dynamicValidateFormPut"
        label-width="90px"
        class="demo-dynamic"
        v-if="postOrPut==='put'">
        <el-form-item prop="userName" label="人员名称:">
          <el-input v-model="dynamicValidateFormPut.userName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="phone1" label="账号:">
          <el-input v-model="dynamicValidateFormPut.phone1" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="extend1" label="所在机构:">
          <el-input v-model="dynamicValidateFormPut.extend1" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="当前状态:">
          <el-select v-model="dynamicValidateFormPut.lockStatus" placeholder="请选当前状态">
            <el-option
              v-for="item in REC_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--{{options5}}-->
        <el-form-item prop="roleNameList" label="分配角色:">
          <el-select
            v-model="dynamicValidateFormPut.roleNameList"
            multiple
            filterable
            allow-create>
            <el-option
              v-for="item in options5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="createTime" label="创建时间:">
          <el-input v-model="dynamicValidateFormPut.createTime" disabled="disabled"></el-input>
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
  import { URL_GET, URL_POST, URL_PUT, TIKA_AGENCY, TIKA_RBAC} from 'api/config'
  export default {
    data() {
      return {
        tableData: [],
        dynamicValidateForm: {
          userName: '',
          phone1: '',
          extend1: sessionStorage.getItem("agencyName"),
          lockStatus: 'UNLOCK',
          roleNameList:[]
        },
        dynamicValidateFormPut: {
          userName: '',
          phone1: '',
          lockStatus: '',
          roleNameList:[]
        },
        phone1: '',
        LockStatus: '',
        userName: '',
        options: [],
        options5: [],
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
        value: '',
        showNo: false,
        current: 1,
        size: 10,
        total:0,
        userId: '',
        rowTemp: '',
        searchLockStatus: '',
        searchMobile: '',
        searchLocalStatus: '',
        searchUserName: '',
        postOrPut:'post'
      }
    },
    mounted() {
      this._getPersonLists()
      this._getRoleLists()
    },
    methods: {
      loseBlur(){
        this.searchMobile = this.phone1 ? this.phone1 : ''
        this.searchUserName = this.userName ? this.userName : ''
        this._getPersonLists()
      },
      changeLockStatus(val){
        this.searchLocalStatus = val
        this._getPersonLists()
      },
      addPersonInfo(){
        this.showNo = true
        this.postOrPut = 'post'
      },
      onSubmit(formName){
        if (this.postOrPut === 'put'){
          this.onSubmitApi()
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.postSubmitApi()
            } else {
              return false;
            }
          })
        }
      },
      onSubmitApi(){
        let roleNameList = [];
        let roleIdList = [];
        let lockStatus = this.dynamicValidateFormPut.lockStatus
        this.dynamicValidateFormPut.roleNameList.forEach((role) =>{
          roleIdList.push(role.split(',')[0]);
          roleNameList.push(role.split(',')[1]);
        })
        let format = {
          roleId : roleIdList.join(','),
          manageName : roleNameList.join(','),
          lockStatus: lockStatus,
          lockUserId: sessionStorage.getItem("userId"),
          recUserId: sessionStorage.getItem("userId")
        }
        let url = '/v1/agency/agencyuser/up/' + this.sequrenceNbr
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_AGENCY
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
          }else{
            alert("个人信息编辑出现错误："+res.message)
            return
          }
        })
      },
      postSubmitApi(){
        let agencyName = sessionStorage.getItem('agencyName');
        let agencyCode = sessionStorage.getItem('agencyCode');
        let userName = this.dynamicValidateForm.userName;
        let phone1 = this.dynamicValidateForm.phone1;
        let lockStatus = this.dynamicValidateForm.lockStatus;
        let roleNameList = [];
        let roleIdList = [];
        this.dynamicValidateForm.roleNameList.forEach((role) =>{
          roleIdList.push(role.split(',')[0]);
          roleNameList.push(role.split(',')[1]);
        })

        let format = {
          userName :userName,
          phone1 :phone1,
          lockStatus: lockStatus,
          agencyName: agencyName,
          agencyCode: agencyCode,
          roleId : roleIdList.join(','),
          manageName : roleNameList.join(','),
          createUserId: sessionStorage.getItem("userId"),
          recUserId: sessionStorage.getItem("userId")
        }
        let url = '/v1/agency/agencyuser/create'
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_AGENCY
          }
        }

        ApiPost(postData, URL_POST).then((res) => {
          if (res.status === 200){
            this.dynamicValidateForm.lockStatus='UNLOCK'
            this.resetForm('dynamicValidateForm')
            this._getPersonLists()
          }else if (res.status !== 401){
            alert(res.message)
            return
          }
        })
      },

      _getPersonLists() {//获取人员信息 分页信息列表 mobile/lockStatus
        let agencyCode = sessionStorage.getItem('agencyCode');
        let url = "/v1/agency/agencyuser/user/page?current="+ (this.current-1) + "&size=" + this.size + "&phone1=" + this.searchMobile +
          "&lockStatus=" + this.searchLocalStatus + "&userName=" + this.searchUserName+"&agencyCode=" + agencyCode
        let getData = {
          url: encodeURI(url),
          value: TIKA_AGENCY
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200){
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current = res.result.current;
            var i = 1
            var temp = {}
            resData.forEach((temp) => {
              if(this.total < this.size){
                temp.num = i
                i++
              }else{
                temp.num = current * this.size + i
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
          }else if (res.status !== 401){
            alert(res.message);
            return
          }
        })
      },
      _mesLists(resDatas, pages, current){
        this.tableData = resDatas
        this.pages = pages
        this.current = current + 1;
      },
      handleSizeChange(val) {
        this.size= val
        this._getPersonLists()
      },
      handleCurrentChange(val) {
        this.current=val;
        this._getPersonLists()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.showNo = false
      },
      tableClick(row){
        this.postOrPut = 'put'
        this.rowTemp = row
        this.lockStatus = row.lockStatus
        this.sequrenceNbr = row.sequenceNbr
        this.userId = row.userId
        let getData = {
          url: "/v1/agency/agencyuser/selectAgency/"+ this.sequrenceNbr,
          value: TIKA_AGENCY
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            var resTemp = res.result
            this.dynamicValidateFormPut.userName = resTemp.userName
            this.dynamicValidateFormPut.phone1 = resTemp.phone1
            this.dynamicValidateFormPut.extend1 = resTemp.extend1
            this.dynamicValidateFormPut.lockStatus = resTemp.lockStatus
            this.dynamicValidateFormPut.createTime = resTemp.createTime
            let roleIdArray = resTemp.roleId.split(',')
            let manageNameArray = resTemp.manageName.split(',')
            let endArray=[]
            roleIdArray.forEach((res,index)=>{
              endArray.push(res+','+manageNameArray[index])
            })
            this.dynamicValidateFormPut.roleNameList = endArray;
            if(!this.showNo){
              this.showNo = true
            }
          }else {
            alert(res.message)
            return
          }
        })
      },
      _getRoleLists(){
        let agencyCode = sessionStorage.getItem('agencyCode')
//        let agencyCode = '6101001000'
        let getData = {
          url: "/v1/privilege/role/agency/role?agencyCode="+agencyCode,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.sequenceNbr + ',' + item.roleName
              temp.label = item.roleName
              this.options5.push(temp)
            })
          }else if (res.status !== 401){
            alert(res.message);
            return;
          }
        })
      }
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
  .table-style .block{
    margin-top: 10px;
    margin-left: 20%
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

  .content-text .table-style .search .top-line .el-select .el-input{
    width:90%;
  }

</style>

