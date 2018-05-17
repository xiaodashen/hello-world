<template>

    <div class="content-right">
      <div class="content-text">
        <div class="table-style">
          <div class="search">
            <div class="top-line">
              <el-input v-model="agencyName" @blur="loseBlur" placeholder="机构名称"></el-input>
            </div>
          </div>
          <el-table
            :data="tableData"
            v-if="tableData"
            highlight-current-row
            @row-dblclick="tableClick">
            <el-table-column  prop="num"  label="序号" width="80px"></el-table-column>
            <el-table-column  prop="agencyName"  label="机构名称"></el-table-column>
            <el-table-column  prop="domainName"  label="机构域名"></el-table-column>
            <el-table-column  prop="agencyCode"  label="机构代码"></el-table-column>
            <el-table-column  prop="industry" label="从事行业"></el-table-column>
            <el-table-column  prop="phone1" label="联系人电话"></el-table-column>
            <el-table-column  prop="sourceFrom" label="申请来源"></el-table-column>
            <el-table-column  prop="recDate" label="提交日期"></el-table-column>
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
            class="demo-dynamic">
            <el-form-item
              prop="agencyName"
              label="机构名称:">
              <el-input v-model="dynamicValidateForm.agencyName" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="agencyCode" label="机构代码:">
              <el-input v-model="dynamicValidateForm.agencyCode" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="domainName" label="机构域名:">
              <el-input v-model="dynamicValidateForm.domainName" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="agencyAddress" label="机构地址:">
              <el-input v-model="dynamicValidateForm.agencyAddress" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="banner" label="机构工商码:">
              <el-input v-model="dynamicValidateForm.banner" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="image" label="机构LOGO:">
              <img :src="dynamicValidateForm.image" width="160" height="160"/>
            </el-form-item>
            <el-form-item  prop="agencyTel" label="负责人TEL:">
              <el-input v-model="dynamicValidateForm.agencyTel" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="sourceFrom" label="申请来源:">
              <el-input v-model="dynamicValidateForm.sourceFrom" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="recDate" label="提交日期:">
              <el-input v-model="dynamicValidateForm.recDate" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="description" label="备注信息:">
              <el-input type="textarea" v-model="dynamicValidateForm.description" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetForm">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_AGENCY } from 'api/config'
  export default {
    data() {
      return {
        agencyName:'',
        tableData: [],
        dynamicValidateForm: {
          agencyName: '',
          domainName: '',
          agencyAddress:'',
          agencyCode: '',
          businessCode:'',
          image:'',
          agencyTel: '',
          sourceFrom: '',
          recDate: '',
          description: '',
          banner: ''
        },
        showNo: false,
        current: 1,
        size: 10,
        total:0,
        userId: '',
        rowTemp: '',
        searchAgencyName: '',
      }
    },
    mounted() {
      this._getAngencyMessages()
    },
    methods: {
      loseBlur(){
        this.searchAgencyName = this.agencyName;
        this._getAngencyMessages()
      },

      _getAngencyMessages() {//获取已审核机构信息 分页信息列表
        let url = "/v1/agency/agencyinfo/page/auditing?auditing=ACTIVE&current="+ this.current + "&size=" + this.size + "&agencyName=" + this.searchAgencyName
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
            let current = res.result.current
            var i = 1
            var temp = {}
            resData.forEach((temp) => {
              temp.agencyArea = temp.province + temp.city;
              if(this.total < this.size){
                temp.num = i
                i++
              }else{
                temp.num = (current-1)*this.size + i
                i++
              }
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
        this._getAngencyMessages()
      },
      handleCurrentChange(val) {
        this.current=val
        this._getAngencyMessages()
      },
      resetForm() {
        this.showNo = false
      },
      tableClick(row){
        if(!this.showNo){
          this.showNo = true
        }
        this.dynamicValidateForm.agencyName = row.agencyName;
        this.dynamicValidateForm.agencyCode = row.agencyCode;
        this.dynamicValidateForm.agencyAddress = row.province;
        this.dynamicValidateForm.businessCode = row.businessCode;
        this.dynamicValidateForm.image = row.avatar;
        this.dynamicValidateForm.banner = row.banner;
        this.dynamicValidateForm.agencyTel = row.phone1;
        this.dynamicValidateForm.sourceFrom = row.sourceFrom;
        this.dynamicValidateForm.recDate = row.recDate;
        this.dynamicValidateForm.description = row.description;
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

