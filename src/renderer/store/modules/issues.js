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
  },
  updateIssue (state, { oldIssue, newIssue }) {
    /* This is a state mutation! */ Object.assign(oldIssue, newIssue)
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
  async fetchIssuesForBoard ({ commit, dispatch }, id) {
    dispatch('wait/start', 'issuesLoading', { root: true })
    const issues = await service.getIssuesForBacklog(id)
    commit('setIssuesForBoard', { id, issues })
    dispatch('wait/end', 'issuesLoading', { root: true })
  },
  async fetchIssuesForSprint ({ commit }, id) {
    const issues = await service.getIssuesForSprint(id)
    commit('setIssuesForSprint', { id, issues })
  },
  async setIssueStatus ({ commit }, { issue, status }) {
    await service.setIssueStatus(issue.id, status.name)
    const updatedIssue = await service.getIssue({ issueId: issue.id })
    commit('updateIssue', { oldIssue: issue, newIssue: updatedIssue })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
