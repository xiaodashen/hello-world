<template>
  <div @keyup.13="keyupEnter">
    <div class="video_mask"></div>
    <div class="login">
      <h1>后台管理{{messageName}}</h1>
      <div class="layui-form">
        <div class="layui-form-item">
          <input class="layui-input loginId" placeholder="用户名" lay-verify="required" type="text" value="" autocomplete="off">
        </div>
        <div class="layui-form-item">
          <input class="layui-input password" placeholder="密码" lay-verify="required" type="password" value=""  autocomplete="off">
        </div>
        <button class="layui-btn login_btn"  @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { ApiPost, ApiGet} from '@/api/recommand'
  import { URL_POST, TIKA_WEB, URL_GET, TIKA_RBAC, LOAD_URL } from '@/api/config'
  import MenuUtils from '@/api/MenuUtils'
  var routers = []
  export default {
    name: 'login',
    data () {
      return {
        userMenu:[],
        url: '',
        role: '',
        messageName: '(平台)'
      }
    },
    mounted(){

     // this.baseUrl = "192.168.1.124:9000" // 124前端访问路径
     // this.baseUrl = "39.106.172.65:9000" //阿里云前端访问路径
     this.baseUrl = "localhost:8081"

     if(this.baseUrl !== window.location.host){  //平台
        this.url = '/v1/privilege/auth/super/idpasswordwd'
        this.role = 'super'
        this.messageName = "(平台)"
      }else{
        this.url = '/v1/agency/auth/agency/idpassword'
        this.role = 'agency'
        this.messageName = ""
      }
      console.log(this.url)
      console.log(window.location.host)
    },
    methods: {
      keyupEnter(){
        this.login()
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
      login(){
        this.loginId = $('.loginId').val().trim()
        this.password = $('.password').val()
        let format = Object.assign({}, {
          loginId: this.loginId,
          password: this.password,
          // agencyCode: "SUPER_ADMIN"
          // agencyCode: "4201001009"
          // agencyCode: "6101001006"
          // agencyCode: "6101001011"
          // agencyCode: "6101001004"
          agencyCode: "5201001015"
        })
        let postData = {
          url: this.url,
          data: {
            format: format,
            value: TIKA_WEB
          }
        }
        ApiPost(postData, URL_POST).then((res) => {
          console.log('res==================')
          console.log(res)
          if(res.status === 200) {
            sessionStorage.clear()
            sessionStorage.setItem("userId", res.result.loginInfo.userId)
            let resTempData = ''
            let resTemp=[]
            if('agency'===this.role){
              sessionStorage.setItem("agencyCode", res.result.userInfo.agencyCode)
              sessionStorage.setItem("agencyName", res.result.userInfo.agencyName)
              sessionStorage.setItem("roleId", res.result.userInfo.roleId)
              sessionStorage.setItem("userCode", this.loginId)
              if(!res.result.userRole){
                alert('权限信息获取错误！！')
                return
              }
              resTempData = eval('('+ res.result.userRole +')').result
              console.log(resTempData)
              if(''===resTempData || '[]'===resTempData ){
                alert('您尚未开通菜单权限，请联系管理员！！')
                return
              }

              resTemp = eval('('+ resTempData+')')
            }else if ('super'===this.role){
              sessionStorage.setItem("agencyCode", res.result.agencyCode)
              sessionStorage.setItem("agencyName", res.result.agencyName)
              // sessionStorage.setItem("roleId", res.result.agencyName)
              sessionStorage.setItem("userCode", this.loginId)
              resTemp = res.result.userRole
            } else {
              alert('机构用户类型有误')
              return;
            }

            this.userMenu = resTemp;
            resTemp.forEach((resUserMenu,index)=>{
              if(resUserMenu.menuType === 'DIRECTORY'){
                this.userMenu[index].leaf = false
              }else{
                this.userMenu[index].leaf = true
              }
            })
            let userMenuArr = this._menuComp(this.userMenu,"ROOT")//数据组装
            window.sessionStorage.setItem("user",JSON.stringify(userMenuArr))//
            MenuUtils(routers,userMenuArr)
            this.$router.addRoutes(routers)    //路由添加


            this.redirectTemp = []            //默认路由跳转
            this.generaRedirectArr(userMenuArr)
            let redirectTemp = this.redirectTemp[0].split(',')
            let redirectEnd = ''
            if(redirectTemp[1] === 'Home'){
              redirectEnd = redirectTemp[0]
            }else{
              redirectEnd = redirectTemp[1]
            }
            this.$router.push({'path': redirectEnd})
          }else if(res.status !== 401){
            alert(res.message)
            return
          }
        })
      },

      generaRedirectArr(data){
        data.forEach((item)=>{
          if(!item.leaf){
            this.generaRedirectArr(item.children)
          }else{
            let str= item.menuName+ "," +item.extend1
            this.redirectTemp.push(str)
          }
        })
      }
    }
  }
</script>

<style>
  body {
    overflow: hidden;
  }
  .login {
    height: 200px;
    width: 260px;
    padding: 20px;
    background-color: rgba(0,0,0,0.5);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -150px 0 0 -150px;
    z-index: 99;
  }
  form {
    display: block;
    margin-top: 0em;
  }
  .layui-form-item {
    margin-bottom: 15px;
    clear: both;
  }
  .login h1 {
    text-align: center;
    color: #fff;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .layui-input, .layui-textarea {
    display: block;
    width: 100%;
    padding-left: 10px;
  }
  .layui-input, .layui-select, .layui-textarea {
    height: 36px;
    line-height: 38px;
    line-height: 36px\9;
    border: 1px solid #e6e6e6;
    background-color: #fff;
    border-radius: 2px;
  }
  .form_code .code {
    position: absolute;
    right: 0;
    top: 1px;
    cursor: pointer;
  }
  img {
    display: inline-block;
    border: none;
  }
  .layui-btn, .layui-inline, img {
    vertical-align: middle;
  }
  .login_btn {
    width: 100%;
  }
  .layui-btn {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 18px;
    background-color: #009688;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    opacity: .9;
    filter: alpha(opacity=90);
  }
  .layui-input {
    display: block;
    width: 96%;
    padding-left: 10px;
  }
  button, input, optgroup, option, select, textarea {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    outline: 0;
  }
  blockquote, body, button, dd, div, dl, dt, form, h1, h2, h3, h4, h5, h6, input, li, ol, p, pre, td, textarea, th, ul {
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  .video_mask {
    width: 100%;
    height: 130%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 90;
    background-color: rgba(0,0,0,0.5);
  }

</style>


