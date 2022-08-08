export default {
  namespaced: true,
  state() {
    return {
      frontendUrls: {
        exam: null,
        ranking: null
      },
      backendUrls: {
        getContent: null,
        getExam: null,
        submitExam: null,
        getRanking: null,
      }
    }
  },
  getters: {},
  mutations: {
    setFrontendUrls(state, payload) {
      state.frontendUrls = payload
    },
    setBackendUrls(state, payload) {
      state.backendUrls = payload
    }
  },
  actions: {}
}
