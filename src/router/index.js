import Vue from 'vue'
import Router from 'vue-router'
import HelloEmit from '@/components/HelloEmit'
import login from '@/components/login/login'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      hidden: true,
      component: login
    },
    {
      path: '/',
      hidden: true,
      redirect: '/login'
    },
    {
      path: '*',
      name: 'error',
      hidden: true,
      component: HelloEmit
    }
  ]
})
