<template>
    <div class="content-right" @keyup.up="keyupUp"  @keyup.dowm="keyupDown">
      <div class="content-text">
        <div class="table-style">
          <div class="search">
            <div class="top-line">
              <el-input placeholder="一级节点"></el-input>
              <el-input placeholder="行业"></el-input>
              <el-input placeholder="节点名称"></el-input>
              <el-input placeholder="全部收齐"></el-input>
              <el-button type="primary" style="msrgin-left: 15px" icon="plus" @click="addTreeFirst">新建根节点</el-button>
            </div>
          </div>
          <div class="el-tree-out">
            <div class="icon-style">
              <el-button type="primary" icon="plus" @click="addTreeNode"></el-button>
              <el-button type="primary" icon="close" @click="deleteNode"></el-button>
              <el-button type="primary" icon="arrow-up" @click="upNode"></el-button>
              <el-button type="primary" icon="arrow-down" @click="downNode"></el-button>
            </div>
            <div class="clear"></div>
            <keep-alive>
              <el-tree
                ref="roleTree"
                :data="roleTreeData"
                :props="defaultProps"
                :highlight-current="true"
                accordion
                @node-click="handleNodeClick"
                node-key="sequenceNbr"
                :expand-on-click-node="false"
                :default-expanded-keys='defaultExamTreeKeysMenu'></el-tree>
            </keep-alive>
          </div>
        </div>
        <div class="formRight" v-show = "showTreeNo">
          <el-form :model="roleTreeFormPost" ref="roleTreeFormPost" label-width="100px" class="demo-dynamic" v-if="postOrPut==='post'">
            <el-form-item prop="menuTitle" label="权限名称:">
              <el-input v-model="roleTreeFormPost.menuTitle"></el-input>
            </el-form-item>
            <el-form-item prop="menuLevel" label="权限级别:">
              <el-input v-model="roleTreeFormPost.menuLevel" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item
              prop="menuType"
              label="权限类别:">
              <el-select v-model="roleTreeFormPost.menuType" placeholder="请选择权限类别">
                <el-option
                  v-for="item in menuType_STATUES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="menuName" label="权限地址:">
              <el-input v-model="roleTreeFormPost.menuName"></el-input>
            </el-form-item>


            <el-form-item prop="description" label="备注:">
              <el-input v-model="roleTreeFormPost.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('roleTreeFormPost')">保存</el-button>
              <el-button @click="resetForm('roleTreeFormPost')">取消</el-button>
            </el-form-item>
          </el-form>
          <el-form :model="roleTreeFormPut" ref="roleTreeFormPut" label-width="100px" class="demo-dynamic" v-if="postOrPut==='put'">
            <el-form-item prop="menuTitle" label="权限名称:">
              <el-input v-model="roleTreeFormPut.menuTitle"></el-input>
            </el-form-item>
            <el-form-item prop="menuLevel" label="权限级别:">
              <el-input v-model="roleTreeFormPut.menuLevel" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item
              prop="menuType"
              label="权限类别:">
              <el-select v-model="roleTreeFormPost.menuType" placeholder="请选择权限类别">
                <el-option
                  v-for="item in menuType_STATUES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="menuName" label="权限地址:">
              <el-input v-model="roleTreeFormPut.menuName"></el-input>
            </el-form-item>


            <el-form-item prop="description" label="备注:">
              <el-input v-model="roleTreeFormPut.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('roleTreeFormPut')">保存</el-button>
              <el-button @click="resetForm('roleTreeFormPut')">取消</el-button>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>

</template>


