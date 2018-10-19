import Vue from 'vue'
import keyBy from 'lodash.keyby'
import mapValues from 'lodash.mapvalues'
import service from '@/service'

const state = {
  selectedBoardId: null,
  boards: [],
  statusesMap: {}
}

const mutations = {
  pushBoards (state, boards) {
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
  async fetchBoards ({ commit }) {
    const boards = await service.getAllBoards({ type: 'scrum' })
    commit('pushBoards', boards)
  },
  async fetchStatusesForSelectedBoard ({ commit, state }) {
    const selectedBoard = state.boards.find(board => board.id === state.selectedBoardId)
    const projectId = selectedBoard.location.projectId
    const statuses = await Vue.jira.project.getStatuses({ projectIdOrKey: projectId })
    commit('setStatusesMap', statuses)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
