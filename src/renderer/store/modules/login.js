import service from '@/service'

const state = {
  basic_auth: null
}

const getters = {
  isUserAuth (state) {
    return !!state.basic_auth
  }
}

const mutations = {
  setBasicAuth (state, payload) {
    state.basic_auth = payload
  }
}

const actions = {
  async login ({ commit }, creds) {
    await service.login(creds)
    commit('setBasicAuth', creds)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
