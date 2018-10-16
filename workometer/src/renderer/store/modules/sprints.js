import Vue from 'vue'
import uniqBy from 'lodash.uniqby'

const state = {
  selectedSprint: {},
  sprints: []
}

const mutations = {
  setSelectedSprint (state, sprint) {
    state.selectedSprint = sprint
  },
  pushSprints (state, sprints) {
    state.sprints = uniqBy([...state.sprints, ...sprints], s => s.name)
  }
}

const actions = {
  fetchSprints ({ commit, dispatch, rootState }) {
    const backlog = { name: 'Backlog', id: null }
    const boardId = rootState.boards.selectedBoard
    commit('setSelectedSprint', null)

    return Vue.jira.board.getSprintsForBoard({ boardId }).then(response => {
      if (!response.isLast) {
        dispatch('fetchSprints', { startAt: response.maxResults + response.startAt })
      }
      commit('pushSprints', [backlog, ...response.values.filter(sprint => sprint.state === 'active')])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
