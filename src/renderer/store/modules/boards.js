import keyBy from 'lodash.keyby'
import mapValues from 'lodash.mapvalues'
import service from '@/service'

const state = {
  selectedBoardId: null,
  boards: [],
  statusesMap: {}
}

const mutations = {
  setBoards (state, boards) {
    state.boards = boards
  },
  setSelectedBoard (state, boardId) {
    state.selectedBoardId = boardId
  },
  setStatusesMap (state, statuses) {
    const statusesMap = keyBy(statuses, 'name')
    state.statusesMap = mapValues(statusesMap, 'statuses')
  }
}

const actions = {
  async fetchBoards ({ commit, dispatch }) {
    dispatch('wait/start', 'boardsLoading', { root: true })
    const boards = await service.getAllBoards({ type: 'scrum' })
    commit('setBoards', boards)
    dispatch('wait/end', 'boardsLoading', { root: true })
  },
  async fetchStatusesForSelectedBoard ({ commit, state }) {
    const selectedBoard = state.boards.find(board => board.id === state.selectedBoardId)
    const projectId = selectedBoard.location.projectId
    const statuses = await service.getStatuses(projectId)
    commit('setStatusesMap', statuses)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
