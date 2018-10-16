import Vue from 'vue'
import uniq from 'lodash.uniq'

const state = {
  boards: [],
  selectedBoard: null,
  selectedSprint: null
}

const mutations = {
  PUSH_BOARDS (state, boards) {
    state.boards = uniq([...state.boards, ...boards])
  },
  SET_SELECTED_BOARD (state, board) {
    state.selectedBoard = board
  },
  SET_SELECTED_SPRINT (state, sprintId) {
    state.selectedSprint = sprintId
  }
}

const actions = {
  fetchBoards ({ commit, dispatch }, payload) {
    return Vue.jira.board.getAllBoards({ type: 'scrum', ...payload }).then(response => {
      if (!response.isLast) {
        dispatch('fetchBoards', { startAt: response.maxResults + response.startAt })
      }
      commit('PUSH_BOARDS', response.values)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
