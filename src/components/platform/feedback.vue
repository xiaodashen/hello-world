<template>
  <div class="table-style">
    <div class="search">
      <div class="top-line">
        <el-input @blur="loseBlur"  v-model="agencyName" placeholder="机构名称关键字"></el-input>
      </div>
    </div>
    <div class="manageClass">
      <span>用户反馈信息列表</span>
    </div>
    <el-table
      highlight-current-row
      @row-dblclick="tableClick"
      :data="tableData">
      <el-table-column  prop="num"  label="序号" width="80px"></el-table-column>
      <el-table-column  prop="agencyName"  label="机构名称"></el-table-column>
      <el-table-column  prop="agencyCode"  label="机构代码"></el-table-column>
      <el-table-column  prop="userName"  label="用户名称"></el-table-column>
      <el-table-column  prop="createTime"  label="创建时间"></el-table-column>
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
    <div class="formRight" v-show="formShow">
      <el-form :model="feedback" ref="feedback" label-width="80px" class="demo-dynamic">
        <el-form-item prop="agencyName" label="机构名称:">
          <el-input v-model="feedback.agencyName" disabled></el-input>
        </el-form-item>
        <el-form-item prop="agencyCode" label="机构代码:">
          <el-input v-model="feedback.agencyCode" disabled></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户名称:">
          <el-input v-model="feedback.userName" disabled></el-input>
        </el-form-item>
        <el-form-item prop="createTime" label="创建时间:">
          <el-input v-model="feedback.createTime" disabled></el-input>
        </el-form-item>

        <el-form-item prop="content" label="反馈信息:">
          <el-input
            type="textarea"
            :rows="2"
            disabled
            v-model="feedback.content">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet } from 'api/recommand'
  import { URL_GET, TIKA_AGENCY,TIKA_UPDATA} from 'api/config'
  export default {
    data() {
      return {
        agencyName : '',

        current: 1,
        size: 10,
        total:0,

        tableData:[],
        feedback: {},
        formShow: false,

      }
    },
    mounted() {
      this._getManagerLists()
    },
    methods: {
      _getManagerLists(data){
        let getData = {
          url : "/v1/update/UpdateFeedback/lookfeedback?current="+ this.current + "&size=" + this.size + "&agencyName=" + this.agencyName,
          value: TIKA_UPDATA
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
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
            resData.forEach((temp,index)=>{
              if (this.total < this.size) {
                temp.num = i
                i++
              } else {
                temp.num = (current-1)  * this.size + i
                i++
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
        this.current = current;
      },
      handleSizeChange(val) {
        this.size= val
        this._getManagerLists()
      },
      handleCurrentChange(val) {
        this.current=val;
        this._getManagerLists()
      },
      tableClick(row){
        this.feedback = row
        this.formShow = true
      },
      resetForm(){
        this.formShow = false
      },
      loseBlur(){
        this._getManagerLists();
      }
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

