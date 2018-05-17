<template>
  <div class="table-style">
    <div class="search">
      <div class="top-line">
        <el-select v-model="agencyName"
                   placeholder="机构名称"
                   filterable
                   remote
                   @change="valueChange"
                   :remote-method="remoteMethod"
                   :loading="loading">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="agencyCode" placeholder="机构代码" disabled="disabled"></el-input>
      </div>
    </div>
    <div class="manageClass">
      <span>管理员列表</span>
      <!--<el-button type="primary" icon="plus" style="float: right;margin-right: 600px" @click="addMangerInfo">添加管理员</el-button>-->
      <el-button type="primary" icon="plus" style="float: right;margin-right: 600px" @click="addMangerInfo">添加管理员</el-button>
      <el-dialog :visible.sync="dialogVisible">
        <el-form
          :inline="true"
          class="demo-form-inline"
          :model="dialogData"
          ref="dialogDataRef"
          label-width="90px"
          :rules="rules2">
          <el-form-item prop="manageName"
                        label="管理名称:"
                        :rules="[{required: true, message: '管理名称不能为空', trigger: 'blur'}]">
            <el-input v-model="dialogData.manageName" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="生效状态:">
            <el-select v-model="dialogData.lockStatus" placeholder="选择生效状态"  style="width:192px">
              <el-option
                v-for="item in REC_STATUSS"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item prop="userName"
                        label="管理姓名:"
                        :rules="[{required: true, message: '管理姓名不能为空', trigger: 'blur'}]">
            <el-input v-model="dialogData.userName"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="管理账号:">
            <el-input v-model="dialogData.mobile"></el-input>
          </el-form-item>
        </el-form>

        <div style="text-align: center;margin-top: 40px">
                 <span slot="footer" class="dialog-footer">
                  <el-button @click="reset">取 消</el-button>
                  <el-button type="primary" @click="submit">确 定</el-button>
                 </span>
        </div>
      </el-dialog>
    </div>
    <el-table :data="tableData">
      <el-table-column label="管理姓名" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.manageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.phone1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效状态" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.lockStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-switch
            v-model="lockOrUnlock[scope.$index]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="lockStatusChange(scope.$index,scope.row)">
          </el-switch>
        </template>
      </el-table-column>

    </el-table>
    <div class="block" v-show="tableData.length > 0">
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
</template>


<script>
  import { ApiGet,ApiPost} from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, URL_DEL, TIKA_AGENCY,TIKA_RBAC} from 'api/config'
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
        manageNameKey:'',
        agencyName : '',
        agencyCode : '',
        current: 1,
        size: 10,
        total:0,
        dialogData:{
          manageName:'',
          lockStatus:'UNLOCK',
          userName:'',
          mobile:''
        },
        lockStatus:'',
        lockOrUnlock:[],
        tableData:[],
        options4: [],
        list: [],
        loading: false,
        dialogVisible: false,
        REC_STATUSS: [{
          value: 'UNLOCK',
          label: '生效'
        }, {
          value: 'LOCK',
          label: '禁用'
        }],
        dialogDataRef: {
          mobile: ''
        },
        rules2:{
          mobile:[{required: true, message: '管理账号不能为空',trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.$nextTick(function(){
        this._getAgencyLists();
//        this._getManagerLists();
      })
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

      _getAgencyLists(){
        let getData = {
          url: "/v1/agency/agencyinfo/selectAllAgencyInfo",
          value: TIKA_AGENCY
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.agencyData = [];
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.agencyCode +','+item.agencyName;
              temp.label = item.agencyName;
              this.agencyData.push(temp)
            })
            this.list = this.agencyData.map(item => {
              return { value: item.value, label: item.label };
            })
          } else {
            alert(res.message)
            return
          }
        })
      },
      _getManagerLists(){
        let getData = {
          url : "/v1/agency/agencyuser/admin/page?recStatus=ACTIVE&current="+ (this.current-1) + "&size=" + this.size + "&agencyCode=" + this.agencyCode,
          value: TIKA_AGENCY
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            let resDataTemp = [];
            let resData = res.result.records;
            this.total = res.result.total;
            let pages = res.result.pages;
            let current = res.result.current
            var i = 1;
            resData.forEach((temp,index)=>{
              if (temp.lockStatus === 'LOCK'){
                this.lockOrUnlock[index] = false;
                temp.lockStatus = '禁用';
              }else{
                this.lockOrUnlock[index] = true;
                temp.lockStatus = '生效';
              }
              resDataTemp.push(temp)
            })
            this._mesLists(resDataTemp, pages, current)
          } else if (res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      _mesLists(resDatas, pages, current){
        this.tableData = resDatas
        this.pages = pages
        this.current = current + 1;
      },
      valueChange(value){
        this.agencyCode = value.split(',')[0];
        this._getManagerLists();
      },
      //新建管理员
      addMangerInfo(){
        if (this.agencyCode !== ''){
          if (this.tableData.length === 0){
            this.dialogVisible = true
            this.$nextTick(function(){
              this.$refs.dialogDataRef.resetFields()
            })
            this._getManageName();
            // this._getMenuLists();
          } else {
            alert('该机构已存在管理员')
            return;
          }
        }else {
          alert('请选择机构')
          return;
        }
      },
      //获取机构管理员管理名称
      _getManageName() {
        let getData = {
          url:"/v1/privilege/platform/adminRole",
          value: TIKA_RBAC,
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.dialogData.manageName = res.result.roleName;
            this.manageNameKey = res.result.sequenceNbr
          } else {
            alert(res.message)
            return
          }
        })
      },
      handleSizeChange(val) {
        this.size= val
        this._getManagerLists()
      },
      handleCurrentChange(val) {
        this.current=val;
        this._getManagerLists()
      },
      //获取页面权限数据
