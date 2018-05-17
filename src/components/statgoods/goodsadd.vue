<template>
  <div class="table-style-goods">
    <el-form
      :inline="true"
      :model="goodsDataForm"
      ref = "goodsDataFormRef"
      class="demo-form-inline"
      label-width="100px"
      :rules="rules2"
      style="margin-bottom: 10px;width:100%">
      <div class="topLeftRight">
        <div class="topLeft">
          <el-form-item prop="goodsName" label="视频名称:"
                        :rules="[{required: true, message: '视频名称不能为空', trigger: 'blur'}]">
            <el-input v-model="goodsDataForm.goodsName" :maxlength="32" placeholder="填写视频名称"  style="width:410px"></el-input>
          </el-form-item>

          <el-form-item prop="productDescription" label="视频描述:"
                        :rules="[{required: true, message: '视频描述不能为空', trigger: 'blur'}]">
            <el-input v-model="goodsDataForm.productDescription" :maxlength="7" placeholder="填写视频描述"  style="width:410px"></el-input>
          </el-form-item>

          <el-form-item  class="tagClass" prop="goodsKeyword" label="视频关键字:">
            <!--:rules="[{required: true, message: '视频关键字不能为空', trigger: 'blur'}]">-->
            <el-tag
              :key="tag"
              v-for="tag in goodsDataForm.goodsKeyword"
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
            <el-input v-model="goodsDataForm.goodsMoney"></el-input>
          </el-form-item>
          <br>
          <el-form-item  prop="goodsExam" label="视频考试:"
                         :rules="[{required: true, message: '视频考试不能为空', trigger: 'blur'}]">
            <el-select v-model="goodsDataForm.goodsExam"
                       placeholder="填写视频考试关键字"
                       filterable
                       remote
                       :remote-method="remoteMethod"
                       :loading="loading">
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item  prop="goodsTeacher" label="课程教师:"
                         :rules="[{required: true, message: '课程教师不能为空', trigger: 'blur'}]">
            <el-input v-model="goodsDataForm.goodsTeacher"></el-input>
          </el-form-item>
          <br>
          <el-form-item prop="goodsIntroduce" label="视频介绍:"
                        :rules="[{required: true, message: '视频介绍不能为空', trigger: 'blur'}]">
            <el-input type="textarea" v-model="goodsDataForm.goodsIntroduce" :maxlength="150" :rows="5" placeholder="填写视频介绍"  style="width:510px"></el-input>
          </el-form-item>
        </div>
        <div class="topRight">
          <el-form-item  prop="goodsSmallClass" label="视频类别:"
                         :rules="[{required: true, message: '视频类别不能为空', trigger: 'blur'}]">
            <el-select v-model="goodsDataForm.goodsLargeClass" placeholder="选择视频类型" disabled="disabled">
              <el-option
                v-for="item in GOODS_LARGE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="goodsDataForm.goodsSmallClass" placeholder="选择视频小类">
              <el-option
                v-for="item in GOODS_SMALL"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="organization" label="维护机构:" >
            <el-input v-model="goodsDataForm.organization" disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item  prop="goodsVersion" label="视频版本:"
                         :rules="[{required: true, message: '视频版本不能为空',trigger: 'blur'}]">
            <el-select v-model="goodsDataForm.goodsVersion">
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
              v-model="goodsDataForm.startDate"
              type="date"
              :editable="false"
              :picker-options="pickerBeginDateBefore"
              placeholder="选择日期">
            </el-date-picker><span>至</span>
            <el-date-picker
              style="width: 164px"
              v-model="goodsDataForm.endDate"
              type="date"
              :editable="false"
              :picker-options="pickerBeginDateAfter"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            prop="goodsLength"
            label="课时长度:">
            <el-input v-model="goodsDataForm.goodsLength"></el-input>
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
        <!--<textarea v-model="goodsDataForm.infomation" style="min-height: 100px;min-width: 99%"></textarea>-->
        <vue-editor :id=goodsDataForm.ueName
                    useCustomImageHandler
                    @imageAdded="handleImageAdded"
                    v-model="goodsDataForm.infomation"
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
        pictures:[],
        imageUrl:'',
        goodsDataForm: {
          goodsName: '',
          productDescription:'',
          goodsLargeClass: 'COURSE,课程',
          goodsSmallClass: '',
          goodsKeyword:[],
          organization: sessionStorage.getItem('agencyName'),
          goodsMoney: '',
          goodsVersion: '',
          goodsExam: '',
          startDate: new Date(),
          endDate:new Date(),
          goodsIntroduce: '',
          goodsTeacher: '',
          goodsLength:'',
          infomation:'',
          ueName:'ue-1'
        },
        GOODS_LARGE: [],
        GOODS_SMALL: [],
        GOODS_VERSION: [],
        goodsDataFormRef:{
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
            let beginDateVal = this.goodsDataForm.endDate;
            if (beginDateVal) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        pickerBeginDateAfter:{
          disabledDate: (time) => {
            let beginDateVal = this.goodsDataForm.startDate;
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
    },
    methods:{

      loseBlur(){
      },

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
        if (!this.goodsDataForm.infomation){
          this.$message.error('课程介绍不能为空!')
          return
        }
        this.$refs['goodsDataFormRef'].validate((valid) => {
          if (valid) {
            this.postSubmitApi()
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      postSubmitApi(){
        let productName = this.goodsDataForm.goodsName;
        let productDescription = this.goodsDataForm.productDescription;
        let productBigType = this.goodsDataForm.goodsLargeClass.split(',')[0];
        let extend1 =  this.goodsDataForm.goodsLargeClass.split(',')[1];
        let productSmaType = this.goodsDataForm.goodsSmallClass.split(',')[0];
        let extend2 = this.goodsDataForm.goodsSmallClass.split(',')[1];
        let keyWords = this.goodsDataForm.goodsKeyword.join(',');
        let agencyName = sessionStorage.getItem('agencyName');
        let agencyCode = sessionStorage.getItem('agencyCode');
        let originalPrice = this.goodsDataForm.goodsMoney;
        let productVersion = this.goodsDataForm.goodsVersion.split(',')[0];
        let extend3 = this.goodsDataForm.goodsVersion.split(',')[1];
        let productExam = this.goodsDataForm.goodsExam;
        let startDate = this.goodsDataForm.startDate;
        let endDate = this.goodsDataForm.endDate;
        let teacher = this.goodsDataForm.goodsTeacher;
        let allTime = this.goodsDataForm.goodsLength;
        let introduce = this.goodsDataForm.goodsIntroduce;
        let pictures = this.pictures;
        let infomation = this.goodsDataForm.infomation;
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
        let url = '/v1/mall/productinfo/newgoods'
        let postData = {
          url: url,
          data: {
            format: format,
            value: TIKA_GOODS
          }
        };
        ApiPost(postData, URL_POST).then((res)=>{
          console.log(res)
          if (res.status === 200){
            this.goodsDataForm.goodsLargeClass = '';
            this.goodsDataForm.goodsSmallClass = '';
            this.goodsDataForm.goodsVersion='',
            this.goodsDataForm.infomation = '';
            this.resetForm('goodsDataFormRef');
            alert('视频新增成功')
            window.location.href = '#/statgoods/goodsList';
          }else {
            alert(res.message)
            return
          }
        })
      },

      resetForm(){
        this.$refs.goodsDataFormRef.resetFields();
      },
      handleClose(tag) {
        this.goodsDataForm.goodsKeyword.splice(this.goodsDataForm.goodsKeyword.indexOf(tag), 1)
        this.goodsKeywordLength = this.goodsDataForm.goodsKeyword.length
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
          this.goodsDataForm.goodsKeyword.push(inputValue);
          this.goodsKeywordLength = this.goodsDataForm.goodsKeyword.length
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

