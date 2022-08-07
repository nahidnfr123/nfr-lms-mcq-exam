export default {
  props: {
    serial: {type: Number, default: 0},
    exam: {required: true, type: Object},
    examConfig: {required: true, type: Object},
    submitAnswers: {default: false, type: Boolean}
  },
  data() {
    return {
      mcqs: this.exam.mcqs,
      result: this.exam.result,
      submitted: false
    }
  },
  watch: {
    selectedMcqs(newVal) {
      const answers = this.mcqs.filter((mcq) => mcq.user_answer).map((mcq) => {
        return {user_answer: mcq.user_answer || null, mcq_id: mcq.id}
      })

      if (this.examConfig.mode === 'practice') this.$emit('userAnswers', answers)

      this.$emit('updateSelectedMcqs', newVal)
    },
    submitAnswers(newVal) {
      if (newVal) this.submit()
    },
    result(newVal) {
      this.$emit('result', newVal)
    },
  },
  mounted() {
    this.$emit('result', this.result)
  },
  computed: {
    selectedMcqs() {
      if (this.mcqs && this.mcqs.length) {
        const mcqs = this.mcqs.filter((mcq) => mcq.user_answer)

        if (mcqs) return mcqs.map(({id}) => id)
        else return []
      } else return []
    }
  },
  methods: {
    submit() {
      let exam_id = this.exam.id

      if (this.examConfig.mode === 'practice') return
      if (this.examConfig.mode === 'group') exam_id = this.examConfig.exam_id

      const url = 'results'
      const answers = this.mcqs.filter((mcq) => mcq.user_answer).map((mcq) => {
        return {user_answer: mcq.user_answer || null, mcq_id: mcq.id}
      })
      const data = {exam_id: exam_id, submitted: 1, answers}

      this.$axios.post(url, data).then((response) => {
        this.submitted = true
        this.result = response.data.data
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
      })
    }
  }
}
