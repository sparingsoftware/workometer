import JiraClient from 'jira-connector'
import store from '@/store'

const auth = store.state.login.basic_auth

export default new JiraClient({
  host: 'panowie.atlassian.net',
  ...auth && { basic_auth: auth }
})
