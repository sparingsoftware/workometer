import deburr from 'lodash.deburr'

const state = {
  query: ''
}

const mutations = {
  setFilterQuery (state, query) {
    state.query = query
  }
}

const filterByQuery = query => issue => {
  const deburredQuery = deburr(query).toLowerCase()
  return issue.searchableField.includes(deburredQuery)
}

const getters = {
  getFilteredIssues (state, getters, rootState, rootGetters) {
    const issues = rootGetters['issues/getIssues']
    return issues.filter(filterByQuery(state.query))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