<script>
  import { ApiGet, ApiDel, ApiPost } from 'api/recommand'
  import { URL_GET, URL_DEL, URL_POST, URL_PUT, TIKA_RBAC } from 'api/config'
  import { getQiNiuToken, upQiNiuFile, levelMap } from 'api/comFunction'
  export default {
    data() {
      return {
        roleTreeData: [],
        defaultProps: {
          children: 'childlist',
          label: 'menuTitle'
        },
        roleTreeFormPost: {
          menuTitle:'',
          menuLevel:'',
          menuType: 'DIRECTORY',
          menuName: '',
          description: ''
        },
        roleTreeFormPut: {
          menuTitle:'',
          menuLevel:'',
          menuType: '',
          menuName: '',
          description: ''
        },

        menuType_STATUES: [{
          value: 'DIRECTORY',
          label: '目录'
        }, {
          value: 'MENU',
          label: '菜单'
        }],

        postOrPut: '',
        showTreeNo: false,

        highlight: true,
        defaultExamTreeKeysMenu: []

      }
    },
    mounted() {
      this._getRoleTreeData()
    },
    methods: {
      _getRoleTreeData(){
        let getData = {
          url: "/v1/privilege/menu/menus",
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            this.roleTreeData = this._menuComp(res.result,"ROOT")
          }else if(res.status!==401){
            console.log('权限树获取数据出现错误：'+res.message)
            return
          }
        })
      },

      addTreeFirst(){
        this.postOrPut = 'post'
        this.showTreeNo =true
        this.roleTreeFormPost.menuLevel = '一级'
        this.addTreeFirst = 'first'
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
            item.childlist = []
            newTree.push(item)
            delete arr[index]
          }
        })
        newTree.sort(this.sortFun("orderNum"))
        newTree.forEach((item) => {
          arr.forEach((arritem, arrindex)=>{
            if (item.sequenceNbr === arritem.parentId) {
              arritem.childlist = []
              item.childlist.push(arritem)
              delete arr[arrindex]
            }
          })
          item.childlist.sort(this.sortFun("orderNum"))
        })
        newTree.forEach((items) => {
          items.childlist.forEach((item) => {
            arr.forEach((arritem, arrindex)=>{
              if (item.sequenceNbr === arritem.parentId) {
                item.childlist.push(arritem)
                delete arr[arrindex]
              }
            })
            item.childlist.sort(this.sortFun("orderNum"))
          })
        })
        return newTree
      },
      deleteNode(){
        this.postOrPut='post'
        let url = ''

        url = "/v1/privilege/menu/" + this.sequrenceNbr //待确认
        let getData = {
          url: url,
          value: TIKA_RBAC
        }
        ApiDel(getData, URL_DEL).then((res)=>{
          console.log('====del=============')
          console.log(res)
          if(res.status === 200){
            let num = this.levelMap.length
            if(num === 1){
              this.roleTreeData.splice(this.levelMap[0],1)
            }
            if(num === 2){
              this.roleTreeData[this.levelMap[0]].childlist.splice(this.levelMap[1],1);
            }
            if(num === 3){
              this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist.splice(this.levelMap[2],1);
            }
          }else if(res.status!==401){
            console.log('删除节点信息出现错误：'+res.message)
            return
          }
        })


      },
      addTreeNode(){
        this.postOrPut='post'
        if(this.showTreeNo === true && this.addTreeFirst === 'first'){
          this.$refs['roleTreeFormPost'].resetFields()

        }
        this.addTreeFirst = ''
        if(!this.levelMap){
          alert('请选择节点！！')
          return
        }
        if(this.levelMap.length>=3){
          alert('只能添加三级节点！！')
          return
        }
        this.showTreeNo = true
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.onSubmitApi()
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      onSubmitApi(){
        if(this.postOrPut === 'post'){
          let format = {}
          if(this.roleTreeFormPost.menuLevel==='一级'){
            format.menuLevel = 0
            format.orderNum = this.roleTreeData.length+1
            this.parentId = "ROOT"
          }
          if(this.roleTreeFormPost.menuLevel==='二级'){
            format.menuLevel = 1
            format.orderNum = this.roleTreeData[this.levelMap[0]].childlist.length+1
          }
//          if(this.roleTreeFormPost.menuLevel==='三级'){
//            format.menuLevel = 2
//            format.orderNum = this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist.length+1
//          }
          format.menuTitle = this.roleTreeFormPost.menuTitle
          format.menuType = this.roleTreeFormPost.menuType
          format.menuName = this.roleTreeFormPost.menuName
          format.description = this.roleTreeFormPost.description
          format.parentId = this.parentId
          format.createUserId = sessionStorage.getItem("userId")
          let postData = {
            url: '/v1/privilege/menu/create',
            data: {
              format: format,
              value: TIKA_RBAC
            }
          }
          ApiPost(postData, URL_POST).then((res) => {
            if(res.status === 200){
              if(this.addTreeFirst === 'first'){
                delete res.result.childlist
                res.result.childlist = []
                this.roleTreeData.push(res.result)
              }else{
                if(this.levelMap.length === 1){
                  this.defaultExamTreeKeysMenu[0] = res.result.sequenceNbr
                  delete res.result.childlist
                  res.result.childlist = []
                  this.roleTreeData[this.levelMap[0]].childlist.push(res.result)
                }else if(this.levelMap.length === 2){
                  this.defaultExamTreeKeysMenu[0] = res.result.sequenceNbr
                  this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist.push(res.result)
                }else{
                  alert('无添加信息！！')
                  return
                }
              }

              this.resetForm('roleTreeFormPost')
            }else if(res.status !== 401){
              alert('添加节点失败！！')
              this.resetForm('roleTreeFormPost')
              return
            }
          })
        }else if(this.postOrPut === 'put'){
          let format ={}
          format.menuTitle = this.roleTreeFormPut.menuTitle
          format.menuType = this.roleTreeFormPut.menuType
          format.menuName = this.roleTreeFormPut.menuName
          format.description = this.roleTreeFormPut.description
          format.recUserId = sessionStorage.getItem("userId")
          let url ='/v1/privilege/menu/' + this.sequrenceNbr
          let putData = {
            url: url,
            data: {
              format: format,
              value: TIKA_RBAC
            }
          }
          ApiPost(putData, URL_PUT).then((res) => {
            if(res.status === 200){
              if(this.levelMap.length === 1){
                this.roleTreeData[this.levelMap[0]].menuTitle=res.result.menuTitle
                this.roleTreeData[this.levelMap[0]].menuType=res.result.menuType
                this.roleTreeData[this.levelMap[0]].menuName=res.result.menuName
                this.roleTreeData[this.levelMap[0]].description=res.result.description
              }
              if(this.levelMap.length === 2){
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].menuTitle=res.result.menuTitle
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].menuType=res.result.menuType
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].menuName=res.result.menuName
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].description=res.result.description
              }
              if(this.levelMap.length === 3){
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist[this.levelMap[2]].menuTitle=res.result.menuTitle
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist[this.levelMap[2]].menuType=res.result.menuType
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist[this.levelMap[2]].menuName=res.result.menuName
                this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].childlist[this.levelMap[2]].description=res.result.description
              }
              this.postOrPut === 'post'
              this.showTreeNo = false

            }else if(res.status!==401){
              alert('更改节点失败！！')
              this.resetForm('roleTreeFormPut')
              return
            }
          })
        }
      },
      handleNodeClick(clickData,node,nodeGroup) {
        if(!clickData.child){
          delete clickData.child
          clickData.child = []
        }
        console.log(clickData)
//单双击判断
        let sequrenceNbr = clickData.sequenceNbr
        let timeData = new Date().getTime()
        let sunTime = timeData - this.startTime
        let temp = false
        if(sequrenceNbr === this.sequrenceNbr){
          temp = true
        }
        this.startTime = timeData
        if(sunTime<1000 && temp){ //间隔 内容判断是否是单双击
          this.postOrPut='put'
          if(clickData.menuLevel === 0){
            this.roleTreeFormPut.menuLevel = '一级'
          }else if(clickData.menuLevel === 1){
            this.roleTreeFormPut.menuLevel = '二级'
          }else if(clickData.menuLevel === 2){
            this.roleTreeFormPut.menuLevel = '三级'
          }
          this.roleTreeFormPut.menuTitle = clickData.menuTitle
          this.roleTreeFormPut.menuType = clickData.menuType

          this.roleTreeFormPut.menuName = clickData.menuName
          this.roleTreeFormPut.description = clickData.description
          this.roleTreeFormPut.menuTitle = clickData.menuTitle


          this.showTreeNo = true
        }else{
          this.start = 0
        }

        this.sequrenceNbr = clickData.sequenceNbr
        this.levelMap=[]
        this.levelMap = levelMap(node, this.roleTreeData, this.sequrenceNbr, 'childlist')



        if(this.levelMap.length === 1){
          this.parentId = this.roleTreeData[this.levelMap[0]].sequenceNbr
          this.roleTreeFormPost.menuLevel = '二级'
        }
        if(this.levelMap.length === 2){
          this.parentId = this.roleTreeData[this.levelMap[0]].childlist[this.levelMap[1]].sequenceNbr
          this.roleTreeFormPost.menuLevel = '三级'
        }

      },
      resetForm(formName){
        this.showTreeNo = false
        this.postOrPut = 'post'
        this.$refs[formName].resetFields()
      },

      keyupUp(){
        this.upNode()
      },
      upNode(){
        if(!this.levelMap) {
          alert('请选择节点！！')
          return
        }
        this.defaultExamTreeKeysMenu=[]
        this.defaultExamTreeKeysMenu.push(this.sequrenceNbr)
        let levelMapLength = this.levelMap.length
        if(levelMapLength ===1){
          let levelMap0 = this.levelMap[0]
          if( levelMap0===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let format ={}
            format.parentId = this.roleTreeData[levelMap0].sequenceNbr+','+this.roleTreeData[levelMap0-1].sequenceNbr
            format.orders = (this.roleTreeData[levelMap0].orderNum-1) +','+(this.roleTreeData[levelMap0-1].orderNum+1)
            format.recUserId = sessionStorage.getItem("userId")
            let url ='/v1/privilege/menu/order'
            let putData = {
              url: url,
              data: {
                format: format,
                value: TIKA_RBAC
              }
            }
            ApiPost(putData, URL_PUT).then((res) => {
              if(res.status === 200){
                let temp = this.roleTreeData[levelMap0]
                this.roleTreeData[levelMap0].orderNum = this.roleTreeData[levelMap0].orderNum-1
                this.roleTreeData[levelMap0-1].orderNum = this.roleTreeData[levelMap0-1].orderNum+1
                this.roleTreeData[levelMap0] = this.roleTreeData[levelMap0-1]
                this.roleTreeData[levelMap0-1] = temp
                let changeData = []
                changeData = this.roleTreeData
                this.roleTreeData=[]
                changeData.forEach(res=>{
                  this.roleTreeData.push(res)
                })
                this.levelMap[0] = this.levelMap[0] - 1
              }else if(res.status !== 401){
                alert(res.message)
                return
              }
            })

          }
        }
        if(levelMapLength ===2){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]

          if( levelMap1===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let format ={}
            format.parentId = this.roleTreeData[levelMap0].childlist[levelMap1].sequenceNbr+','+this.roleTreeData[levelMap0].childlist[levelMap1-1].sequenceNbr
            format.orders = (this.roleTreeData[levelMap0].childlist[levelMap1].orderNum-1) +','+(this.roleTreeData[levelMap0].childlist[levelMap1-1].orderNum+1)
            format.recUserId = sessionStorage.getItem("userId")
            let url ='/v1/privilege/menu/order'
            let putData = {
              url: url,
              data: {
                format: format,
                value: TIKA_RBAC
              }
            }
            ApiPost(putData, URL_PUT).then((res) => {
              if(res.status === 200){
                let temp2 = {}
                temp2 = this.roleTreeData[levelMap0].childlist[levelMap1-1]

                this.roleTreeData[levelMap0].childlist[levelMap1].orderNum=this.roleTreeData[levelMap0].childlist[levelMap1].orderNum-1
                this.roleTreeData[levelMap0].childlist[levelMap1-1].orderNum=this.roleTreeData[levelMap0].childlist[levelMap1-1].orderNum+1

                this.roleTreeData[levelMap0].childlist[levelMap1-1] = this.roleTreeData[levelMap0].childlist[levelMap1]
                this.roleTreeData[levelMap0].childlist[levelMap1] = temp2
                let examTreeData2 = []
                examTreeData2 = this.roleTreeData
                this.roleTreeData = []
                examTreeData2.forEach(res=>{
                  this.roleTreeData.push(res)
                })
                this.levelMap[1] = this.levelMap[1] - 1
              }else if(res.status !== 401){
                alert(res.message)
                return
              }
            })
          }
        }
        if(levelMapLength ===3){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]
          let levelMap2 = this.levelMap[2]
          if( levelMap2===0 ){
            alert('已经是最上级了！！')
            return
          }else{
            let format ={}
            format.parentId = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].sequenceNbr+','+this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1].sequenceNbr
            format.orders = (this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum-1) +','+(this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1].orderNum+1)
            format.recUserId = sessionStorage.getItem("userId")
            let url ='/v1/privilege/menu/order'
            let putData = {
              url: url,
              data: {
                format: format,
                value: TIKA_RBAC
              }
            }
            ApiPost(putData, URL_PUT).then((res) => {
              if(res.status === 200){
                let temp3 = {}
                temp3 = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1]

                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum-1
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1].orderNum+1
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum-1
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1].orderNum+1
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2-1] = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2]
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2] = temp3
                let examTreeData2 = []
                examTreeData2 = this.roleTreeData
                this.roleTreeData = []
                examTreeData2.forEach(res=>{
                  this.roleTreeData.push(res)
                })
                this.levelMap[2] = this.levelMap[2] - 1
              }else if(res.status !== 401){
                alert(res.message)
                return
              }
            })
          }
        }

      },
      keyupDown(){
        this.downNode()
      },
      downNode(){
        if(!this.levelMap) {
          alert('请选择节点！！')
          return
        }
        let levelMapLength = this.levelMap.length
        this.defaultExamTreeKeysMenu=[]
        this.defaultExamTreeKeysMenu.push(this.sequrenceNbr)
        if(levelMapLength ===1){
          let levelMap0 = this.levelMap[0]
          let roleTreeData = this.roleTreeData.length-1
          if( levelMap0 === roleTreeData ){
            alert('已经是最下级了！！')
            return
          }else{
            let format ={}
            format.parentId = this.roleTreeData[levelMap0].sequenceNbr+','+this.roleTreeData[levelMap0+1].sequenceNbr
            format.orders = (this.roleTreeData[levelMap0].orderNum+1) +','+(this.roleTreeData[levelMap0+1].orderNum-1)
            format.recUserId = sessionStorage.getItem("userId")
            let url ='/v1/privilege/menu/order'
            let putData = {
              url: url,
              data: {
                format: format,
                value: TIKA_RBAC
              }
            }
            ApiPost(putData, URL_PUT).then((res) => {
              if(res.status === 200){
                let temp = this.roleTreeData[levelMap0]
                this.roleTreeData[levelMap0].orderNum = this.roleTreeData[levelMap0].orderNum+1
                this.roleTreeData[levelMap0+1].orderNum = this.roleTreeData[levelMap0+1].orderNum-1
                this.roleTreeData[levelMap0] = this.roleTreeData[levelMap0+1]
                this.roleTreeData[levelMap0+1] = temp
                let changeData = []
                changeData = this.roleTreeData
                this.roleTreeData=[]
                changeData.forEach(res=>{
                  this.roleTreeData.push(res)
                })
                this.levelMap[0] = this.levelMap[0] + 1
              }else if(res.status !== 401){
                alert(res.message)
                return
              }
            })
          }
        }
        if(levelMapLength ===2){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]
          let roleTreeData2 = this.roleTreeData[levelMap0].childlist.length -1
          if( levelMap1 === roleTreeData2 ){
            alert('已经是最下级了！！')
            return
          }else{
            let format ={}
            format.parentId = this.roleTreeData[levelMap0].childlist[levelMap1].sequenceNbr+','+this.roleTreeData[levelMap0].childlist[levelMap1+1].sequenceNbr
            format.orders = (this.roleTreeData[levelMap0].childlist[levelMap1].orderNum+1) +','+(this.roleTreeData[levelMap0].childlist[levelMap1+1].orderNum-1)
            format.recUserId = sessionStorage.getItem("userId")
            let url ='/v1/privilege/menu/order'
            let putData = {
              url: url,
              data: {
                format: format,
                value: TIKA_RBAC
              }
            }
            ApiPost(putData, URL_PUT).then((res) => {
              if(res.status === 200){
                let temp2 = {}
                temp2 = this.roleTreeData[levelMap0].childlist[levelMap1]
                this.roleTreeData[levelMap0].childlist[levelMap1].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].orderNum+1
                this.roleTreeData[levelMap0].childlist[levelMap1+1].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1+1].orderNum-1
                this.roleTreeData[levelMap0].childlist[levelMap1] = this.roleTreeData[levelMap0].childlist[levelMap1+1]
                this.roleTreeData[levelMap0].childlist[levelMap1+1] = temp2
                let examTreeData2 = []
                examTreeData2 = this.roleTreeData
                this.roleTreeData = []
                examTreeData2.forEach(res=>{
                  this.roleTreeData.push(res)
                })
                this.levelMap[1] = this.levelMap[1] + 1
              }else if(res.status !== 401){
                alert(res.message)
                return
              }
            })
          }
        }
        if(levelMapLength === 3){
          let levelMap0 = this.levelMap[0]
          let levelMap1 = this.levelMap[1]
          let levelMap2 = this.levelMap[2]
          let roleTreeData3 = this.roleTreeData[levelMap0].childlist[levelMap1].childlist.length -1
          this.defaultExamTreeKeysMenu.push(this.sequrenceNbr)
          if( levelMap2===roleTreeData3 ){
            alert('已经是最下级了！！')
            return
          }else{
            let format ={}
            format.parentId = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].sequenceNbr+','+this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2+1].sequenceNbr
            format.orders = (this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum+1) +','+(this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2+1].orderNum-1)
            format.recUserId = sessionStorage.getItem("userId")
            let url ='/v1/privilege/menu/order'
            let putData = {
              url: url,
              data: {
                format: format,
                value: TIKA_RBAC
              }
            }
            ApiPost(putData, URL_PUT).then((res) => {
              if(res.status === 200){
                let temp3 = {}
                temp3 = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2]
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2].orderNum+1
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2+1].orderNum = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2+1].orderNum-1
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2] = this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2+1]
                this.roleTreeData[levelMap0].childlist[levelMap1].childlist[levelMap2+1] = temp3
                let examTreeData2 = []
                examTreeData2 = this.roleTreeData
                this.roleTreeData = []
                examTreeData2.forEach(res=>{
                  this.roleTreeData.push(res)
                })
                this.levelMap[2] = this.levelMap[2] + 1
              }else if(res.status !== 401){
                alert(res.message)
                return
              }
            })
          }
        }
      }
    }
  }
</script>

<style>
  .search .el-input{
    width: 18%;
    display: inline-block;
  }

  .formRight .form-style{
    margin-top: 50px;
    margin-left: 5px;
  }

  .table-style .el-tree-out .icon{
    float: right;
    margin: 8px
  }
  .formRight .el-upload-dragger {
    height: 100%;
    width: 100%
  }
  .formRight .el-select {
    width: 100%
  }
  .formRight .el-form-item__label{
    width: 100px
  }
  .formRight .el-form-item__content{
    margin-left: 100px;
  }


  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #afe1f9;
  }
  /*.el-tree--highlight-current .el-tree-node.is-expanded.is-expanded>.el-tree-node__content {*/
  /*background-color: #b7d3e0;*/
  /*}*/
  /*.el-tree--highlight-current .el-tree-node.is-expanded>.el-tree-node__content {*/
  /*background-color: #b7d3e0;*/
  /*}*/



</style>

