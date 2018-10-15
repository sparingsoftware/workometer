import Vue from 'vue'

const state = {
  boards: [],
  selectedBoard: null
}

const mutations = {
  PUSH_BOARDS (state, boards) {
    state.boards.push(...boards)
  },
  SET_SELECTED_BOARD (state, board) {
    state.selectedBoard = board
  }
}

const actions = {
  fetchBoards ({commit, dispatch}, payload) {
    return Vue.jira.board.getAllBoards({type: 'scrum', ...payload}).then(response => {
      if (!response.isLast) {
        dispatch('fetchBoards', {startAt: response.maxResults + response.startAt})
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