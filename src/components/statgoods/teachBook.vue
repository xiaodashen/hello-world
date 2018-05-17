<template>
  <div class="table-style-goods">
    <el-form
      :inline="true"
      :model="teachBookForm"
      ref = "teachBookFormRef"
      class="demo-form-inline"
      label-width="100px"
      :rules="rules2"
      style="margin-bottom: 10px;width:100%">
      <div class="topLeftRight">
        <div class="topLeft">
          <el-form-item prop="teackBookName" label="教辅名称:"
                        :rules="[{required: true, message: '教辅名称不能为空', trigger: 'blur'}]">
            <el-input v-model="teachBookForm.teackBookName" :maxlength="32" placeholder="填写教辅名称"  style="width:410px"></el-input>
          </el-form-item>

          <el-form-item prop="teackBookDescription" label="教辅描述:"
                        :rules="[{required: true, message: '教辅描述不能为空', trigger: 'blur'}]">
            <el-input v-model="teachBookForm.teackBookDescription" :maxlength="7" placeholder="填写教辅描述"  style="width:410px"></el-input>
          </el-form-item>

          <el-form-item  class="tagClass" prop="teackBookKeyword" label="教辅关键字:">
            <!--:rules="[{required: true, message: '教辅关键字不能为空', trigger: 'blur'}]">-->
            <el-tag
              :key="tag"
              v-for="tag in teachBookForm.teackBookKeyword"
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
              v-if="teackBookKeywordLength < 7 "
              @click="showInput">点击添加关键字</el-button>
          </el-form-item>
          <el-form-item  prop="teackBookMoney" label="教辅价格:">
            <el-input v-model="teachBookForm.teackBookMoney"></el-input>
          </el-form-item>
          <br>
          <el-form-item  prop="teackBookExam" label="教辅考试:"
                         :rules="[{required: true, message: '教辅考试不能为空', trigger: 'blur'}]">
            <el-select v-model="teachBookForm.teackBookExam"
                       placeholder="填写教辅考试关键字"
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
          <el-form-item  prop="teackBookTeacher" label="教辅教师:"
                         :rules="[{required: true, message: '教辅教师不能为空', trigger: 'blur'}]">
            <el-input v-model="teachBookForm.teackBookTeacher"></el-input>
          </el-form-item>
          <br>
          <el-form-item prop="teackBookIntroduce" label="教辅介绍:"
                        :rules="[{required: true, message: '教辅介绍不能为空', trigger: 'blur'}]">
            <el-input type="textarea" v-model="teachBookForm.teackBookIntroduce" :maxlength="150" :rows="5" placeholder="填写教辅介绍"  style="width:510px"></el-input>
          </el-form-item>
        </div>
        <div class="topRight">
          <el-form-item  prop="teackBookClass" label="教辅类别:"
                         :rules="[{required: true, message: '教辅类别不能为空', trigger: 'blur'}]">
            <el-select v-model="teachBookForm.teackBookLargeClass" placeholder="选择教辅类型" disabled>
              <el-option
                v-for="item in GOODS_LARGE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="teachBookForm.teackBookSmallClass" placeholder="选择教辅小类">
              <el-option
                v-for="item in GOODS_SMALL"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="organization" label="维护机构:" >
            <el-input v-model="teachBookForm.organization" disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item  prop="teackBookVersion" label="教辅版本:"
                         :rules="[{required: true, message: '教辅版本不能为空',trigger: 'blur'}]">
            <el-select v-model="teachBookForm.teackBookVersion">
              <el-option
                v-for="item in GOODS_VERSION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="教辅生效日期:" >
            <el-date-picker
              style="width: 164px"
              v-model="teachBookForm.startDate"
              type="date"
              :editable="false"
              :picker-options="pickerBeginDateBefore"
              placeholder="选择日期">
            </el-date-picker><span>至</span>
            <el-date-picker
              style="width: 164px"
              v-model="teachBookForm.endDate"
              type="date"
              :editable="false"
              :picker-options="pickerBeginDateAfter"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            prop="teackBookCount"
            label="教辅库存:">
            <el-input v-model="teachBookForm.teackBookCount"></el-input>
          </el-form-item>
          <el-form-item
            prop="publisherName"
            label="教辅出版社:"
            :rules="[{required: true, message: '教辅出版社不能为空', trigger: 'blur'}]">
            <el-input v-model="teachBookForm.publisherName"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="clear"></div>
      <div class="teackBookImg" style="margin-left: 30px">
        <p>
          <span>教辅封面</span> <span>教辅介绍图</span>
        </p>
        <el-upload
          action="http://upload.qiniu.com"
          list-type="picture-card"
          multiple

          :file-list="fileList"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeAvatarUpload"
          :data="picturesData">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div class="el-upload__tip" slot="tip">格式JPG、PNG、JPEG;大小＜400KB</div>
      </div>
      <!--<div class="divClass">
        <div><span>优惠活动</span>
          <el-dialog :visible.sync="dialogVisible">
            <div>
              <el-input v-model="keyword" @blur="loseBlur" placeholder="活动关键字" style="width: 25%"></el-input>
              <el-select v-model="discount" @change="changeDiscountStatus" placeholder="优惠活动">
                <el-option
                  v-for="item in DISCOUNT_STATUSS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-table
              :data="tableData"
              v-if="tableData"
              @selection-change = "selectedData"
              highlight-current-row>
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column  prop="date"  label="学员账号"></el-table-column>
              <el-table-column  prop="name"  label="机构名称"></el-table-column>
              <el-table-column  prop="address" label="注册时间"></el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 40px">
                 <span slot="footer" class="dialog-footer">
                  <el-button @click="reset">取 消</el-button>
                  <el-button type="primary" @click="submit">确 定</el-button>
                 </span>
            </div>
          </el-dialog>
          <el-button type="primary" icon="plus" @click="addDiscountInfo"></el-button>
          <div style="border: 0.5px solid grey" >
            <el-checkbox-group v-model="selectedDiscount">
              <el-checkbox v-for="item in selectedDiscount" :label="item.name" :key="item.name"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>-->
      <div style="margin-top: 30px;margin-left: 20px" >
        <p>教辅详情</p>
        <!--<textarea v-model="teachBookForm.infomation" style="min-height: 100px;min-width: 99%"></textarea>-->
        <vue-editor :id=teachBookForm.ueName
                    useCustomImageHandler
                    @imageAdded="handleImageAdded"
                    v-model="teachBookForm.infomation"
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
  import { URL_GET, URL_POST, URL_PUT,TIKA_TIKU, TIKA_GOODS, TIKA_SYSTEM} from 'api/config'
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
        fileList:[],
        keyword:'',
        discount:'',
        tableData: [{
          date: '2016-05-03',
          name: '王一虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王二虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王三虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王四虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王五虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王六虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王七虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        pictures:[],
        teachBookForm: {
          teackBookName: '',
          teackBookDescription:'',
          teackBookClass:'',
          teackBookLargeClass: '教材/教辅',
          teackBookSmallClass: '',
          teackBookKeyword:[],
          organization: sessionStorage.getItem('agencyName'),
          teackBookMoney: '',
          teackBookVersion: '',
          teackBookExam: '',
          startDate: new Date(),
          endDate:new Date(),
          teackBookIntroduce: '',
          teackBookTeacher: '',
          teackBookCount:'',
          publisherName:'',
          infomation:'',
          ueName:'ue-1'
        },
        GOODS_LARGE: [],
        GOODS_SMALL: [],
        GOODS_VERSION: [],
        DISCOUNT_STATUSS: [{
          value: 'kecheng',
          label: '课程'
        }, {
          value: 'jiangyi',
          label: '讲义'
        }, {
          value: 'jiaocai',
          label: '教材'
        }, {
          value: 'jiaofu',
          label: '教辅'
        }],
        selectedDiscount:[],
        teachBookFormRef:{
          teackBookMoney:'',
          teackBookCount:''
        },
        rules2:{
          teackBookMoney:[{required: true, message: '教辅价格不能为空',trigger: 'blur'},
            {validator: positiveInteger, trigger: 'blur'}],
          teackBookCount:[{required: true, message: '教辅库存不能为空',trigger: 'blur'},
            {validator: positiveInteger, trigger: 'blur'}]
        },
        active: 1,
        inputVisible: false,
        inputValue: '',
        teackBookKeywordLength: 0,
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
            let beginDateVal = this.teachBookForm.endDate;
            if (beginDateVal) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        pickerBeginDateAfter:{
          disabledDate: (time) => {
            let beginDateVal = this.teachBookForm.startDate;
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
        if (this.teachBookForm.teackBookSmallClass){
          this.teachBookForm.teackBookClass = 'true';
        }else {
          this.teachBookForm.teackBookClass = '';
        }
        if (this.pictures.length === 0){
          this.$message.error('教辅封面、教辅介绍图不能为空!')
          return;
        }
        if (!this.teachBookForm.infomation){
          this.$message.error('教辅介绍不能为空!')
          return
        }
        this.$refs['teachBookFormRef'].validate((valid) => {
          if (valid) {
            this.postSubmitApi()
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      postSubmitApi(){
        let suppName = this.teachBookForm.teackBookName;
        let suppDescription = this.teachBookForm.teackBookDescription;
        let suppBigType = this.teachBookForm.teackBookLargeClass.replace('/',',');
        let extend1 =  'MATERIAL/REFERENCE';
        let suppSmaType = this.teachBookForm.teackBookSmallClass.split(',')[0];
        let extend2 = this.teachBookForm.teackBookSmallClass.split(',')[1];
        let keyWords = this.teachBookForm.teackBookKeyword.join(',');
        let agencyName = sessionStorage.getItem('agencyName');
        let agencyCode = sessionStorage.getItem('agencyCode');
        let originalPrice = this.teachBookForm.teackBookMoney;
        let suppVersion = this.teachBookForm.teackBookVersion.split(',')[0];
        let extend3 = this.teachBookForm.teackBookVersion.split(',')[1];
        let suppExam = this.teachBookForm.teackBookExam;
        let startDate = this.teachBookForm.startDate;
        let endDate = this.teachBookForm.endDate;
        let teacher = this.teachBookForm.teackBookTeacher;
        let introduce = this.teachBookForm.teackBookIntroduce;
        let teackBookCount = this.teachBookForm.teackBookCount;
        let publisherName = this.teachBookForm.publisherName;
        let pictures = this.pictures;
        let infomation = this.teachBookForm.infomation;
        let format = {
          suppName :suppName,
          suppDescription :suppDescription,
          suppBigType: suppBigType,
          extend1: extend1,
          suppSmaType:suppSmaType,
          extend2:extend2,
          keyWords:keyWords,
          agencyName:agencyName,
          agencyCode:agencyCode,
          originalPrice:originalPrice,
          suppVersion:suppVersion,
          extend3:extend3,
          suppExam:suppExam,
          startDate:startDate,
          endDate:endDate,
          teacher:teacher,
          introduce:introduce,
          suppCount:teackBookCount,
          publisherName:publisherName,
          infomation:infomation,
          pictures :pictures,
          createUserId : sessionStorage.getItem('userId')
        };
        let url = '/v1/mall/supplementary/newteachingassistant'
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
            this.teachBookForm.teachBookLargeClass = '';
            this.teachBookForm.teachBookSmallClass = '';
            this.teachBookForm.teachBookVersion='',
              this.teachBookForm.infomation = '';
            this.fileList = [];
            this.resetForm('teachBookFormRef');
            alert('教辅新增成功')
            window.location.href = '#/statgoods/teachBookList';
          }else {
            alert(res.message)
            return
          }
        })
      },

      resetForm(){
        this.$refs.teachBookFormRef.resetFields();
      },
      handleClose(tag) {
        this.teachBookForm.teackBookKeyword.splice(this.teachBookForm.goodsKeyword.indexOf(tag), 1)
        this.teackBookKeywordLength = this.teachBookForm.teackBookKeyword.length
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
          this.teachBookForm.teackBookKeyword.push(inputValue);
          this.teackBookKeywordLength = this.teachBookForm.teackBookKeyword.length
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

      handleRemove(file, fileList) {
        let temp=[]
        fileList.forEach((res,index)=>{
          temp[index] = this.domain + '/' + res.response.key
        });
        this.pictures = temp
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        console.log(this.dialogImageUrl)
        this.dialogVisible = true
      },
      handleAvatarSuccess(res ,file, fileList){
        console.log('res============')
        console.log(res)
        console.log('this.imageUrl============')
        console.log(this.imageUrl)
        console.log('fileListfileListfileList============')
        console.log(fileList)
        let temp=[]
        this.fileList = fileList;
        if (this.fileList.length > 7){
          this.fileList = this.fileList.slice(-7)
        }
        this.fileList.forEach((res,index)=>{
          temp[index] = this.domain + '/' +res.response.key
        });
        this.pictures = temp
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
            let teackBookLargeData = res.result.PRODUCT_BIG_TYPE;
            let teackBookSmallData = res.result.PRODUCT_SMA_TYPE;
            let teackBookVersionData = res.result.PRODUCT_VERSION;
            teackBookLargeData.forEach(item=>{
              let temp = {};
              temp.value = item.dictDataKey + ','+item.dictDataValue;
              temp.label=item.dictDataValue;
              this.GOODS_LARGE.push(temp);
            });
            teackBookSmallData.forEach(item=>{
              let temp1 = {};
              temp1.value = item.dictDataKey + ','+item.dictDataValue;
              temp1.label=item.dictDataValue;
              this.GOODS_SMALL.push(temp1);
            });
            teackBookVersionData.forEach(item=>{
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
  table-style-goods .teachBookImg{
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
</style>

