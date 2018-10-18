const state = {
  filters: {}
}

const getters = {
  getFilteredIssues (state, getters, rootState) {
    console.log(state, 'state')
    return rootState.issues
  }
}

export default {
  namespaced: true,
  state,
  getters
}
