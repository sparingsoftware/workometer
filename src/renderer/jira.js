import JiraClient from 'jira-connector'
import store from '@/store'

const auth = store.state.login.basic_auth
const host = store.state.login.host

export default new JiraClient({
  ...auth && { basic_auth: auth },
  host
})
