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
  },
  clearSprints (state) {
    state.sprints = []
    state.selectedSprintId = null
  }
}

const actions = {
  fetchSprints ({ commit, rootState, dispatch }) {
    const boardId = rootState.boards.selectedBoardId
    if (!boardId) return
    commit('clearSprints')
    dispatch('wait/start', 'sprintsLoading', { root: true })
    service.getSprintsForBoard(boardId).then(sprints => {
      const activeSprints = sprints.filter(sprint => sprint.state === 'active')
      const backlog = { name: 'Backlog', id: null }
      commit('setSprints', [...activeSprints, backlog])
      if (activeSprints.length) {
        commit('setSelectedSprintId', activeSprints[0].id)
      }
      dispatch('wait/end', 'sprintsLoading', { root: true })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
