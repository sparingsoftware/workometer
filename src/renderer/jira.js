import JiraClient from 'jira-connector'
import store from '@/store'
import axios from 'axios'

const auth = store.state.login.basic_auth
const host = store.state.login.host

const jiraClient = new JiraClient({
  ...auth && { basic_auth: auth },
  host
})

axios.defaults.headers.common['X-Atlassian-Token'] = 'nocheck'
axios.defaults.headers.post['Content-Type'] = 'application/json'

jiraClient.makeRequest = function (options, callback, successString) {
  options.data = options.body
  options.params = options.qs
  options.url = options.uri
  if (this.oauthConfig) {
    options.oauth = this.oauthConfig
  } else if (this.basic_auth) {
    if (this.basic_auth.base64) {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['Authorization'] = 'Basic ' + this.basic_auth.base64
    } else {
      store.dispatch('logout')
    }
  }
  return axios(options).then(res => res.data)
}
export default jiraClient
