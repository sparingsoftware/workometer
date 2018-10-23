import Vue from 'vue'
import moment from 'moment'

const state = {
  issueTracked: null,
  trackingStartTime: null,
  elapsedTime: null
}

const mutations = {
  startIssueTracking (state, issue) {
    state.issueTracked = issue
    state.trackingStartTime = moment()
  },
  clearIssueTracked (state) {
    state.issueTracked = null
  },
  clearTrackingStartTime (state) {
    state.trackingStartTime = null
  },
  setElapsedTime (state, time) {
    state.elapsedTime = time
  }
}

const actions = {
  saveWorklog ({ commit, state }) {
    const differenceInSeconds = moment().diff(state.trackingStartTime, 'seconds')
    return Vue.jira.issue.addWorkLog({
      issueId: state.issueTracked.id,
      worklog: {
        started: state.trackingStartTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        timeSpentSeconds: differenceInSeconds
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
