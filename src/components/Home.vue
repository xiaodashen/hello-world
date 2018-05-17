<template>
  <el-row class="container">
    <el-col :span="24" class="main">
      <aside>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          theme="dark"
          unique-opened
          router>
          <menu-tree :nodes="nodes"></menu-tree>
        </el-menu>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="header">
            <el-row >
                <el-col :span="24">
                  <el-breadcrumb separator="/" style="line-height: 18px; font-size: 15px;padding: 10px;">
                    <el-breadcrumb-item>{{agencyCode}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{agencyName}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{loginCode}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                &nbsp;
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="outLogin">退出登录</el-button>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24" class="breadcrumb-container">
            <el-breadcrumb separator="/"  class="title">
              <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="item.name">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>

          <el-col :span="24" class="content-wrapper">
            <transition>
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import MenuTree from '@/components/MenuTree'
  import MenuUtils from '@/api/MenuUtils'
  export default {
    data() {
      return {
//        nodes: this.$router.options.routes
        nodes: [],
        agencyCode: sessionStorage.getItem('agencyCode'),
        agencyName: sessionStorage.getItem('agencyName'),
        loginCode: sessionStorage.getItem('userCode')
      }

    },
    created() {
      //这里没有直接使用this.$router.options.routes，是因为addRoute的路由规则，在这里this.$router.options.routes获取不到
      //有兴趣的可以看一下源码，是为什么获取不到，但是却又有规则了
      //另外在开发的时候，可能由于是热部署，也会不断重复的给nodes添加元素，造成导航条有重复的，简单解决，可以设置一个开关
      let data = JSON.parse(window.sessionStorage.getItem('user'))
      let routers = []
      MenuUtils(routers,data)
      this.nodes = routers
      let isLoadNodes = sessionStorage.getItem('isLoadNodes')
      if (!isLoadNodes) {
        sessionStorage.setItem('isLoadNodes', true)
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleopen() {
        //console.log('handleopen');
      },
      handleclose() {
        //console.log('handleclose');
      },
      handleselect: function(a, b) {
      },
      outLogin(){
        window.location.href = '#/login'
      }
    },
    mounted() {

    },
    components: {
      MenuTree
    }
  }

</script>

<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    background: #f3f4f6;
    .main {
      background: #1f2d3d;
      position: absolute;
      top: 0px;
      bottom: 0px;
      aside {
        width: 230px;
        .login {
          padding-top: 20px;
          img {
            width: 100px;
            height: 90px;
            margin: 0 25%;
          }
        }
      }
      .content-container {
        background: #f3f4f6;
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        left: 230px;
        .header {
          height: 100px;
          width: 100%;
          line-height: 60px;
          background: #fff;
          color: #c0ccda;
          .logo {
            font-size: 22px;
            .txt {
              color: #20a0ff
            }
          }
        }
        .breadcrumb-container {
          /*width: 70%;*/
          margin-top: 15px;
          background: #fff;
          margin-left: 10px;
          height: 50px;
          .title {
            color: #475669;
            font-size: 15px;
            margin-left: 20px;
            margin-top: 20px;
          }
        }
        .content-wrapper {
          width: 100%;
          height: 750px;
          margin-top: 15px;
          margin-bottom: 0px;
          margin-left: 10px;
          background-color: #f3f4f6;
          box-sizing: border-box;
          overflow-y: scroll;
        }
      }
    }
  }
</style>
