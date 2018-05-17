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
          ref="treeMenu"
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
  import { URL_GET, URL_POST, URL_PUT, TIKA_APP, TIKA_TIKU, TIKA_AGENCY, TIKA_RBAC } from 'api/config'

  export default {
    data() {
      return {
        data:[],
        defaultProps: {
          children: 'children',
          label: 'menuTitle'
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
      //this.nameCheck('sc10001')
    },
    methods: {
      _getMenuLists() {
        let getData = {
          url: "/v1/privilege/menu/getTheMenuTree",
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            let userMenuArr = this._menuComp(res.result,"ROOT")
            console.log(userMenuArr)

            this.data = userMenuArr
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },
      sortFun(name){
        return function(o, p){
          var a, b;
          if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
              return 0;
            }
            if (typeof a === typeof b) {
              return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
          }
          else {
            throw ("error");
          }
        }
      },
      _menuComp(arr, pid) {
        var newTree = []
        arr.forEach((item, index) => {
          if (item.parentId === pid) {
            item.children = []
            newTree.push(item)
            delete arr[index]
          }
        })
        newTree.sort(this.sortFun("orderNum"))
        newTree.forEach((item) => {
          arr.forEach((arritem, arrindex)=>{
            if (item.sequenceNbr === arritem.parentId) {
              arritem.children = []
              item.children.push(arritem)
              delete arr[arrindex]
            }
          })
          item.children.sort(this.sortFun("orderNum"))
        })
        newTree.forEach((items) => {
          items.children.forEach((item) => {
            arr.forEach((arritem, arrindex)=>{
              if (item.sequenceNbr === arritem.parentId) {
                item.children.push(arritem)
                delete arr[arrindex]
              }
            })
            item.children.sort(this.sortFun("orderNum"))
          })
        })
        return newTree
      },
      nameCheck(val){
        this.agencyCode = val
        let getData = {
          url: "/v1/privilege/agencymenu/menulist?agencyCode="+val,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          console.log(res)
          if(res.status === 200){
            if(!res.result){
              let url = '/v1/privilege/agencymenu/agencyMenuAdd'
              let postData = {
                url: url,
                data: {
                  format: {
                    agencyCode:val,
                    createUserId: sessionStorage.getItem("userId"),
                    recUserId: sessionStorage.getItem("userId")
                  },
                  value: TIKA_RBAC
                }
              }
              ApiPost(postData, URL_POST).then((resPost)=>{
                if(resPost.status === 200){
                  this.$refs.treeMenu.setCheckedKeys([])
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
                tempDataB = res.result.menuSequenceNbr.split(',')
              }
              this.$refs.treeMenu.setCheckedKeys(tempDataB)
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
        tempList = this.$refs.treeMenu.getCheckedKeys()
        tempList.push(md5Data)
        tempList.push(a)
        let menuList = tempList.join(',')
        let url = '/v1/privilege/agencymenu/menuupdate/'+ this.agencyCode
        let postData = {
          url: url,
          data: {
            format: {
              menuSequenceNbr: menuList,
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

