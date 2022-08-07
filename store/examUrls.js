export default {
  namespaced: true,
  state() {
    return {
      frontEndUrls: {
        exam: null,
        result: null
      },
      backendUrls: {
        getExam: null,
        submitExam: null,
        getRanking: null,
      }
    }
  },
  getters: {},
  mutations: {},
  actions: {}
}
