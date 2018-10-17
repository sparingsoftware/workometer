import Vue from 'vue'
import service from '@/service'

const state = {
  issuesForSprint: {},
  issuesForBoard: {}
}

const mutations = {
  setIssuesForBoard (state, payload) {
    Vue.set(state.issuesForBoard, payload.id, payload.issues)
  },
  setIssuesForSprint (state, payload) {
    Vue.set(state.issuesForSprint, payload.id, payload.issues)
  }
}

const actions = {
  async fetchIssuesForBoard ({ commit, rootState }) {
    const boardId = rootState.boards.selectedBoard
    const issues = await service.getIssuesForBacklog({
      boardId,
      maxResults: 500
    })
    commit('setIssuesForBoard', { id: boardId, issues })
  },
  async fetchIssuesForSprint ({ commit, rootState }) {
    const sprintId = rootState.sprints.selectedSprint
    const issues = await service.getIssuesForSprint({
      maxResults: 500,
      sprintId
    })
    commit('setIssuesForSprint', { id: sprintId, issues })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
