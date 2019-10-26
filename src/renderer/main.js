import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import jiraClient from './jira'
import handleErrorsMixin from './mixins/handleErrors'
import locale from 'element-ui/lib/locale/lang/en'

import ElementUI from 'element-ui'
import 'font-awesome/css/font-awesome.css'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import VueWait from 'vue-wait'
import PreloaderBar from '@/components/preloaderBar'

import { ipcRenderer } from 'electron'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.jira = Vue.prototype.$jira = jiraClient

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })
Vue.use(VueWait)
Vue.component('PreloaderBar', PreloaderBar)

Vue.use(PerfectScrollbar)

Vue.mixin(handleErrorsMixin)

const getOrCreateEl = id => {
  let el = document.querySelector(`#${id}`)
  if (el) return el

  el = document.createElement('link')
  el.setAttribute('id', id)
  el.setAttribute('rel', 'stylesheet')
  el.setAttribute('type', 'text/css')
  document.querySelector('head').prepend(el)
  return el
}

const getPath = path => {
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
  return IS_DEVELOPMENT
    ? `/static${path}`
    : require('path').join(__static, path)
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  watch: {
    '$store.state.theme.theme': {
      immediate: true,
      handler (value) {
        const theme = getOrCreateEl('theme')
        theme.setAttribute('href', getPath(`/themes/theme-${value}/index.css`))

        const themeReset = getOrCreateEl('theme-reset')
        themeReset.setAttribute('href', getPath(`/themes/theme-${value}/reset.css`))
      }
    }
  },
  beforeCreate () {
    ipcRenderer.on('theme-change', (_, theme) => {
      store.commit('theme/setTheme', theme)
    })
  },
  template: '<App/>',
  wait: new VueWait({
    useVuex: true
  })
}).$mount('#app')
