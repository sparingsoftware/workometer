import uniqBy from 'lodash.uniqby'
import service from '@/service'

const state = {
  selectedSprintId: null,
  sprints: []
}

const mutations = {
  setSelectedSprintId (state, sprintId) {
    state.selectedSprintId = sprintId
  },
  pushSprints (state, sprints) {
    state.sprints = uniqBy([...state.sprints, ...sprints], s => s.name)
  },
  setSprints (state, sprints) {
    state.sprints = sprints
  }
}

const actions = {
  fetchSprints ({ commit, dispatch, rootState }) {
    const backlog = { name: 'Backlog', id: null }
    const boardId = rootState.boards.selectedBoardId
    if (!boardId) return
    commit('setSelectedSprintId', null)
    service.getSprintsForBoard(boardId).then(sprints => {
      commit('pushSprints', [
        backlog,
        ...sprints.filter(sprint => sprint.state === 'active')
      ])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
