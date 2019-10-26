const state = {
  theme: 'light'
}

const mutations = {
  setTheme (state, theme) {
    state.theme = theme
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
