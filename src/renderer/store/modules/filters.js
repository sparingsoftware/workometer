import deburr from 'lodash.deburr'
import intersection from 'lodash.intersection'

const state = {
  query: '',
  statuses: [],
  issueTypes: [],
  issueComponents: [],
  issueAssignee: null
}

const mutations = {
  clearFilters (state) {
    state.statuses = []
    state.issueTypes = []
    state.issueComponents = []
    state.issueAssignee = null
  },
  setFilterQuery (state, query) {
    state.query = query
  },
  setStatusesFilter (state, statuses) {
    state.statuses = statuses
  },
  setIssueTypeFilter (state, issueTypes) {
    state.issueTypes = issueTypes
  },
  setIssueComponentFilter (state, issueComponents) {
    state.issueComponents = issueComponents
  },
  setIssueAssigneeFilter (state, assigneeAccountId) {
    state.issueAssignee = assigneeAccountId
  }
}

const filterByQuery = query => issue => {
  const deburredQuery = deburr(query).toLowerCase()
  return issue.searchableField.includes(deburredQuery)
}

const filterByStatuses = statuses => issue => {
  return !statuses.length || statuses.includes(issue.fields.status.name)
}

const filterByTypes = types => issue => {
  return !types.length || types.includes(issue.fields.issuetype.name)
}

const filterByComponents = components => issue => {
  const issueComponents = issue.fields.components.map(component => component.name)
  return !components.length || intersection(components, issueComponents).length
}

const filterByAssignee = assigneeAccountId => issue => {
  return !assigneeAccountId ||
    (assigneeAccountId === 'unassigned' && !issue.fields.assignee) ||
    (issue.fields.assignee && issue.fields.assignee.accountId === assigneeAccountId)
}

const getters = {
  getFilteredIssues (state, getters, rootState, rootGetters) {
    const issues = rootGetters['issues/getIssues']
    return issues.filter(filterByQuery(state.query))
      .filter(filterByStatuses(state.statuses))
      .filter(filterByTypes(state.issueTypes))
      .filter(filterByComponents(state.issueComponents))
      .filter(filterByAssignee(state.issueAssignee))
  },
  filtersSet (state) {
    return state.statuses.length || state.issueTypes.length || state.issueAssignee
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
