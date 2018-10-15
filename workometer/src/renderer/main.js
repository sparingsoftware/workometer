import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import jiraClient from './jira'
import handleErrorsMixin from './mixins/handleErrors'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.jira = Vue.prototype.$jira = jiraClient
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
Vue.mixin(handleErrorsMixin)

new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
