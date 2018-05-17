<template>
  <div class="table-style">
    <div class="search">
      <div class="top-line">
        <el-select
          v-model="agencyName"
          filterable
          remote
          placeholder="请填写机构关键字"
          :remote-method="remoteMethod"
          @change="nameCheck"
          :loading="loading">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input  v-model="agencyCode" disabled="disabled" placeholder="机构代码"></el-input>

      </div>
    </div>
    <div class="el-tree-out">
      <el-tree
        ref="treeRec"
        :data="data"
        show-checkbox
        node-key="sequenceNbr"
        :props="defaultProps">
      </el-tree>
      <el-button type="primary" @click="onSubmit()">保存</el-button>
      <el-button @click="resetForm()">取消</el-button>
    </div>
  </div>
</template>


<script>
  import crypto from 'crypto'

  import { ApiGet,ApiPost } from 'api/recommand'
  import { URL_GET, URL_POST, URL_PUT, TIKA_TIKU, TIKA_RBAC, TIKA_AGENCY, TIKA_SYSTEM } from 'api/config'
  export default {
    data() {
      return {
        data:[],
        defaultProps: {
          children: 'child',
          label: 'industryName'
        },
        agencyName: '',
        agencyCode: '',

        loading: false,
        options4: [],
        list4: [],
        statesData: []
      }
    },
    mounted() {
      this._getMenuLists()
      this._getSubjectName()
    },
    methods: {
      _getMenuLists() {
        let getData = {
          // url: "/v1/itembank/itembankIndustryInfo/itembank/twoItembankIndustryInfos/tree",
          url: "/v1/systemctl/treeIndustryInfo/tree/twoTreeIndustryInfos/tree",
          value: TIKA_SYSTEM
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.data= res.result
          }else if(res.status !== 401){
            console.log(res.message)
            return
          }
        })
      },
      nameCheck(val){
        console.log('nameCheck(val){nameCheck(val){l')
        console.log(val)
        this.agencyCode = val
        let getData = {
          url: "/v1/privilege/resource/resourcelist?agencyCode="+val,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            if(!res.result){
              let url = '/v1/privilege/resource/agencyresourceAdd'
              let postData = {
                url: url,
                data: {
                  format: {
                    agencyCode:val,
                    createUserId: sessionStorage.getItem("userId"),
                    recUserId: sessionStorage.getItem("userId"),
                  },
                  value: TIKA_RBAC
                }
              }
              ApiPost(postData, URL_POST).then((resPost)=>{
                if(resPost.status === 200){
                  this.$refs.treeRec.setCheckedKeys([])
                }else if(resPost.status !== 401){
                  alert(resPost.message)
                  return
                }
              })
            }else{
              let tempDataB = []
              if(res.result === val){
                tempDataB = []
              }else{
                tempDataB = res.result.resourceSequenceNbr.split(',')
              }
              this.$refs.treeRec.setCheckedKeys(tempDataB)
            }
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      _getSubjectName(){
        let getData = {
          url: "/v1/agency/agencyinfo/selectAllAgencyInfo",
          value: TIKA_AGENCY
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if (res.status === 200) {
            this.statesData = []
            res.result.forEach(item=>{
              let temp = {}
              temp.label = item.agencyName
              temp.value = item.agencyCode
              this.statesData.push(temp)
            })
            this.list = this.statesData.map(item => {
              return { value: item.value, label: item.label };
            })
          } else if(res.status !== 401) {
            alert(res.message)
            return
          }
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.options4 = []
        }
      },
      onSubmit(){
        let md5 = crypto.createHash("md5")
        let md5Data = 'menu'
        md5.update(md5Data)
        let a = md5.digest('hex')
        let tempList = []
        tempList = this.$refs.treeRec.getCheckedKeys()
        tempList.push(md5Data)
        tempList.push(a)
        let menuList = tempList.join(',')
        let url = '/v1/privilege/resource/resourceupdate/'+ this.agencyCode
        let postData = {
          url: url,
          data: {
            format: {
              resourceSequenceNbr:menuList,
              recUserId: sessionStorage.getItem("userId")
            },
            value: TIKA_RBAC
          }
        }
        ApiPost(postData, URL_PUT).then((res) => {
          if(res.status === 200){
            alert('更新成功！！')
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      }
    }
  }
</script>

<style>

  .table-style .search .top-line .el-select .el-input{
    width:90%;
  }

</style>


