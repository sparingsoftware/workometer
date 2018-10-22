import service from '@/service'

const state = {
  selectedSprintId: null,
  sprints: []
}

const mutations = {
  setSelectedSprintId (state, sprintId) {
    state.selectedSprintId = sprintId
  },
  setSprints (state, sprints) {
    state.sprints = sprints
  }
}

const actions = {
  fetchSprints ({ commit, rootState }) {
    const boardId = rootState.boards.selectedBoardId
    if (!boardId) return

    commit('setSelectedSprintId', null)
    commit('setSprints', [])

    service.getSprintsForBoard(boardId).then(sprints => {
      const activeSprints = sprints.filter(sprint => sprint.state === 'active')
      const backlog = { name: 'Backlog', id: null }
      commit('setSprints', [backlog, ...activeSprints])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
