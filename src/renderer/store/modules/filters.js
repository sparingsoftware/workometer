import deburr from 'lodash.deburr'

const state = {
  query: '',
  statuses: []
}

const mutations = {
  setFilterQuery (state, query) {
    state.query = query
  },
  setStatusesFilter (state, statuses) {
    state.statuses = statuses
  }
}

const filterByQuery = query => issue => {
  const deburredQuery = deburr(query).toLowerCase()
  return issue.searchableField.includes(deburredQuery)
}

const filterByStatuses = statuses => issue => {
  return statuses.includes(issue.fields.status.name)
}

const getters = {
  getFilteredIssues (state, getters, rootState, rootGetters) {
    const issues = rootGetters['issues/getIssues']
    return issues.filter(filterByQuery(state.query))
      .filter(filterByStatuses(state.statuses))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
