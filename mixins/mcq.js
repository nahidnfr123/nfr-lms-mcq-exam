export default {
  props: {
    mcq: { type: Object, required: true },
    serial: { type: Number, required: false, default: null },
    examConfig: {
      required: false, type: Object, default: () => {
      }
    },
    attended: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      choice: this.mcq.user_answer,
      difficultyLevelText: ['Easy', 'Normal', 'Moderate', 'Hard', 'Hardest']
    }
  },
  watch: {
    choice() {
      this.$emit('input', this.choice)
    }
  },
  computed: {
    answerIsCorrect() {
      // eslint-disable-next-line no-eq-null,eqeqeq
      if (!this.choice && this.choice == null) return 2 // Not Answered
      if (this.choice === this.mcq.answer) return 1 // Correct Answer
      else return 0 // Wrong Answer
    },
    hasAttended() {
      // return this.attended ? false : true
      return this.attended
    },
    examMode() {
      // return this.attended ? false : true
      return this.examConfig.mode
    }
  },
  methods: {}
}
