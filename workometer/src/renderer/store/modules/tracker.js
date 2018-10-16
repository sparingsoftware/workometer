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
  setIssueTracked (state, issue) {
    state.issueTracked = issue
  },
  setTrackingStartTime (state, time) {
    state.trackingStartTime = time
  }
}

const actions = {
  stopIssueTracking ({ commit, dispatch, state }) {
    const differenceInSeconds = moment().diff(state.trackingStartTime, 'seconds')
    console.log({
        started: state.trackingStartTime.format('YYYY-MM-DDTHH:mm:ssZZ'),
        timeSpentSeconds: differenceInSeconds
      })
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
