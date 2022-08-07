import moment from 'moment'

export default {
  namespaced: true,
  state() {
    return {
      content: {},
      exam: {},
      examQuestions: null,
      result: null,
      attended: false,
      submitted: false,
      timeOver: false,
      isResultAvailable: false,
      examConfig: {
        exam_id: null,
        exam_mode: null,
        totalQuestions: 0,
        strict: false,
        duration: null,
        available_at: null,
        start_time: null,
        end_time: null,
        result_publish_time: null,
      },
      userAnswers: [],
    }
  },
  getters: {
    selectedMcqs(state) {
      if (state.examQuestions && state.examQuestions.length) {
        const mcqs = state.examQuestions.filter((mcq) => mcq.user_answer)

        if (mcqs) return mcqs.map(({id}) => id)
        else return []
      } else return []
    }
  },
  mutations: {
    clearExam(state) {
      state.content = {}
      state.exam = {}
      state.examQuestions = null
      state.result = null
      state.attended = false
      state.timeOver = false
      state.submitted = false
      state.isResultAvailable = false
      state.examConfig = {
        exam_id: null,
        exam_mode: null,
        totalQuestions: 0,
        strict: false,
        duration: null,
        available_at: null,
        start_time: null,
        end_time: null,
        result_publish_time: null
      }
    },
    setExam(state, payload) {
      state.content = payload || null
      state.exam = payload?.exam || null
      state.timeOver = moment().isAfter(state.exam.end_time, 'seconds')

      let startTime = state.exam?.strict ? moment(state.exam?.start_time) : moment()
      let endTime = state.exam?.strict ? moment(state.exam?.start_time).add(state.exam?.duration || 0, 'minutes')
        : moment().add(state.exam?.duration || 0, 'minutes')

      if (state.exam.result && state.exam.result.start_time) {
        startTime = moment(state.exam.result.start_time)
        endTime = moment(state.exam.start_time).add(state.exam?.duration || 0, 'minutes')
      }

      let totalMcq = state.exam?.mcq_count || 0

      if (state.exam.mode === 'practice') totalMcq = state.exam?.total_questions || 0
      else totalMcq = state.exam?.total_questions > state.exam?.mcq_count ? state.exam?.mcq_count : state.exam?.total_questions

      state.examConfig = {
        exam_id: state.exam?.id || null,
        exam_mode: state.exam?.mode || null,
        duration: state.exam?.duration || 0,
        available_at: moment(payload?.available_at) || moment(),
        strict: state.exam?.strict,
        result_publish_time: moment(state.exam?.result_publish_time) || moment(),
        totalQuestions: totalMcq,
        start_time: startTime,
        end_time: endTime,
      }

      state.isResultAvailable = state.exam.mode === 'practice' ? false : moment().isSameOrAfter(state.examConfig.result_publish_time, 'seconds')
    },
    setQuestions(state, payload) {
      state.exam = payload || {}
      state.examQuestions = payload.mcqs || []
    },
    setResult(state, payload) {
      state.result = state.exam.mode === 'practice' ? false : payload || null
      state.attended = state.exam.mode === 'practice' ? false : !!(state.result && state.result?.submitted)
      state.submitted = state.exam.mode === 'practice' ? false : state.result?.submitted
    },
    mcqClicked(state, payload) {
      const index = state.examQuestions.findIndex((x) => x.id === payload.id)

      state.examQuestions[index].user_answer = state.exam.mode === 'practice' ? false : payload.choice
    },
  },
  actions: {
    async initExam(context, payload) {
      await context.commit('setExam', payload)
      await context.commit('setResult', payload?.exam?.result)
      const {id} = context.state.exam

      if (id) {
        await this.$axios.$get('/exams/' + id).then((response) => {
          if (response) context.commit('setQuestions', response.data)
          if (!response.data.result && !context.state.timeOver) context.dispatch('examStarted')
        })
      }
    },
    async examStarted(context) {
      const url = 'results'
      const data = {exam_id: context.state.exam?.id, submitted: 0}

      await this.$axios.$post(url, data).then((response) => {
        if (response) context.commit('setResult', response.data)
      })
    },
    async submitExam(context) {
      const url = 'results'
      const answers = context.state.examQuestions.filter((mcq) => mcq.user_answer).map((mcq) => {
        return {
          user_answer: mcq.user_answer || null,
          mcq_id: mcq.id
        }
      })
      const data = {exam_id: context.state.exam.id, submitted: 1, answers}

      await this.$axios.$post(url, data).then((response) => {
        if (response) context.commit('setResult', response.data)
      })
    }
  }
}
