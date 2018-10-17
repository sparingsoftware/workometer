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
  async fetchBoards ({ commit }) {
    const boards = await service.getAllBoards({ type: 'scrum' })
    commit('pushBoards', boards)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
