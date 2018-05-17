<template>
  <div class="table-style-goods">
    <el-form
      :inline="true"
      :model="goodsDataFormPut"
      ref = "goodsDataFormPutRef"
      class="demo-form-inline"
      label-width="100px"
      :rules="rules2"
      style="margin-bottom: 10px;width:100%">
      <div class="topLeftRight">
        <div class="topLeft">
          <el-form-item prop="goodsName" label="商品名称:"
                        :rules="[{required: true, message: '商品名称不能为空', trigger: 'blur'}]">
            <el-input v-model="goodsDataFormPut.goodsName" :maxlength="32" placeholder="填写视频名称"  style="width:410px"></el-input>
          </el-form-item>

          <el-form-item prop="productDescription" label="视频描述:"
                        :rules="[{required: true, message: '视频描述不能为空', trigger: 'blur'}]">
            <el-input v-model="goodsDataFormPut.productDescription" :maxlength="7" placeholder="填写视频描述"  style="width:410px"></el-input>
          </el-form-item>

          <el-form-item  class="tagClass" prop="goodsKeyword" label="视频关键字:">
            <!--:rules="[{required: true, message: '视频关键字不能为空', trigger: 'blur'}]">-->
            <el-tag
              :key="tag"
              v-for="tag in goodsDataFormPut.goodsKeyword"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-show="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
            </el-input>
            <el-button
              v-show="!inputVisible"
              class="button-new-tag"
              size="small"
              v-if="goodsKeywordLength < 7 "
              @click="showInput">点击添加关键字</el-button>
          </el-form-item>
          <el-form-item  prop="goodsMoney" label="视频价格:">
            <el-input v-model="goodsDataFormPut.goodsMoney"></el-input>
          </el-form-item>
          <br>
          <el-form-item  prop="goodsExam" label="视频考试:"
                         :rules="[{required: true, message: '视频考试不能为空', trigger: 'blur'}]">
            <el-select v-model="goodsDataFormPut.goodsExam"
                       placeholder="填写视频考试关键字"
                       filterable
                       remote
                       @focus="focus"
                       :remote-method="remoteMethod"
                       :loading="loading">
              <el-option
                v-for="item in options4"
                v-if="flag ===1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              <el-option
                v-for="item in list"
                v-if="flag === 0"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item  prop="goodsTeacher" label="课程教师:"
                         :rules="[{required: true, message: '课程教师不能为空', trigger: 'blur'}]">
            <el-input v-model="goodsDataFormPut.goodsTeacher"></el-input>
          </el-form-item>
          <br>
          <el-form-item prop="goodsIntroduce" label="视频介绍:"
                        :rules="[{required: true, message: '视频介绍不能为空', trigger: 'blur'}]">
            <el-input type="textarea" v-model="goodsDataFormPut.goodsIntroduce" :maxlength="150" :rows="5" placeholder="填写视频介绍"  style="width:510px"></el-input>
          </el-form-item>
        </div>
        <div class="topRight">
          <el-form-item  prop="goodsSmallClass" label="视频类别:"
                         :rules="[{required: true, message: '视频类别不能为空', trigger: 'blur'}]">
            <el-select v-model="goodsDataFormPut.goodsLargeClass" placeholder="选择视频类型" disabled="disabled">
              <el-option
                v-for="item in GOODS_LARGE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="goodsDataFormPut.goodsSmallClass" placeholder="选择视频小类">
              <el-option
                v-for="item in GOODS_SMALL"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="organization" label="维护机构:" >
            <el-input v-model="goodsDataFormPut.organization" disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item  prop="goodsVersion" label="视频版本:"
                         :rules="[{required: true, message: '视频版本不能为空',trigger: 'blur'}]">
            <el-select v-model="goodsDataFormPut.goodsVersion">
              <el-option
                v-for="item in GOODS_VERSION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="视频生效日期:" >
            <el-date-picker
              style="width: 164px"
              v-model="goodsDataFormPut.startDate"
              type="date"
              :editable="false"
              :picker-options="pickerBeginDateBefore"
              placeholder="选择日期">
            </el-date-picker><span>至</span>
            <el-date-picker
              style="width: 164px"
              v-model="goodsDataFormPut.endDate"
              type="date"
              :editable="false"
              :picker-options="pickerBeginDateAfter"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            prop="goodsLength"
            label="课时长度:">
            <el-input v-model="goodsDataFormPut.goodsLength"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="clear"></div>
      <div class="goodsImg" style="margin-left: 30px">
        <p>
          <span>视频封面</span>
        </p>
        <el-upload
          class="avatar-uploader"
          action="http://upload.qiniu.com"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="picturesData">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="el-upload__tip" slot="tip">格式JPG、PNG、JPEG;大小＜400KB</div>
      </div>
      <div style="margin-top: 30px;margin-left: 20px" >
        <p>视频详情</p>
        <vue-editor :id=goodsDataFormPut.ueName
                    useCustomImageHandler
                    @imageAdded="handleImageAdded"
                    v-model="goodsDataFormPut.infomation"
                    class="vue2-Editor">
        </vue-editor>
      </div>
    </el-form>
    <div style="text-align: center">
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button type="warning" @click="resetForm">取消</el-button>
    </div>
  </div>
