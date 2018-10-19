import Vue from 'vue'
import service from '@/service'
import deburr from 'lodash.deburr'

const state = {
  issuesForSprint: {},
  issuesForBoard: {}
}

const addSearchableField = issue => ({
  ...issue,
  searchableField: deburr(issue.fields.summary + issue.key).toLowerCase()
})

const mutations = {
  setIssuesForBoard (state, payload) {
    const issues = payload.issues.map(addSearchableField)
    Vue.set(state.issuesForBoard, payload.id, issues)
  },
  setIssuesForSprint (state, payload) {
    const issues = payload.issues.map(addSearchableField)
    Vue.set(state.issuesForSprint, payload.id, issues)
  }
}

const getters = {
  getIssues (state, getters, rootState) {
    const issues = rootState.sprints.selectedSprintId
      ? state.issuesForSprint[rootState.sprints.selectedSprintId]
      : state.issuesForBoard[rootState.boards.selectedBoardId]
    return issues || []
  }
}

const actions = {
  async fetchIssuesForBoard ({ commit }, id) {
    const issues = await service.getIssuesForBacklog(id)
    commit('setIssuesForBoard', { id, issues })
  },
  async fetchIssuesForSprint ({ commit }, id) {
    const issues = await service.getIssuesForSprint(id)
    commit('setIssuesForSprint', { id, issues })
  },
  setIssueStatus ({ commit }, {issue, status}) {
    return service.setIssueStatus(issue, status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
