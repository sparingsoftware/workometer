import JiraClient from 'jira-connector'
import store from '@/store'
import axios from 'axios'

const auth = store.state.login.basic_auth
const host = store.state.login.host

const jiraClient = new JiraClient({
  ...auth && { basic_auth: auth },
  host
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const status = error.response.status
  if (status === 401) {
    store.dispatch('logout')
  }
  return Promise.reject(error)
})


axios.defaults.headers.common['X-Atlassian-Token'] = 'nocheck'
axios.defaults.headers.post['Content-Type'] = 'application/json'

jiraClient.makeRequest = function (options, callback, successString) {
  options.data = options.body
  options.params = options.qs
  options.url = options.uri

  if (!options.headers) {
    options.headers = {}
  }
  const authorizationHeader = this.basic_auth && 'Basic ' + this.basic_auth.base64
  options.headers['Authorization'] = authorizationHeader

  return axios(options).then(res => res.data)
}
export default jiraClient
