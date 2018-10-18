import Vue from 'vue'
import deburr from 'lodash.deburr'

const state = {
  filters: {}
}

const mutations = {
  setFilterQuery (state, query) {
    Vue.set(state.filters, 'query', query)
  }
}

const getIssuesFilteredByQuery = (issues, filters) => {
  if (!filters.query) {
    return issues
  }

  const issueFound = issue => {
    const deburredQuery = deburr(filters.query).toLowerCase()
    return issue.searchableField.includes(deburredQuery)
  }

  return issues.filter(issueFound)
}

const getters = {
  getFilteredIssues (state, getters, rootState, rootGetters) {
    const filters = state.filters
    const allIssues = rootGetters['issues/getIssues']
    let filteredIssues = allIssues
    filteredIssues = getIssuesFilteredByQuery(filteredIssues, filters)
    return filteredIssues
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
