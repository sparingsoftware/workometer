import service from '@/service'

const state = {
  basic_auth: null,
  host: 'panowie.atlassian.net',
  userDetails: null
}

const getters = {
  isUserAuth (state) {
    return !!state.basic_auth
  }
}

const mutations = {
  setBasicAuth (state, payload) {
    state.basic_auth = payload
  },
  setUserDetails (state, details) {
    state.userDetails = details
  }
}

const actions = {
  async login ({ commit, dispatch }, creds) {
    await service.login(creds)
    commit('setBasicAuth', creds)
  },
  async fetchUserDetails ({ commit }) {
    const details = await service.userDetails()
    commit('setUserDetails', details)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
