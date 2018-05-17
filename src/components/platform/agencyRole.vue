<template>

  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-select
            v-model="agencyName"
            filterable
            remote
            placeholder="机构名称"
            @change="valueChange"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in allRoleNames"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="agencyCode" placeholder="机构代码" disabled="disabled"></el-input>
        </div>
      </div>
      <div style="font-size: 18px;margin-left: 20px">
        <span>角色列表</span>
        <el-button type="primary" icon="plus" style="float: right;margin-right: 65%" @click="addRoleInfo">添加角色</el-button>
        <el-dialog :visible.sync="dialogVisible" title="角色列表" style="font-size: 38px">

          <el-checkbox-group
            @change="selectedChange"
            v-model="selectedData"
            :max="7">
            <el-checkbox v-for="item in allRoleNameData" :label="item.value" :key="item.value" :disabled="item.disabled">{{item.label}}</el-checkbox>
          </el-checkbox-group>
          <div style="margin-top: 20px;text-align: center">
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="reset">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table :data="tableData" style="width: 40%">
        <el-table-column label="序号" width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, URL_DEL,TIKA_AGENCY, TIKA_RBAC} from 'api/config'
  export default {
    data() {
      return {
        agencyName:'',
        agencyCode:'',
        dialogVisible:false,
        allRoleNames: [],//搜索到的所有机构名称
        list: [],//所有机构名称
        loading: false,//是否正在从远程获取数据
        tableData:[],
        tableDataTemp:[],
        selectedData:[],
        allRoleNameData:[]
      }
    },
    mounted() {
      this._getAgencyLists();//获取所有机构
      this._getAllRoleNames();//获取平台所有角色列表
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.allRoleNames = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.allRoleNames = [];
        }
      },
      //获取所有机构
      _getAgencyLists(){
        let getData = {
          url: "/v1/agency/agencyinfo/selectAllAgencyInfo",
          value: TIKA_AGENCY
        }
        ApiGet(getData,URL_GET).then(res =>{
          if (res.status === 200){
            this.agencyData = [];
            res.result.forEach(item=>{
              let temp = {};
              temp.value = item.agencyCode +','+ item.agencyName;
              temp.label = item.agencyName;
              this.agencyData.push(temp)
            })
            this.list = this.agencyData.map(item => {
              return { value: item.value, label: item.label };
            })
          }else if (res.status !== 401){
            alert('获取所有机构出现错误：'+res.message)
            return;
          }
        })
      },
      valueChange(value){
        this.agencyCode = value.split(',')[0]
        this._getAgencyRoleList()
      },
      //获取平台创建的所有角色名称
      _getAllRoleNames(){
        let getData = {
          url:"/v1/privilege/role/roleagencylist",
          value:TIKA_RBAC
        }
        ApiGet(getData,URL_GET).then(res=>{
          if (res.status === 200){
            res.result.forEach(item=>{
              let temp={};
              temp.value = item.sequenceNbr+ ','+ item.roleName;
              temp.label = item.roleName;
              temp.disabled = false
              this.allRoleNameData.push(temp)
            })
            console.log(this.allRoleNameData)
          }else if (res.status !== 401){
            alert('获取所有角色名称出错:'+res.message)
          }
        })
      },
      //获取机构已存在的角色
      _getAgencyRoleList(){
        let getData = {
          url:"/v1/privilege/role/selectByAgencyRoles?agencyCode="+this.agencyCode,
          value:TIKA_RBAC
        }
        ApiGet(getData,URL_GET).then(res=>{
          if (res.status === 200){
            let resTemp = res.result;
            var i = 1;
            resTemp.forEach(item=>{
              item.num =i ;
              i++
            })
            this.tableData =resTemp;
          }else if (res.status !== 401){
            alert('获取机构角色出错:'+res.message)
          }
        })
      },
      addRoleInfo(){
        if (this.agencyCode !== ''){
          this.dialogVisible = true;
          if (this.tableData.length > 0) {
            this.tableDataTemp = [];
            this.tableData.forEach(item => {
              let temp = item.sequenceNbr+','+item.roleName
              this.tableDataTemp.push(temp)
            })
            this.selectedData = this.tableDataTemp
            console.log(this.selectedData)
            this.allRoleNameData.forEach(item=>{
              if (this.selectedData.indexOf(item.value) > -1){
                item.disabled = true
              }
            })
            console.log(this.allRoleNameData)
          }
        }else {
          alert('请选择机构');
          return;
        }
      },
      selectedChange(value){
        this.selectedData = value
      },
      submit(){
        this.tableDataTemp.forEach(item=>{
          let index = this.selectedData.indexOf(item)
          this.selectedData.splice(index,1)
        })
        let url = '/v1/privilege/role/createagencyrole '
        let roleId = [];
        let roleName = [];
        this.selectedData.forEach(item=>{
          roleId.push(item.split(',')[0]);
          roleName.push(item.split(',')[1]);
        })
        let format = {
          roleId:roleId.join(','),
          roleName:roleName.join(','),
          createUserId:sessionStorage.getItem('userId'),
          agencyCode : this.agencyCode
        }
        let postData = {
          url:url,
          data:{
            format : format,
            value : TIKA_RBAC
          }
        }
        ApiPost(postData,URL_POST).then(res=>{
          if (res.status === 200){
            this.dialogVisible = false;
            this._getAgencyRoleList();
          }else if (res.status !== 401){
            alert('给机构分配角色出现错误:'+res.message);
          }
        })
      },
      reset(){
        this.dialogVisible = false;
      }
    }
  }
</script>

<style>
  .table-style .search .top-line .el-select .el-input{
    width:99%;
  }

   .el-dialog.el-dialog--small{
    width: 20%;
    left: 50%;
  }
  .el-dialog__title{
    font-size: 22px;
  }
  .el-dialog__body .el-checkbox-group .el-checkbox{
    display: block;
    margin-bottom: 15px;
  }
  .el-dialog__body .el-checkbox-group .el-checkbox .el-checkbox__label{
    margin-left: 30px;
  }
  .el-dialog__body .el-checkbox-group .el-checkbox:nth-child(1){
    margin-left: 15px;
  }

</style>

