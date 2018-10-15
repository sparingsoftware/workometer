import JiraClient from 'jira-connector'
import store from '@/store'

export default store.state.login.basic_auth ? new JiraClient({
  host: 'panowie.atlassian.net',
  basic_auth: store.state.login.basic_auth
}) : new JiraClient({
  host: 'panowie.atlassian.net'
})