</template>


<script>
  import newList from 'common/content/newList'

  import { VueEditor } from 'vue2-editor'
  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_GOODS, TIKA_SYSTEM} from 'api/config'
  import { getQiNiuToken, upQiNiuFile } from 'api/comFunction'

  export default {

    data() {
      var positiveInteger = (rule, value, callback)=>{
        setTimeout(() => {
          var myreg = /^[1-9]\d*$/;
          if(!myreg.test(value)){
            callback(new Error('请输入正确的正整数'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        flag:0,
        pictures:[],
        goodsDataFormPut: {
          goodsName: '',
          productDescription:'',
          goodsLargeClass: '',
          goodsSmallClass: '',
          goodsKeyword:[],
          organization: sessionStorage.getItem('agencyName'),
          goodsMoney: '',
          goodsVersion: '',
          goodsExam: '',
          startDate: '',
          endDate:'',
          goodsIntroduce: '',
          goodsTeacher: '',
          goodsLength:'',
          infomation:'',
          ueName:'ue-1'
        },
        imageUrl:'',
        GOODS_LARGE: [],
        GOODS_SMALL: [],
        GOODS_VERSION: [],
        goodsDataFormPutRef:{
          goodsMoney:'',
          goodsLength:''
        },
        rules2:{
//          goodsMoney:[{required: true, message: '视频价格不能为空',trigger: 'blur'}],
          goodsMoney:[{required: true, message: '视频价格不能为空',trigger: 'blur'},
            {validator: positiveInteger, trigger: 'blur'}],
          goodsLength:[{required: true, message: '课时长度不能为空',trigger: 'blur'},
            {validator: positiveInteger, trigger: 'blur'}]
        },
        active: 1,
        inputVisible: false,
        inputValue: '',
        goodsKeywordLength: 0,
        dialogImageUrl: '',
        dialogVisible: false,
        picturesData:{},
        editableTabsValue2: '1',
        editableTabs2: [],
        tabIndex: 0,
        inputContentVisible: false,
        inputContentValue: '',
        visible2: false,
        options4: [],
        list: [],
        loading: false,

        pickerBeginDateBefore:{
          disabledDate: (time) => {
            let beginDateVal = this.goodsDataFormPut.endDate;
            if (beginDateVal) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        pickerBeginDateAfter:{
          disabledDate: (time) => {
            let beginDateVal = this.goodsDataFormPut.startDate;
            if (beginDateVal) {
              return time.getTime() < beginDateVal;
            }
          }
        },
      }
    },
    mounted(){
      this._getQiNiuToken();
      this._getRemoteOptionLists();
      this._getSelectOptionLists();
      this.newsSequenceNbr = this.$route.params.sequenceNbr
      this.$nextTick(function(){
        this.$refs.goodsDataFormPutRef.resetFields();
        this.editOneGoodsInfo(this.newsSequenceNbr)
      })
    },
    methods:{
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

      submitForm(){
        if (this.pictures.length === 0){
          this.$message.error('视频封面不能为空!')
          return;
        }
        if (!this.goodsDataFormPut.infomation){
          this.$message.error('课程介绍不能为空!')
          return
        }
        console.log(this.goodsDataFormPut.goodsMoney)
        this.$refs['goodsDataFormPutRef'].validate((valid) => {
          if (valid) {
            this.putSubmitApi()
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      putSubmitApi(){
        let productName = this.goodsDataFormPut.goodsName;
        let productDescription = this.goodsDataFormPut.productDescription;
        let productBigType = this.goodsDataFormPut.goodsLargeClass.split(',')[0];
        let extend1 =  this.goodsDataFormPut.goodsLargeClass.split(',')[1];
        let productSmaType = this.goodsDataFormPut.goodsSmallClass.split(',')[0];
        let extend2 = this.goodsDataFormPut.goodsSmallClass.split(',')[1];
        let keyWords = this.goodsDataFormPut.goodsKeyword.join(',');
        let agencyName = sessionStorage.getItem('agencyName');
        let agencyCode = sessionStorage.getItem('agencyCode');
        let originalPrice = this.goodsDataFormPut.goodsMoney;
        let productVersion = this.goodsDataFormPut.goodsVersion.split(',')[0];
        let extend3 = this.goodsDataFormPut.goodsVersion.split(',')[1];
        let productExam = this.goodsDataFormPut.goodsExam;
        let startDate = this.goodsDataFormPut.startDate;
        let endDate = this.goodsDataFormPut.endDate;
        let teacher = this.goodsDataFormPut.goodsTeacher;
        let allTime = this.goodsDataFormPut.goodsLength;
        let introduce = this.goodsDataFormPut.goodsIntroduce;
        let pictures = this.pictures;
        let infomation = this.goodsDataFormPut.infomation;
        let format = {
          productName :productName,
          productDescription :productDescription,
          productBigType: productBigType,
          extend1: extend1,
          productSmaType:productSmaType,
          extend2:extend2,
          keyWords:keyWords,
          agencyName:agencyName,
          agencyCode:agencyCode,
          originalPrice:originalPrice,
          productVersion:productVersion,
          extend3:extend3,
          productExam:productExam,
          startDate:startDate,
          endDate:endDate,
          teacher:teacher,
          allTime:allTime,
          introduce:introduce,
          infomation:infomation,
          pictures :pictures,
          createUserId : sessionStorage.getItem('userId')
        };
        let url =  '/v1/mall/productinfo/update/' + this.newsSequenceNbr
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_GOODS
          }
        };
        ApiPost(postData, URL_PUT).then((res)=>{
          if (res.status === 200){
            this.goodsDataFormPut.goodsLargeClass = '';
            this.goodsDataFormPut.goodsSmallClass = '';
            this.goodsDataFormPut.goodsVersion='',
            this.goodsDataFormPut.infomation = '';
            this.resetForm('goodsDataFormPutRef');
            alert('视频修改成功')
            window.location.href = '#/statgoods/goodsList';
            window.opener.location.reload();
            window.close();
          }else {
            alert(res.message)
            return
          }
        })
      },

      resetForm(){
        this.$refs.goodsDataFormPutRef.resetFields();
      },
      handleClose(tag) {
        this.goodsDataFormPut.goodsKeyword.splice(this.goodsDataFormPut.goodsKeyword.indexOf(tag), 1)
        this.goodsKeywordLength = this.goodsDataFormPut.goodsKeyword.length
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if(inputValue){
          this.goodsDataFormPut.goodsKeyword.push(inputValue);
          this.goodsKeywordLength = this.goodsDataFormPut.goodsKeyword.length
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      //上传图片提交前进行验证
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpg'
        const isPNG = file.type === 'image/png'
        const isJPEG = file.type === 'image/jpeg'
        const isLt2M = file.size/ 1024 < 400
        let logo = isPNG || isJPG || isJPEG
        if (!logo) {
          this.$message.error('上传头像图片只能是 JPG/PNG/JPEG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 400KB!')
        }
        return logo && isLt2M
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        console.log(this.dialogImageUrl)
        this.dialogVisible = true
      },
      handleAvatarSuccess(res ,file, fileList){
        this.imageUrl = this.domain + '/' +res.key
        this.pictures.push(this.imageUrl)
      },
      _getSelectOptionLists(){
        let getData = {
          url: "/v1/systemctl/dictionary/getDictValueByKeyOfThreeProduct",
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.GOODS_LARGE = [];
            this.GOODS_SMALL = [];
            this.GOODS_VERSION = [];
            let goodsLargeData = res.result.PRODUCT_BIG_TYPE;
            let goodsSmallData = res.result.PRODUCT_SMA_TYPE;
            let goodsVersionData = res.result.PRODUCT_VERSION;
            goodsLargeData.forEach(item=>{
              let temp = {};
              temp.value = item.dictDataKey + ','+item.dictDataValue;
              temp.label=item.dictDataValue;
              this.GOODS_LARGE.push(temp);
            });
            goodsSmallData.forEach(item=>{
              let temp1 = {};
              temp1.value = item.dictDataKey + ','+item.dictDataValue;
              temp1.label=item.dictDataValue;
              this.GOODS_SMALL.push(temp1);
            });
            goodsVersionData.forEach(item=>{
              let temp2 = {};
              temp2.value = item.dictDataKey + ','+item.dictDataValue;
              temp2.label=item.dictDataValue;
              this.GOODS_VERSION.push(temp2);
            });

          } else {
            alert(res.message)
            return
          }
        })
      },
      _getQiNiuToken(){
        getQiNiuToken('image').then(res=>{
          this.picturesData.token = res.upToken
          this.uptoken = res.upToken
          this.domain = res.domain
        })
      },
      _getRemoteOptionLists(){
        let agencyCode = sessionStorage.getItem('agencyCode')
        let getData = {
          url: "/v1/systemctl/treeExamInfo/selectAllOfTheExams/"+agencyCode,
          value: TIKA_SYSTEM
        };
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.examData = [];
            res.result.forEach(item=>{
              let temp = {}
              temp.value = item.examCode;
              temp.label = item.examName;
              this.examData.push(temp)
            })
            this.list = this.examData.map(item => {
              return { value: item.value, label: item.label };
            })
          } else {
            alert(res.message)
            return
          }
        })
      },
      handleImageAdded(file, Editor, cursorLocation) {
        let uptoken = this.uptoken
        let domain = this.domain
        upQiNiuFile(file, uptoken, domain).then(res=>{
          if(res.status === 200){
            //this.examTreeForm.iconUrl = res.url
            Editor.insertEmbed(cursorLocation, 'image', res.url);
          }else{
            console.log(res.err)
            return
          }
        })
      },
      //查询单个视频的详细信息
      editOneGoodsInfo(){
        let getData = {
          url: "/v1/mall/productinfo/selectone/"+ this.newsSequenceNbr,
          value: TIKA_GOODS
        }
        ApiGet(getData,URL_GET).then(res=>{
          if (res.status === 200){
            console.log(this.list)
            let resTemp = res.result;
            console.log(this.goodsDataFormPut)
            this.goodsDataFormPut.goodsName = resTemp.productName;
            this.goodsDataFormPut.productDescription = resTemp.productDescription;
            this.goodsDataFormPut.goodsLargeClass = resTemp.productBigType+','+resTemp.extend1;
            this.goodsDataFormPut.goodsSmallClass = resTemp.productSmaType+','+resTemp.extend2;
            this.goodsDataFormPut.goodsKeyword = resTemp.keyWords.split(',');
            this.goodsDataFormPut.organization = resTemp.agencyName;
            this.goodsDataFormPut.goodsMoney = resTemp.originalPrice+'';
            this.goodsDataFormPut.goodsVersion = resTemp.productVersion+','+resTemp.extend3;
            this.goodsDataFormPut.goodsExam = resTemp.productExam;
            var stringTime = resTemp.startDate;
            var timestamp1 = Date.parse(new Date(stringTime));
            var newDate1 = new Date();
            newDate1.setTime(timestamp1);
            this.goodsDataFormPut.startDate = newDate1;
            var endTime = resTemp.endDate;
            var timestamp2 = Date.parse(new Date(endTime));
            var newDate2 = new Date();
            newDate2.setTime(timestamp2)
            this.goodsDataFormPut.endDate = newDate2;
            this.goodsDataFormPut.goodsLength = resTemp.allTime;
            this.goodsDataFormPut.goodsIntroduce = resTemp.introduce;
            this.goodsDataFormPut.goodsTeacher = resTemp.teacher;
            this.goodsDataFormPut.infomation = resTemp.infomation;
            this.pictures = resTemp.pictures;
            this.imageUrl  = resTemp.pictures[0]
          }else if(res.status !== 401){
            alert('查询单个视频信息出现错误:'+res.message)
            return;
          }
        })
      },
      //视频考试获取焦点
      focus(){
        this.flag = 1;
      }
    },
    components: {
      newList,
      VueEditor
    }
  }
</script>

<style>

 .table-style-goods{
    float: left;
    width: 70%;
    text-align: left;
    line-height: 25px;
    margin-left: 5px;
    margin-top: 10px;
    margin-bottom: 20px;
  }

.table-style-goods .topLeftRight .topLeft{
    width: 60%;
    /*height: 200px;*/
    float: left;
  }
.table-style-goods  .topLeftRight .topRight{
    width: 40%;
    /*height: 200px;*/
    float: right;
  }
table-style-goods .goodsImg{
    display: block;
    margin-left: 50px;
  }
  .divClass{
    margin-top:30px;
    margin-left: 20px
  }
  .tagClass{
    width: 100%
  }
  .tagClass .el-form-item__label{
    float: left;

  }
  .tagClass .el-form-item__content{
    width: 82%;
  }
  .el-tabs .el-tabs--card{
    margin-bottom: 20px;
  }
  .stepRight{
    position: absolute;
    top: 150px;
    right: 100px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .topRight .el-form-item__content .el-select{
    width :172px
  }
  .el-popover{
    width: 800px;
    position: absolute;
    top: 450px !important;
    left: 325px !important;
    transform-origin: center top 0px;
    z-index: 2000;
  }

  .el-date-editor el-input el-date-editor--date{
    width:165px
  }
 .avatar-uploader .el-upload {
   border: 1px dashed #d9d9d9;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
 }
 .avatar-uploader .el-upload:hover {
   border-color: #409EFF;
 }
 .avatar-uploader-icon {
   font-size: 28px;
   color: #8c939d;
   width: 178px;
   height: 178px;
   line-height: 178px;
   text-align: center;
 }
 .avatar {
   width: 178px;
   height: 178px;
   display: block;
 }
</style>

