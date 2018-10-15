import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: require('@/components/DashboardPage/Index').default
    },
    {
      path: '/login/',
      name: 'login',
      component: require('@/components/LoginPage/Index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.login.basic_auth) {
    next()
  } else {
    to.name === 'login' ? next() : next({name: 'login'})
  }
})

export default router
