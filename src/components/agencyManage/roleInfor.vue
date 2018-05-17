<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="roleName" @blur="loseBlur" placeholder="角色名称关键字"></el-input>
          <el-select v-model="lockStatus" @change="changeLockStatus" placeholder="选择生效状态">
            <el-option
              v-for="item in LOCK_STATUS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-table
        :data="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号"></el-table-column>
        <el-table-column  prop="roleName"  label="角色名称"></el-table-column>
        <el-table-column  prop="lockStatus"  label="生效状态"></el-table-column>
        <el-table-column  prop="createTime" label="维护时间"></el-table-column>
      </el-table>
    </div>
    <div class="formRight" v-show="showNo">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateFormRef"
        label-width="90px"
        class="demo-dynamic"
        :rules="dynamicValidateFormRules">
        <el-form-item prop="roleName" label="角色名称:">
          <el-input v-model="dynamicValidateForm.roleName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="lockStatus" label="生效状态:">
          <el-select v-model="dynamicValidateForm.lockStatus" placeholder="请选当前状态">
            <el-option
              v-for="item in LOCK_STATUS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限列表:"
                      prop="selectedMenuData"
                      :rules="[{required: true, message: '权限列表不能为空', trigger: 'blur'}]">
          <el-tree
            ref="menuTreeRef"
            :data="dynamicValidateForm.menuTreeData"
            show-checkbox
            node-key="sequenceNbr"
            :props="menuDefaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="资源列表:"
                      prop="selectedResourceData"
                      :rules="[{required: true, message: '资源列表不能为空', trigger: 'blur'}]">
          <el-tree
            ref="resourceTreeRef"
            :data="dynamicValidateForm.resourceTreeData"
            show-checkbox
            node-key="sequenceNbr"
            :props="resourceDefaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item
          prop="description"
          label="备注信息:">
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
  import { URL_GET, URL_POST, URL_PUT,TIKA_RBAC,TIKA_SYSTEM} from 'api/config'
  export default {
    data() {
      return {
        roleName:'',
        lockStatus:'',
        showNo: false,
        tableData: [],
        dataList:{},
        dynamicValidateForm: {
          roleName:'',
          lockStatus:'UNLOCK',
          menuTreeData:[],
          selectedMenuData:'',
          selectedResourceData:'',
          resourceTreeData:[],
          description:''
        },
        LOCK_STATUS: [
          {
            value: 'UNLOCK',
            label: '生效'
          },
          {
            value: 'LOCK',
            label: '禁用'
          }
        ],
        menuDefaultProps:{
          label:'menuTitle',
          children:'children'
        },
        resourceDefaultProps:{
          label:'industryName',
          children:'child'
        },
        dynamicValidateFormRef: {
          lockStatus:''
        },
        dynamicValidateFormRules:{
          lockStatus:[{required: true, message: '角色名称不能为空',trigger: 'blur'}]
        },
        sequenceNbr:''
      }
    },
    mounted() {
      this.agencyCode = sessionStorage.getItem('agencyCode')
      this.$nextTick(function(){
        this._getAgencyRoleList();
        this._getMenuLists();
        this._getResourceLists();
      })
    },
    methods: {
      //获取该机构已分配角色列表
      _getAgencyRoleList(){
        let agencyCode = sessionStorage.getItem('agencyCode')
        let url = "/v1/privilege/role/selectByAgencyRoles?agencyCode="+agencyCode+"&roleName="+this.roleName+
          "&lockStatus="+this.lockStatus
        let getData = {
          url:encodeURI(url),
          value:TIKA_RBAC
        }
        ApiGet(getData,URL_GET).then(res=>{
          if (res.status === 200){
            let resData =res.result;
            var i = 1;
            resData.forEach(item=>{
              if (item.lockStatus === 'UNLOCK'){
                item.lockStatus = "生效"
              }else {
                item.lockStatus = "禁用"
              }
              item.num = i;
              i++
            })
            this.tableData = resData;
          }else if (res.status !== 401){
            alert('获取机构角色出错:'+res.message)
          }
        })
      },
      // 获取该机构的菜单权限列表
      _getMenuLists(){
        let getData = {
          url: "/v1/privilege/agencymenu/rolemenulist?agencyCode="+this.agencyCode,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.dynamicValidateForm.menuTreeData = res.result;
            console.log(this.dynamicValidateForm.menuTreeData)
          } else if (res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      //获取该机构的资源权限列表
      _getResourceLists(){
        let getData = {
          url: "/v1/privilege/resource/agencyresourcearray?agencyCode="+this.agencyCode,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            let result = res.result;
            let getData1 = {
              url: "/v1/systemctl/treeIndustryInfo/rolemenulist?agencyCode="+this.agencyCode+'&menuSequenceNbr='+result,
              value: TIKA_SYSTEM
            }
            ApiGet(getData1, URL_GET).then((res)=>{
              if(res.status === 200){
                if (res.result.length === 0){
                  alert('该角色没有数据资源权限');
                } else {
                  this.dynamicValidateForm.resourceTreeData = res.result;
                  console.log(this.dynamicValidateForm.resourceTreeData)
                }
              } else if (res.status !== 401){
                alert(res.message)
                return
              }
            })
          } else if (res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      //获取单个角色详细信息
      tableClick(row){
        let agencyCode = sessionStorage.getItem('agencyCode')
        this.$refs.dynamicValidateFormRef.resetFields()
        this.showNo = true;
        this.sequenceNbr = row.sequenceNbr
        this.dynamicValidateForm.roleName = row.roleName;
        if (row.lockStatus === "生效"){
          this.dynamicValidateForm.lockStatus = 'UNLOCK'
        }else {
          this.dynamicValidateForm.lockStatus = 'LOCK'
        }
        this.dynamicValidateForm .description = row.description;
        let getData = {
          url:"/v1/privilege/role/roleResourceMenu?agencyCode="+agencyCode+"&roleSequenceNbr="+this.sequenceNbr,
          value:TIKA_RBAC
        }
        ApiGet(getData,URL_GET).then(res=>{
          if (res.status === 200){
            //菜单权限以及资源权限的回填
            this.dataList = res.result
            console.log(res.result)
            if (this.dataList.menuList.length > 0){
              this.$refs.menuTreeRef.setCheckedKeys(this.dataList.menuList)
            }else {
              this.$refs.menuTreeRef.setCheckedKeys([])
            }
            if (this.dataList.resourceList.length > 0){
              this.$refs.resourceTreeRef.setCheckedKeys(this.dataList.resourceList)
            }else {
              this.$refs.resourceTreeRef.setCheckedKeys([])
            }
          }else if (res.status !== 401){
            alert("查询单个角色信息出现错误:"+res.message)
            return;
          }
        })
      },
      //表单提交
      onSubmit(){
        this.dynamicValidateForm.selectedMenuData = this.$refs.menuTreeRef.getCheckedKeys().join(',');
        this.dynamicValidateForm.selectedResourceData = this.$refs.resourceTreeRef.getCheckedKeys().join(',');
        this.$refs.dynamicValidateFormRef.validate(valid=>{
          if (valid){
            let roleName = this.dynamicValidateForm.roleName;
            let lockStatus = this.dynamicValidateForm.lockStatus;
            let menuSequenceNbr = this.dynamicValidateForm.selectedMenuData;
            let resourceSequenceNbr = this.dynamicValidateForm.selectedResourceData;
            let description = this.dynamicValidateForm.description
            let format = {
              agencyCode:sessionStorage.getItem('agencyCode'),
              roleName : roleName,
              lockStatus : lockStatus,
              menuSequenceNbr : menuSequenceNbr,
              resourceSequenceNbr : resourceSequenceNbr,
              description : description,
              createUserId:sessionStorage.getItem("userId")
            }
            let url = "/v1/privilege/rolemenu/roleAuthMaintenance/"+this.sequenceNbr
            let putData = {
              url : url,
              data : {
                format : format,
                value : TIKA_RBAC
              }
            }
            ApiPost(putData,URL_PUT).then(res=>{
              if (res.status === 200){
                this.resetForm();
                this._getAgencyRoleList()
              }else if (res.status !== 401){
                alert('机构角色分配权限错误:'+res.message)
                return;
              }
            })
          }
        })
      },
      //取消表单
      resetForm(){
        this.$refs.dynamicValidateFormRef.resetFields();
        this.showNo = false;
      },
      loseBlur(){
        this._getAgencyRoleList();
      },
      changeLockStatus(){
        this._getAgencyRoleList();
      }
    }
  }
</script>

<style>
  .table-style .search .top-line .el-select .el-input{
    width:100%;
  }
  .table-style .search .el-button--primary{
    float: right;
    margin-right: 80px;
  }

</style>
