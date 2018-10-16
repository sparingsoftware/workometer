import Vue from 'vue'

const state = {
  issuesForSprint: {},
  issuesForBoard: {}
}

const mutations = {
  SET_ISSUES_FOR_BOARD (state, payload) {
    Vue.set(state.issuesForBoard, payload.id, payload.issues)
  },
  SET_ISSUES_FOR_SPRINT (state, payload) {
    Vue.set(state.issuesForSprint, payload.id, payload.issues)
  }
}

const actions = {
  async fetchIssues ({commit, dispatch, rootState}) {
    const partialIssues = []
    let lastPageFetched = false
    let startAt = 0
    const selectedSprint = rootState.boards.selectedSprint
    const paramId = selectedSprint ? {sprintId: selectedSprint} : {boardId: rootState.boards.selectedBoard}

    while (!lastPageFetched) {
      const payload = {startAt, maxResults: 500, ...paramId}
      const response = selectedSprint
        ? await Vue.jira.sprint.getSprintIssues(payload)
        : await Vue.jira.board.getIssuesForBacklog(payload)
      partialIssues.push(...response.issues)
      startAt = response.startAt + response.maxResults
      lastPageFetched = startAt >= response.total
    }

    if (selectedSprint) {
      commit('SET_ISSUES_FOR_SPRINT', {id: paramId.sprintId, issues: partialIssues})
    } else {
      commit('SET_ISSUES_FOR_BOARD', {id: paramId.boardId, issues: partialIssues})
    }
  }
}

export default {
  state,
  mutations,
  actions
}
