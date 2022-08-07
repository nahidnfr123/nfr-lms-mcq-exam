
<template>
  <main>
    <div v-if="content && Object.keys(content).length">
      <!--<regular-exam v-if="examQuestions.mcqs && examQuestions.mcqs.length" :exam="examQuestions"/>-->
      <v-btn
        class="mb-1 white--text px-4"
        color="red"
        :is-loading="isLoading"
        :disabled="!checkExamAvailability(content.exam.start_time, content.exam.end_time)"
        @click.native="examWarning=true"
      >Start Exam
        <span class="ml-1">{{ timer.text }}</span>
      </v-btn>
      <exam-warning
        :exam-warning="examWarning"
        @close="examWarning=false"
        @openExamDialog="openExamDialog = true;"
      />
    </div>
    <template v-if="content.type === 'exam' && Object.keys(content.exam).length">
      <exam-container-modal
        v-if="openExamDialog"
        :open-exam-dialog="openExamDialog"
        :content="content"
        :show-exam-details="false"
        :ranking-url="`/ranking/${content.id}`"
        @close="openExamDialog = $event"
      />
      <!--                  :ranking-url="`/my-course/${$route.params.courseSlug}/${$route.params.contentId}/ranking`"-->
    </template>
  </main>
</template>

<script>
import moment from 'moment'
import ExamContainerModal from '~/components/exam/ExamContainerModal'
import ExamWarning from '~/components/examination/ExamWarning'

export default {
  name: 'IndexPage',
  components: {ExamWarning, ExamContainerModal},
  data() {
    return {
      content: {},
      isLoading: false,
      examWarning: false,
      openExamDialog: false,
      timer: {
        text: '',
        interval: 0
      }
    }
  },
  async fetch() {
    // await this.init()
    await this.$store.dispatch('exam/initExam')
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      const response = await this.$getData('/contents/' + this.$route.params.contentId)

      this.content = response.message === 'success' ? response.data : {}
      if (this.content.exam) this.result = this.content?.exam?.result
      else if (this.content.written_exam) this.result = this.content?.written_exam?.result
      this.loader.isLoading = false

      const {exam} = this.content

      if (exam && moment(exam.start_time).isValid()) {
        const isBefore = moment().isBefore(exam.start_time)
        const thirtyMinBefore = moment().isSameOrAfter(moment(exam.start_time).subtract(30, 'minute'))

        if (isBefore && thirtyMinBefore) this.ticTic()
      }
    },
    ticTic() {
      const {exam} = this.content
      const countDownDate = moment(exam.start_time)
      const _this = this

      this.timer.interval = setInterval(() => {
        const now = new Date().getTime()

        // Find the distance between now and the count down date
        const distance = countDownDate - now

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        // _this.timer.text = hours + 'h ' + minutes + 'm ' + seconds + 's '
        _this.timer.text = minutes + 'm ' + seconds + 's '

        if (distance < 0) {
          clearInterval(_this.timer.interval)
          _this.timer.text = ''
          location.reload()
        }
      }, 1000)
    },
    checkExamAvailability(start_time, end_time) {
      return moment().isBetween(start_time, end_time, 'seconds')
    }
  }
}
</script>
