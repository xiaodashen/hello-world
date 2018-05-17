<template>
  <div class="content-text">
    <div class="table-style">
      <div class="search">
        <div class="top-line">
          <el-input v-model="examName" @blur="loseBlur" placeholder="考试名称" ></el-input>
          <el-input v-model="bigStaticinfoType" @blur="loseBlur" placeholder="指南大类" ></el-input>
          <el-input v-model="smallStaticinfoType" @blur="loseBlur" placeholder="指南小类" ></el-input>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-if="tableData"
        highlight-current-row
        @row-dblclick="tableClick">
        <el-table-column  prop="num"  label="序号" width="80"></el-table-column>
        <el-table-column  prop="examName"  label="考试名称"></el-table-column>
        <el-table-column  prop="bigStaticinfoType"  label="指南大类"></el-table-column>
        <el-table-column  prop="smallStaticinfoType"  label="指南小类"></el-table-column>
        <el-table-column  prop="province" label="省名称"></el-table-column>
        <el-table-column  prop="city" label="市名称"></el-table-column>
        <el-table-column  prop="region" label="区县名称"></el-table-column>
        <el-table-column  prop="examTime" label="考试时间" width="210"></el-table-column>
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
    <div class="formRight" v-show="formShow">
      <el-form :model="staticNewMes" ref="dynamicValidateForm1" label-width="80px" class="demo-dynamic">
        <el-form-item prop="examName" label="考试名称:">
          <el-input v-model="staticNewMes.examName"></el-input>
        </el-form-item>
        <el-form-item prop="bigStaticinfoType" label="资讯大类:">
          <el-input v-model="staticNewMes.bigStaticinfoType" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="smallStaticinfoType" label="资讯小类:">
          <el-input v-model="staticNewMes.smallStaticinfoType" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="province" label="省名称:">
          <el-input  v-model="staticNewMes.province"   disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="city" label="市名称:">
          <el-input v-model="staticNewMes.city"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="region" label="区县名称:">
          <el-input v-model="staticNewMes.region" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="examTime"  label="考试时间:">
          <el-input v-model="staticNewMes.examTime"  disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="备注:">
          <el-input type="textarea" v-model="staticNewMes.description"  ></el-input>
        </el-form-item>
        <el-form-item>
          <!--<router-link :to="{path:'/statmaincons/editstatic',query: {sequenceNbr:staticNewMes.sequenceNbr}}">-->
          <router-link :to="{path:`/statnews/editstatic/${staticNewMes.sequenceNbr}`}">
            <el-button type="primary" >修改</el-button>
          </router-link>
          <el-button @click="resetForm('dynamicValidateForm1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_NEWS } from 'api/config'
  export default {
    data() {
      return {
        examName: '',
        bigStaticinfoType: '',
        smallStaticinfoType: '',
        examTime: '',
        province: '',
        city: '',
        region: '',
        createUserName: '',
        tableData: [],
        staticNewMes: {},
        value: '',
        current: 1,
        size: 10,
        total:0,
        formShow: false
      }
    },
    mounted() {
      this._getmesLists()
    },
    methods: {
      loseBlur(){
        this._getmesLists()
      },
      _getmesLists() {//获取静态咨讯类型维护 分页信息列表
        let agencyCode = sessionStorage.getItem('agencyCode')
        let url= "/v1/news/NewsStaticInfo/queryTheNameForPage?current="+ this.current + "&size=" + this.size+
          '&examName='+ this.examName +'&bigStaticinfoType='+this.bigStaticinfoType+
          '&smallStaticinfoType='+this.smallStaticinfoType+'&agencyCode='+agencyCode
        let getData = {
          url: encodeURI(url),
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200) {
            let resDataTemp = []
            this.total = res.result.total
            let pages = res.result.pages
            let resData = res.result.records
            let current = res.result.current
            var i = 1
            resData.forEach((temp) => {
              if (this.total < this.size) {
                temp.num = i
                i++
              } else {
                temp.num = (current - 1) * this.size + i
                i++
              }
              resDataTemp.push(temp)
            })
            this._mesLists(resDataTemp, pages, current)
          }else if(res.status!==401){
            alert('获取静态咨讯信息出错：'+ res.message)
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
        this.current=val;
        this._getmesLists()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.formShow = false
      },
      tableClick(row){
        this.sequenceNbr = row.sequenceNbr
        let getData = {
          url: "/v1/news/NewsStaticInfo/"+ this.sequenceNbr,
          value: TIKA_NEWS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.staticNewMes = res.result
            this.formShow = true
            return 'current-row'
          }else if(res.status!==401){
            alert('获取单条资讯信息出错：'+res.message)
            return
          }
        })
      }
    }
  }
</script>

<style>

  .content-text .table-style .search .el-button--primary{
    float: right;
    width: 20%
  }

  .search .el-input{
    width: 18%;
    display: inline-block;
  }

  .el-form-item{
    margin-bottom: 15px
  }
  .table-style .block{
    margin-top: 10px;
    margin-left: 20%
  }
  /*.el-table .info-row {*/
    /*background: #c9e5f5;*/
  /*}*/
  /*.el-table .positive-row {*/
    /*background: #e2f0e4;*/
  /*}*/
</style>

