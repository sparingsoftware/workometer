import Vue from 'vue'

const state = {
  basic_auth: null
}

const getters = {
  isUserAuth (state) {
    return !!state.basic_auth
  }
}

const mutations = {
  SET_BASIC_AUTH (state, payload) {
    state.basic_auth = payload
  }
}

const actions = {
  login ({commit}, payload) {
    return Vue.jira.auth.login(payload).then(response => {
      Vue.jira.basic_auth = payload
      commit('SET_BASIC_AUTH', payload)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
