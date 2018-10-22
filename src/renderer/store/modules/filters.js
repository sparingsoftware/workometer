import deburr from 'lodash.deburr'

const state = {
  query: '',
  statuses: [],
  taskTypes: []
}

const mutations = {
  setFilterQuery (state, query) {
    state.query = query
  },
  setStatusesFilter (state, statuses) {
    state.statuses = statuses
  },
  setTaskTypeFilter (state, taskTypes) {
    state.taskTypes = taskTypes
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

const filterByTaskTypes = types => issue => {
  return types.length
    ? types.includes(issue.fields.issuetype.name)
    : true
}

const getters = {
  getFilteredIssues (state, getters, rootState, rootGetters) {
    const issues = rootGetters['issues/getIssues']
    return issues.filter(filterByQuery(state.query))
      .filter(filterByStatuses(state.statuses))
      .filter(filterByTaskTypes(state.taskTypes))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
