import keyBy from 'lodash.keyby'
import mapValues from 'lodash.mapvalues'
import service from '@/service'

const state = {
  selectedBoardId: null,
  boards: [],
  statusesMap: {},
  statuses: []
}

const mutations = {
  setBoards (state, boards) {
    state.boards = boards
  },
  setSelectedBoard (state, boardId) {
    state.selectedBoardId = boardId
  },
  setStatusesMap (state, statuses) {
    state.statuses = statuses
    const statusesMap = keyBy(statuses, 'name')
    state.statusesMap = mapValues(statusesMap, 'statuses')
  },
  clearBoards (state) {
    state.boards = []
    state.statusesMap = {}
    state.selectedBoardId = null
  }
}

const getters = {
  selectedProjectId (state, getters) {
    const selectedProject = getters.selectedProject
    return selectedProject && selectedProject.projectId
  },
  selectedProject (state) {
    const selectedBoard = state.boards.find(board => board.id === state.selectedBoardId)
    return selectedBoard && selectedBoard.location
  }
}

const actions = {
  async fetchBoards ({ commit, dispatch }) {
    dispatch('wait/start', 'boardsLoading', { root: true })
    const boards = await service.getAllBoards({ type: 'scrum' })
    commit('setBoards', boards)
    dispatch('wait/end', 'boardsLoading', { root: true })
  },
  async fetchStatusesForSelectedBoard ({ commit, state, getters }) {
    const statuses = await service.getStatuses(getters.selectedProjectId)
    commit('setStatusesMap', statuses)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
