import moment from 'moment'
import service from '@/service'

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
  saveWorklog ({commit, state}, workedTime) {
    return service.addWorkLog(state.issueTracked.id, state.trackingStartTime, workedTime)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
