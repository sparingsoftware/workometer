import deburr from 'lodash.deburr'

const state = {
  query: '',
  statuses: [],
  issueTypes: []
}

const mutations = {
  setFilterQuery (state, query) {
    state.query = query
  },
  setStatusesFilter (state, statuses) {
    state.statuses = statuses
  },
  setIssueTypeFilter (state, issueTypes) {
    state.issueTypes = issueTypes
  }
}

const filterByQuery = query => issue => {
  const deburredQuery = deburr(query).toLowerCase()
  return issue.searchableField.includes(deburredQuery)
}

const filterByStatuses = statuses => issue => {
  return statuses.length
    ? statuses.includes(issue.fields.status.name)
    : true
}

const filterByIssueTypes = types => issue => {
  return types.length
    ? types.includes(issue.fields.issuetype.name)
    : true
}

const getters = {
  getFilteredIssues (state, getters, rootState, rootGetters) {
    const issues = rootGetters['issues/getIssues']
    return issues.filter(filterByQuery(state.query))
      .filter(filterByStatuses(state.statuses))
      .filter(filterByIssueTypes(state.issueTypes))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
