<template>
  <div>
    <div class="table-style">
      <div class="searchGoods">
        <div class="top-line">
          <el-input v-model="teackBookName" @blur="loseBlur" placeholder="教辅名称" ></el-input>
          <!--<el-input v-model="goodsLargeClass" @blur="loseBlur" placeholder="教辅大类" ></el-input>-->
          <el-input v-model="teackBookSmallClass" @blur="loseBlur" placeholder="教辅小类" ></el-input>
          <el-input v-model="teackBookTeacher" @blur="loseBlur" placeholder="教辅教师" ></el-input>
          <el-input v-model="teackBookVersion" @blur="loseBlur" placeholder="教辅版本" ></el-input>
          <br><br>
          <el-input v-model="teackBookStatus" @blur="loseBlur" placeholder="教辅状态" ></el-input>
          <el-input v-model="teackBookKeyWord" @blur="loseBlur" placeholder="教辅关键字" ></el-input>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          v-if="tableData"
          highlight-current-row
          @row-dblclick="tableClick">
          <el-table-column  prop="num"  label="序号" width="80px"></el-table-column>
          <el-table-column  prop="suppName"  label="教辅名称"></el-table-column>
          <el-table-column  prop="suppBigType"  label="教辅大类"></el-table-column>

          <el-table-column  prop="extend2"  label="教辅小类" ></el-table-column>
          <el-table-column  prop="agencyName" label="创建机构"></el-table-column>
          <el-table-column  prop="teacher" label="教辅教师"></el-table-column>
          <el-table-column  prop="extend3" label="教辅版本"></el-table-column>
          <el-table-column  prop="status" label="教辅状态"></el-table-column>
          <el-table-column  prop="keyWords" label="教辅关键字"></el-table-column>
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

    </div>
    <div class="formRight" v-show = "showNo">
      <el-form :model="teachBookData" ref="teachBookDataRef" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="teachBookName"
          label="教辅名称:"
          :rules="[
          {required: true, message: '教辅名称不能为空',trigger: 'blur'}
        ]">
          <el-input v-model="teachBookData.teachBookName"></el-input>
        </el-form-item>
        <el-form-item
          prop="teachBookName"
          label="教辅关键字:"
          :rules="[
          {required: true, message: '教辅关键字不能为空',trigger: 'blur'}]">
          <el-input v-model="teachBookData.teachBookKeyWords"></el-input>
        </el-form-item>
        <el-form-item
          label="教辅大类:">
          <el-input v-model="teachBookData.teachBookLargeClass" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="教辅小类:">
          <el-input v-model="teachBookData.teachBookSmallClass" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="创建机构:">
          <el-input v-model="teachBookData.agencyName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="教辅教师:">
          <el-input v-model="teachBookData.teachBookTeacher" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="教辅版本:">
          <el-input v-model="teachBookData.teachBookVersion" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="教辅状态:">
          <el-input v-model="teachBookData.teachBookStatus" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="生效时间:">
          <el-input v-model="teachBookData.effectiveTime" disabled="disabled"></el-input>
        </el-form-item>


        <el-form-item
          label="上传时间:">
          <el-input v-model="teachBookData.uploadTime" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item
          label="备注:">
          <el-input type='textarea' :rows="3" v-model="teachBookData.description"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
  import newList from 'common/content/newList'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_GOODS} from 'api/config'
  export default {
    data() {
      return {
        teackBookName:'',
        teackBookSmallClass:'',
        teackBookKeyWord:'',
        teackBookVersion:'',
        teackBookTeacher:'',
        teackBookStatus:'',
        tableData: [],
        teachBookData:{
          teachBookName:'',
          teachBookKeyWords:'',
          teachBookLargeClass:'',
          teachBookSmallClass:'',
          agencyName:'',
          teachBookTeacher:'',
          teachBookVersion:'',
          teachBookStatus:'',
          effectiveTime:'',
          uploadTime:'',
          description:'',
        },

        value: '',
        showNo: false,
        current: 1,
        size: 10,
        total:0
      }
    },
    mounted() {
      this._getTeachBookLists()
    },
    components: {
      newList
    },
    methods: {
      loseBlur(){
       /* this.suppName = this.teackBookName;
        this.extend2 = this.teackBookSmallClass;
        this.keyWords = this.teackBookKeyWord;
        this.extend3 = this.teackBookVersion;
        this.teacher = this.teackBookTeacher;
        this.status = this.teackBookStatus;*/
        this._getTeachBookLists()
      },

      _getTeachBookLists(data) {//获取教辅列表信息 分页信息列表 mobile/lockStatus
        let agencyCode = sessionStorage.getItem('agencyCode')
        let url = "/v1/mall/supplementary/page?current="+ this.current + "&size=" + this.size +
          "&suppName=" + this.teackBookName +"&extend2=" + this.teackBookSmallClass +
          "&keyWords=" + this.teackBookKeyWord + "&extend3=" + this.teackBookVersion +
          "&teacher=" + this.teackBookTeacher + "&status=" + this.teackBookStatus+'&agencyCode='+agencyCode;
        let getData = {
          url: encodeURI(url),
          value: TIKA_GOODS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200){
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
            var temp = {};
            resData.forEach((temp) => {
              temp.suppBigType = temp.suppBigType.replace(',','/');
              if(this.total < this.size){
                temp.num = i;
                i++;
              }else{
                temp.num = (current-1)*this.size + i;
                i++;
              }
              resDataTemp.push(temp);
            });
            this._mesLists(resDataTemp, pages, current);
          } else {
            alert(res.message);
            return
          }
        })
      },

      onSubmit(){
        this.$refs['teachBookDataRef'].validate((valid) => {
          if (valid) {
            this.onSubmitPut();
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      onSubmitPut() {
        let teachBookName = this.teachBookData.teachBookName;
        let teachBookKeyWords = this.teachBookData.teachBookKeyWords;
        let description = this.teachBookData.description;

        let format = {
          suppName: teachBookName,
          keyWords: teachBookKeyWords,
          description: description,
          recUserId : sessionStorage.getItem('userId')
        }
        let url = '/v1/mall/supplementary/update/' + this.sequrenceNbr
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_GOODS
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200){
            this._getTeachBookLists('true')
            this.resetForm()
          } else {
            alert("个人信息编辑出现错误："+res.message)
            return
          }
        })
      },

      _mesLists(resDatas, pages, current){
        this.tableData = resDatas;
        this.pages = pages;
        this.current = current;
      },
      handleSizeChange(val) {
        this.size= val;
        this._getTeachBookLists()
      },
      handleCurrentChange(val) {
        this.current=val;
        this._getTeachBookLists()
      },
      resetForm() {
        this.$refs['teachBookDataRef'].resetFields()
        this.showNo = false
      },
      tableClick(row){
        this.rowTemp = row;
        this.sequrenceNbr = row.sequenceNbr;
        let getData = {
          url: "/v1/mall/supplementary/selectone/"+ this.sequrenceNbr,
          value: TIKA_GOODS
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            var resTemp = res.result;
            this.teachBookData.teachBookName = resTemp.suppName;
            this.teachBookData.teachBookKeyWords = resTemp.keyWords;
            this.teachBookData.teachBookLargeClass =resTemp.suppBigType.replace(',','/');
            this.teachBookData.teachBookSmallClass = resTemp.extend2;
            this.teachBookData.agencyName = resTemp.agencyName;
            this.teachBookData.teachBookTeacher = resTemp.teacher;
            this.teachBookData.teachBookVersion = resTemp.extend3;
            this.teachBookData.teachBookStatus = resTemp.status;
            this.teachBookData.effectiveTime = resTemp.startDate + '至'+resTemp.endDate;
            this.teachBookData.uploadTime = resTemp.startDate;
            this.teachBookData.description = resTemp.description;
//            this.productCode =resTemp .productCode
            if(!this.showNo){
              this.showNo = true
            }
          } else {
            alert(res.message);
            return
          }
        })
      }
    }
  }
</script>

<style>
  .table-style .searchGoods{
    height:150px;
    /*margin-top: 110px;*/
    margin-bottom: 20px;
    width:100%;
    background: #fff;
  }

  .table-style .searchGoods .top-line{
    padding-top: 25px
  }

  .table-style .searchGoods .el-button--primary{
    float: right;
    width: 20%
  }
  .searchGoods .el-input{
    width: 18%;
    display: inline-block;
  }

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
  /*.el-table .info-row {*/
  /*background: #c9e5f5;*/
  /*}*/
  /*.el-table .positive-row {*/
  /*background: #e2f0e4;*/
  /*}*/
</style>


