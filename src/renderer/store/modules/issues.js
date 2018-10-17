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
  async fetchIssuesForBoard ({ commit }, id) {
    const issues = await service.getIssuesForBacklog(id)
    commit('setIssuesForBoard', { id, issues })
  },
  async fetchIssuesForSprint ({ commit }, id) {
    const issues = await service.getIssuesForSprint(id)
    commit('setIssuesForSprint', { id, issues })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
