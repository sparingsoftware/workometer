import service from '@/service'
import router from '@/router'
import Vue from 'vue'

const state = {
  basic_auth: null,
  host: 'panowie.atlassian.net',
  userDetails: null
}

const getters = {
  isUserAuth (state) {
    return state.basic_auth && state.basic_auth.base64
  }
}

const mutations = {
  setBasicAuth (state, payload) {
    state.basic_auth = {
      base64: btoa(`${payload.username}:${payload.password}`)
    }
  },
  setUserDetails (state, details) {
    state.userDetails = details
  },
  removeUserData (state) {
    state.userDetails = null
    state.basic_auth = null
  }
}

const actions = {
  async login ({ commit, dispatch }, creds) {
    await service.login(creds)
    Vue.jira.basic_auth = {
      base64: btoa(`${creds.username}:${creds.password}`)
    }
    commit('setBasicAuth', creds)
  },
  async logout ({ commit, dispatch, rootState }) {
    commit('removeUserData')
    commit('boards/clearBoards')
    commit('sprints/clearSprints')
    commit('issues/clearIssues')
    router.push({ name: 'login' })
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
