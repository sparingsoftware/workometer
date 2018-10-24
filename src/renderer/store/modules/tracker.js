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
  saveWorklog ({commit, state}, trackingStopTime) {
    trackingStopTime = trackingStopTime || moment()
    const timeSpentSeconds = trackingStopTime.diff(state.trackingStartTime, 'seconds')
    return Vue.jira.issue.addWorkLog({
      issueId: state.issueTracked.id,
      worklog: {
        started: state.trackingStartTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        timeSpentSeconds: timeSpentSeconds
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
