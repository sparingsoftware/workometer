import Vue from 'vue'

const state = {
  issuesForBoard: {}
}

const mutations = {
  SET_ISSUES_FOR_BOARD (state, payload) {
    console.log(payload, 'payload')
    Vue.set(state.issuesForBoard, payload.boardId, payload.issues)
  }
}

const actions = {
  async fetchIssues ({commit, dispatch}, boardId) {
    const partialIssues = []
    let lastPageFetched = false
    let startAt = 0
    while (!lastPageFetched) {
      const response = await Vue.jira.board.getIssuesForBacklog({boardId, startAt, maxResults: 500})
      partialIssues.push(...response.issues)
      const nextChunk = response.startAt + response.maxResults
      startAt = nextChunk
      console.log(nextChunk)
      console.log({boardId, issues: partialIssues}, 'bId, issues')
      lastPageFetched = nextChunk >= response.total
    }
    commit('SET_ISSUES_FOR_BOARD', {boardId, issues: partialIssues})
  }
}

export default {
  state,
  mutations,
  actions
}