//      _getMenuLists(){
//        let getData = {
//          url: "/v1/privilege/agencymenu/rolemenulist?agencyCode="+this.agencyCode,
//          value: TIKA_RBAC
//        }
//        ApiGet(getData, URL_GET).then((res)=>{
//          if(res.status === 200){
//            this.menuTreeData = res.result;
//          } else if (res.status !== 401){
//            alert(res.message)
//            return
//          }
//        })
//      },
      //新增机构管理员，先调小黄提供的接口，再调陈飞提供的接口
      submit(){
        this.$refs.dialogDataRef.validate((valid) => {
          if (valid) {
            let manageName= this.dialogData.manageName
            let lockStatus = this.dialogData.lockStatus
            let userName = this.dialogData.userName
            let phone1 = this.dialogData.mobile
//            let menuDatas = this.$refs.menuTreeRef.getCheckedKeys().join(',')

            let format = {//参数：管理名称，状态，管理姓名，账号，管理名称ID，机构代码，机构名称，创建者
              manageName:manageName,
              lockStatus:lockStatus,
              userName:userName,
              phone1:phone1,
              roleId:this.manageNameKey,
              agencyCode:this.agencyCode,
              agencyName:this.agencyName.split(',')[1],
              createUserId:sessionStorage.getItem('userId'),
              recUserId:sessionStorage.getItem('userId')
            }
            let url = '/v1/agency/agencyuser/create'
            let postData = {
              url: url,
              data: {
                format: format,
                value: TIKA_AGENCY
              }
            }
            ApiPost(postData, URL_POST).then((res)=>{
              if (res.status === 200){
                this._getManagerLists('true')
                this.reset()
              }else if(res.status !== 401){
                alert("新增管理员出现错误："+res.message)
                return
              }
            })
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      reset(){
        this.$refs.dialogDataRef.resetFields()
        this.dialogVisible = false
      },
      //管理员生效/禁用状态切换
      lockStatusChange(index,row){
        let url="/v1/agency/agencyuser/up/"+row.sequenceNbr;
        if (this.lockOrUnlock[index]){
          this.lockStatus = 'UNLOCK'
        }else{
          this.lockStatus = 'LOCK'
        }
        let format = {
          lockStatus:this.lockStatus,
          recUserId:sessionStorage.getItem('userId'),
          lockUserId:sessionStorage.getItem('userId')
        }
        let getData = {
          url: url,
          data :{
            format:format,
            value: TIKA_AGENCY
          }
        }
        ApiPost(getData, URL_PUT).then((res)=>{
          if(res.status === 200){
            this._getManagerLists('true');
          } else if (res.status !== 401){
            alert(res.message)
            return
          }
        })
      },

    }
  }
</script>

<style>

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
  .manageClass{
    font-size: 18px;
    margin-left: 20px
  }
  .manageClass .el-button{
    width: 121px;
    height: 36px;
  }

</style>

