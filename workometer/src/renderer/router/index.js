import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/temp',
      name: 'dashboard',
      component: require('@/components/DashboardPage/Index').default
    },
    {
      path: '/',
      name: 'login',
      component: require('@/components/LoginPage/Index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
