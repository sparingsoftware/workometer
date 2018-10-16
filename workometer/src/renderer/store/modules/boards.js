import Vue from 'vue'
import uniqBy from 'lodash.uniqby'

const state = {
  boards: [],
  selectedBoard: null
}

const mutations = {
  pushBoards (state, boards) {
    state.boards = uniqBy([...state.boards, ...boards], b => b.id)
  },
  setSelectedBoard (state, board) {
    state.selectedBoard = board
  },
  setSelectedSprint (state, sprintId) {
    state.selectedSprint = sprintId
  }
}

const actions = {
  fetchBoards ({ commit, dispatch }, payload) {
    return Vue.jira.board.getAllBoards({ type: 'scrum', ...payload }).then(response => {
      if (!response.isLast) {
        dispatch('fetchBoards', { startAt: response.maxResults + response.startAt })
      }
      commit('pushBoards', response.values)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
