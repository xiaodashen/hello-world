<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="parentName" @blur="loseBlur" placeholder="资讯大类名称" ></el-input>
          <el-input v-model="typeName" @blur="loseBlur" placeholder="资讯小类名称"></el-input>
          <!--<el-input v-model="agencyName" @blur="loseBlur"placeholder="机构名称"></el-input>-->
          <!--<el-select v-model="agencyName"-->
                     <!--placeholder="机构名称"-->
                     <!--filterable-->
                     <!--remote-->
                     <!--@change="valueChange"-->
                     <!--:remote-method="remoteMethod"-->
                     <!--:loading="loading">-->
            <!--<el-option-->
              <!--v-for="item in options4"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-input v-model="createUserName" @blur="loseBlur"placeholder="创建人"></el-input>
          <!--<el-button type="primary" icon="plus" style="msrgin-left: 15px" @click="addCons">新建资讯类别</el-button>-->
        </div>
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号" width="80"></el-table-column>
        <el-table-column  prop="parentName"  label="资讯大类"></el-table-column>
        <el-table-column  prop="typeName"  label="咨讯小类"></el-table-column>
        <el-table-column  prop="agencyName" label="机构名称"></el-table-column>
        <el-table-column  prop="lockStatus" label="生效状态"></el-table-column>
        <el-table-column  prop="createUserName" label="创建人"></el-table-column>
        <el-table-column  prop="createTime" label="创建日期" width="210"></el-table-column>
        <el-table-column  prop="description" label="备注"></el-table-column>
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
      <el-form :model="dynamicValidateForm" ref="dynamicValidateFormRef" label-width="90px" class="demo-dynamic" v-if="post_put === 'post'">
        <el-form-item
          prop="parentId"
          :rules="[
              { required: true, message: '资讯大类不能为空' }
            ]"
          label="资讯大类:">
          <el-select
            v-model="dynamicValidateForm.parentId"
            placeholder="请选择资讯大类"
            v-if="infomationNature !== '静态'"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="dynamicValidateForm.parentName" disabled="disabled"  v-if="infomationNature === '静态'"></el-input>
        </el-form-item>
        <el-form-item
          prop="typeName"
          label="资讯小类:"
          :rules="[
              {required: true, message: '科目名称不能为空'},
              {min:2, max:32, message:'汉字长度2~32个'}
            ]">
          <el-input v-model="dynamicValidateForm.typeName" :disabled="infomationNature === '静态'"></el-input>
        </el-form-item>
        <el-form-item prop="lockStatus" label="生效状态:">
          <el-select v-model="dynamicValidateForm.lockStatus" placeholder="请选择生效状态">
            <el-option
              v-for="item in LOCK_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="agencyName" label="创建机构:">
          <el-input v-model="dynamicValidateForm.agencyName"  disabled="disabled"  ></el-input>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input type="textarea" v-model="dynamicValidateForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('dynamicValidateFormRef')">保存</el-button>
          <el-button @click="resetForm('dynamicValidateFormRef')">取消</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="dynamicValidateFormPut" ref="dynamicValidateFormPutRef" label-width="90px" class="demo-dynamic" v-if="post_put === 'put'">
        <el-form-item
          prop="parentId"
          label="资讯大类:">
          <el-select
            v-model="dynamicValidateFormPut.parentId"
            placeholder="请选择资讯大类"
            v-if="infomationNature !== '静态'"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="dynamicValidateFormPut.parentName" disabled="disabled"  v-if="infomationNature === '静态'"></el-input>
        </el-form-item>
        <el-form-item
          prop="typeName"
          label="资讯小类:">
          <el-input v-model="dynamicValidateFormPut.typeName" :disabled="infomationNature === '静态'"></el-input>
        </el-form-item>
        <el-form-item prop="lockStatus" label="生效状态:">
          <el-select v-model="dynamicValidateFormPut.lockStatus" placeholder="请选择生效状态">
            <el-option
              v-for="item in LOCK_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="agencyName" label="创建机构:">
          <el-input v-model="dynamicValidateFormPut.agencyName"  disabled="disabled"  ></el-input>
        </el-form-item>
        <el-form-item prop="mesNum" label="资讯条数:">
          <el-input v-model="dynamicValidateFormPut.mesNum"  disabled="disabled"  ></el-input>
        </el-form-item>
        <el-form-item prop="recDate" label="最近修改:">
          <el-input v-model="dynamicValidateFormPut.recDate"  disabled="disabled"  ></el-input>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input type="textarea" v-model="dynamicValidateFormPut.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('dynamicValidateFormPutRef')">保存</el-button>
          <el-button @click="resetForm('dynamicValidateFormPutRef')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT,TIKA_NEWS} from 'api/config'
  export default {
    data() {
      return {
        parentName:'',
        typeName:'',
        agencyName:'',
        createUserName:'',
        options4: [],
        list: [],
        loading: false,
        tableData: [],
        dynamicValidateForm: {
          description: '',
          parentId: '',
          parentName: '',
          lockStatus: 'UNLOCK',
          typeName: '',
          agencyName:'',
          createUserName: '',
          mesNum: 0,
          recDate:''
        },
        dynamicValidateFormPut: {
          description: '',
          parentId: '',
          parentName: '',
          lockStatus: 'UNLOCK',
          typeName: '',
          agencyName:'',
          createUserName: '',
          mesNum: 0,
          recDate:''
      },
        options: [],
        LOCK_STATUSS: [{
          value: 'UNLOCK',
          label: '启用'
        }, {
          value: 'LOCK',
          label: '禁用'
        }],
        value: '',
        showNo: false,
        current: 1,
        size: 10,
        total:0,
        post_put: 'post',
        infomationNature: ''
      }
    },
    mounted() {
      this._getmesLists();
//      this._getOptions();//获取动态资讯大类
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
      loseBlur(){
        this._getmesLists();
      },
      valueChange(){
        this._getmesLists();
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.post_put === 'put'){
              this.onSubmitApi()
            } else {
              this.postSubmitApi()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      onSubmitApi() {
        let format = this.dynamicValidateFormPut
        format.createUserId = sessionStorage.getItem('userId')
        format.recUserId = sessionStorage.getItem('userId')
        if(this.infomationNature === '静态'){
          delete format.agencyName
          delete format.createUserName
          delete format.infoTypeDicValue
          delete format.mesNum
          delete format.parentId
          delete format.parentName
          delete format.recDate
          delete format.typeName
        }else{
          delete format.agencyName
          delete format.createUserName
          delete format.infoTypeDicValue
          delete format.mesNum
          delete format.parentName
          delete format.recDate
          this.options.forEach(res=>{
            if(format.parentId === res.value){
              format.parentName = res.label
            }
          })
        }
        if(this.dynamicValidateFormPut.description === ''){
          this.dynamicValidateFormPut.description = ' '
        }
        let url = '/v1/news/staticinfotype/'+this.sequenceNbr
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_NEWS
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200){
            this._getmesLists()
            this.resetForm('dynamicValidateFormPutRef')
          }else{
            alert(res.message)
            return
          }
        })
      },
      postSubmitApi() {
        let format = this.dynamicValidateForm
        format.createUserId = sessionStorage.getItem('userId')
        let url = '/v1/news/staticinfotype';
        this.options.forEach(res=>{
          if(res.value === format.parentId){
            format.parentName = res.label
          }
        })
        delete format.createUserName
        delete format.mesNum
        delete format.recDate
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_NEWS
          }
        }

        ApiPost(postData, URL_POST).then((res) => {
          if(res.status === 200){
            this._getmesLists()
            this.showNo = false
            this.resetForm('dynamicValidateFormRef')
          }else{
            alert(res.message)
            return
          }
        })
      },


      addCons() {//切换显示添加表单
        this.dynamicValidateForm.agencyName = sessionStorage.getItem('agencyName')
        this.infomationNature=''
        this.showNo = true
//        if(this.post_put === 'post'){
//          //console.log(this.showNo)
//          this.showNo = !this.showNo
//        }
        if(this.post_put === 'put'){
          this.resetForm('dynamicValidateFormRef')
          this.post_put = 'post'
        }
      },
      _getmesLists() {//获取静态资讯类型 分页信息列表
        let url =  "/v1/news/staticinfotype/page?current="+ this.current + "&size=" + this.size+'&parentName='+this.parentName+
          '&typeName='+this.typeName+'&createUserName='+ this.createUserName;
        let getData = {
          url: encodeURI(url),
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{

          if(res.status === 200){
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current = res.result.current
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
              if(temp.lockStatus === 'UNLOCK'){
                temp.lockStatus = '启用'
              }else{
                temp.lockStatus = '禁用'
              }
              this.options.forEach((item)=>{
                if(temp.parentId === item.value){
                  temp.parentName = item.label
                }
              })
              resDataTemp.push(temp)

            })
            this._mesLists(resDataTemp, pages, current)
          }else{
            alert('获取资讯类型维护 分页信息列表 出错')
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
        this._getmesLists()
      },
      handleCurrentChange(val) {
        this.current=val
        this._getmesLists()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.showNo = false
      },
      tableClick(row){
        this.infomationNature = row.infomationNature
        this.post_put = 'put'
        this.sequenceNbr = row.sequenceNbr
        let getData = {
          url: "/v1/news/staticinfotype/"+ this.sequenceNbr,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          console.log(res)
          if(res.status === 200){
            var resTemp = res.result[0]
            this.dynamicValidateFormPut.infoTypeDicValue = resTemp.infoTypeDicValue
            this.dynamicValidateFormPut.agencyName = resTemp.agencyName
            this.dynamicValidateFormPut.typeName = resTemp.typeName
            this.dynamicValidateFormPut.lockStatus = resTemp.lockStatus
            this.dynamicValidateFormPut.description = resTemp.description
            this.dynamicValidateFormPut.parentName = resTemp.parentName
            this.dynamicValidateFormPut.recDate = resTemp.recDate
            this.dynamicValidateFormPut.parentId = resTemp.parentId
            if(!this.showNo){
              this.showNo = true
            }
          }
        })
      },
      //获取动态资讯大类
      _getOptions(){
        let getData = {
          url: "/v1/news/staticinfotype/selectAllDynamicInfoType",
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          console.log('res==============')
          console.log(res)
          if(res.status === 200){
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.sequenceNbr
              temp.label = item.typeName
              this.options.push(temp)
            })
          }
        })

      }
    }
  }
</script>

<style>

  .el-form-item{
    margin-bottom: 15px
  }
  .table-style .block{
    margin-top: 10px;
    margin-left: 20%
  }
  .el-table tr.current-row>td {
    background: #409eff
  }
  .content-text .table-style .search .top-line .el-select .el-input{
    width:90%;
  }
  /*.el-table .info-row {*/
  /*background: #c9e5f5;*/
  /*}*/
  /*.el-table .positive-row {*/
  /*background: #e2f0e4;*/
  /*}*/
</style>

