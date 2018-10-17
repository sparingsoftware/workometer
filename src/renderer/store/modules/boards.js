import uniqBy from 'lodash.uniqby'
import service from '@/service'

const state = {
  selectedBoard: null,
  boards: []
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
  fetchBoards ({commit, dispatch}, payload) {
    service.getAllBoards(
      {type: 'scrum', ...payload}
    ).then(boards => {
      commit('pushBoards', boards)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
