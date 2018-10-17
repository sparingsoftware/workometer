import Vue from 'vue'
import moment from 'moment'

const state = {
  issueTracked: null,
  trackingStartTime: null
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
  }
}

const actions = {
  stopIssueTracking ({ commit, dispatch, state }) {
    const differenceInSeconds = moment().diff(state.trackingStartTime, 'seconds')
    // TODO; return if difference under 60 sec
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
