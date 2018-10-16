// import Vue from 'vue'

const state = {
  issueTracked: null,
  trackingStartTime: null
}

const mutations = {
  startIssueTracking (state, issue) {
    state.issueTracked = issue
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
