// import Vue from 'vue'

const state = {
  trackedIssue: null,
  trackingStartTime: null
}

const mutations = {
  startIssueTracking (state, issue) {
    state.trackedIssue = issue
  }
}

const actions = {
  stopTracking ({ commit, dispatch, rootState }) {
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
