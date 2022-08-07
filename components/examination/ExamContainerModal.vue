<template>
  <v-row justify="center">
    <v-dialog
      v-model="openExamDialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      style="z-index: 2000 !important; max-height: 100vh; max-width: 100vw;"
    >
      <v-card elevation="10" style="z-index: 20000 !important; border-radius: 0">
        <v-toolbar dense fixed dark color="white">
          <v-btn icon dark small @click="closeExamModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ content.title }}</v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
          <ExaminationCard :content-id="Number(content.id)" :ranking-url="rankingUrl"></ExaminationCard>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ExaminationCard from '@/components/examination/ExaminationCard'

export default {
  components: {ExaminationCard},
  props: {
    openExamDialog: {type: Boolean, default: false},
    showExamDetails: {type: Boolean, default: true},
    content: {type: Object, required: true},
    rankingUrl: {type: String, required: true}
  },
  async fetch() {
    // this.initExamConfig()
    // // await this.showExamQuestions() /// Comment this line In live site
  },
  data() {
    return {
      dialog: false,
      loader: {isLoading: false},
      examQuestions: [],
      examStarted: false,
      showCountDownTimer: false,
      barColor: '#02ed7f',
      submitAnswers: false,
      result: {},
      selectedMcqs: [],
      userAnswers: [],
      showReminder: false,
      selectedSubjects: []
    }
  },
  watch: {
    openExamDialog(val) {
      this.dialog = val
    },
    dialog(val) {
      this.$emit('close', val)
    },
    selectedSubjects(newVal) {
      let totalMcq = 0

      if (newVal && newVal.length) {
        newVal.forEach((obj) => totalMcq = totalMcq + obj.mcqs.length)
      }
      this.examConfig.totalQuestions = totalMcq
    }
  },
  mounted() {
    if (this.content.exam)
      if (this.content.exam.subjects && this.content.exam.subjects.length) {
        this.selectedSubjects = this.content.exam.subjects.filter((obj) => obj.required)
      }
  },
  methods: {
    /*async init() {
      this.loader.isLoading = true
      this.examQuestions = []
      if (this.examConfig.mode !== 'group') {
        const id = this.content?.exam?.id

        if (id) {
          const response = await this.$getData('/exams/' + id)

          this.examQuestions = response.message === 'success' ? response.data : []
          this.examConfig.totalQuestions = this.examQuestions.mcqs ? this.examQuestions.mcqs.length : 0
        } else {
          this.examQuestions = this.selectedSubjects
        }
      }
      this.loader.isLoading = false
    },*/
    /*async showExamQuestions(showCountDownTimer = true) {
      this.showCountDownTimer = showCountDownTimer
      await this.init()
      this.examStarted = true
      // if (!this.result || (this.result && !this.result?.submitted)) await this.initTimer()
      if (!this.result && (this.examQuestions && Object.keys(this.examQuestions).length && this.examConfig.totalQuestions > 0)) {
        await this.storeStartTime()
      }
      // Need To Work Here ......
      else if (this.examConfig.mode === 'group') await this.storeStartTime()
    },*/
    async closeExamModal() {
      const {result} = this.$store.state.exam.exam

      if (result && !result.submitted)
        this.$swal?.fire({
          title: 'Leaving exam?',
          icon: 'warning',
          text: 'Do you want to submit the answer?',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          customClass: {
            container: 'my-swal'
          }
          // eslint-disable-next-line consistent-return
        }).then(async (response) => {
          if (response.isConfirmed) {
            await this.handelSubmitAnswer()
            await this.$emit('close', false)
            location.reload()
          } /*else if (response.isDenied) {
          }*/
        })
      else this.$emit('close', false)
    },
    handelSubmitAnswer() {
      this.$store.dispatch('exam/exam/submitExam')
    },
  }
}
</script>
