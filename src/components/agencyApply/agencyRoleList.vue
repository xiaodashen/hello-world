<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="roleName" @blur="loseBlur" placeholder="角色名称关键字"></el-input>
          <el-select v-model="lockStatus" @change="changeLockStatus" placeholder="选择生效状态">
            <el-option
              v-for="item in LOCK_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 560px" icon="plus" @click="addRoleInfo">新建角色</el-button>
        </div>
      </div>
      <el-table
        :data="allRoleNameData"
        highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="备注信息">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column  prop="num"  label="序号" width="120px"></el-table-column>
        <el-table-column  prop="roleName"  label="角色名称"></el-table-column>
        <el-table-column  prop="lockStatus"  label="生效状态"></el-table-column>
        <el-table-column  prop="createTime" label="创建日期"></el-table-column>
        <el-table-column  prop="createUserId" label="创建人"></el-table-column>
        <!--<el-table-column  prop="description" label="备注信息"></el-table-column>-->
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
        label-width="90px"
        class="demo-dynamic"
        :rules="rules2">
        <el-form-item
          prop="roleName"
          label="角色名称:">
          <el-input v-model="dynamicValidateForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="lockStatus" label="生效状态:">
          <el-select v-model="dynamicValidateForm.lockStatus" placeholder="请选当前状态">
            <el-option
              v-for="item in LOCK_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="extend1" label="应用场景:">
          <el-select v-model="dynamicValidateForm.extend1" placeholder="请选应用场景">
            <el-option
              v-for="item in APPLY_SENCE"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="3" v-model="dynamicValidateForm.description"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT,TIKA_AGENCY,TIKA_RBAC} from 'api/config'
  export default {
    data() {
      return {
        roleName: '',
        lockStatus: '',
        LOCK_STATUSS: [{
          value: 'UNLOCK',
          label: '生效'
        }, {
          value: 'LOCK',
          label: '禁用'
        }],
        allRoleNameData:[],
        showNo:false,
        APPLY_SENCE:[{
          value: '0',
          label: '机构角色'
        }, {
          value: '1',
          label: '平台角色'
        },{
          value: '2',
          label: 'APP角色'
        }],
        dynamicValidateForm:{
          roleName:'',
          lockStatus:'',
          extend1:'0',
          description:''
        },
        current: 1,
        size: 10,
        total:0,
        dynamicValidateFormRef:{
          roleName:'',
          lockStatus:'',
          extend1:''
        },
        rules2:{
          roleName:[{required: true, message: '角色名称不能为空',trigger: 'blur'}],
          lockStatus:[{required: true, message: '生效状态不能为空',trigger: 'blur'}],
          extend1:[{required: true, message: '应用场景不能为空',trigger: 'blur'}],
        }
      }
    },
    mounted() {
      this._getAllRoleList()
    },
    methods: {
      //获取平台创建的所有角色名称
      _getAllRoleList(){
        let url = "/v1/privilege/role/queryAgencyRolePage?current="+(this.current-1)+'&size='+this.size+
          '&roleName='+this.roleName+'&lockStatus='+this.lockStatus
        let getData = {
          url:encodeURI(url),
          value:TIKA_RBAC
        }
        ApiGet(getData,URL_GET).then(res=>{
          if (res.status === 200){
            let tableData = res.result.records;
            this.pages = res.result.pages
            let current = res.result.current;
            var i = 1;
            tableData.forEach(item=>{
              if (item.lockStatus === 'UNLOCK'){
                item.lockStatus = "生效"
              }else {
                item.lockStatus = "禁用"
              }
              if(this.total < this.size){
                item.num = i
                i++
              }else{
                item.num = current * this.size + i
                i++
              }
            })
            this.allRoleNameData = tableData;
            this.current =  current + 1
          }else if (res.status !== 401){
            alert('获取所有角色名称出错:'+res.message)
          }
        })
      },
      loseBlur(){
        this._getAllRoleList();
      },
      changeLockStatus(){
        this._getAllRoleList();
      },
      addRoleInfo(){
        this.showNo = true;
      },
      onSubmit(){
        this.$refs.dynamicValidateFormRef.validate(valid=>{
          if (valid){
            let roleName = this.dynamicValidateForm.roleName;
            let lockStatus = this.dynamicValidateForm.lockStatus;
            let extend1 = this.dynamicValidateForm.extend1;
            let description = this.dynamicValidateForm.description;
            let format = {
              roleName : roleName,
              lockStatus : lockStatus,
              extend1 : extend1,
              description : description,
              createUserId : sessionStorage.getItem('userId')
            }
            let url = '/v1/privilege/role/addnewrole'
            let postData = {
              url : url,
              data : {
                format : format,
                value: TIKA_RBAC
              }
            }
            ApiPost(postData,URL_POST).then(res=>{
              if (res.status === 200){
                this._getAllRoleList()
                this.resetForm()
              }else if (res.status !== 401){
                alert('新建角色出现错误:'+res.message)
                return;
              }
            })
          }else {
            return false;
          }
        })
      },
      resetForm(){
        this.showNo = false;
        this.$refs.dynamicValidateFormRef.resetFields()
      },
      handleSizeChange(val) {
        this.size= val
        this._getAllRoleList()
      },
      handleCurrentChange(val) {
        this.current=val;
        this._getAllRoleList()
      }
    }
  }
</script>

<style>
  .el-form-item{
    margin-bottom: 25px
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
    width:99%;
  }

</style>
