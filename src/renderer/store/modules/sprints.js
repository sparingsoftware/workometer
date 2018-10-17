import uniqBy from 'lodash.uniqby'
import service from '@/service'

const state = {
  selectedSprint: null,
  sprints: []
}

const mutations = {
  setSelectedSprint (state, sprint) {
    state.selectedSprint = sprint
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
    const boardId = rootState.boards.selectedBoard
    commit('setSelectedSprint', null)
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
