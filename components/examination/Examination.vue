<template>
  <main>
    <div v-if="content && Object.keys(content).length">
      <v-card class="my-2 pa-2">
        <ExamDetailsInfo/>
      </v-card>

      <!-- Exam Start Button -->
      <template v-if="!result || !result.submitted">
        <v-btn
          class="mb-1 white--text px-4"
          color="red"
          :is-loading="isLoading"
          :disabled="!checkExamAvailability"
          @click.native="examWarning=true"
        >
          <span>Start Exam</span>
          <span class="ml-1">{{ timer.text }}</span>
        </v-btn>
        <exam-warning
          :exam-warning="examWarning"
          @close="examWarning=false"
          @openExamDialog="examStartButtonClicked()"
        />
      </template>
      <template v-else>
        <!-- See Answers -->
        <v-btn color="primary" @click="examStartButtonClicked()">See Answers</v-btn>
        <!-- See Ranking -->
        <v-btn color="success" v-if="isResultAvailable" :to="$store.state.examUrls.frontendUrls.ranking">
          See Ranking
        </v-btn>
      </template>

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
    </div>
  </main>
</template>

<script>
import moment from 'moment'
import ExamContainerModal from '~/components/examination/ExamContainerModal'
import ExamWarning from '~/components/examination/ExamWarning'
import ExamDetailsInfo from "~/components/examination/ExamDetailsInfo";

export default {
  name: 'Examination',
  components: {ExamDetailsInfo, ExamWarning, ExamContainerModal},
  props: {
    contentId: {type: [Number, String], required: true},
    frontendUrls: {type: Object, required: true},
    backendUrls: {type: Object, required: true},
  },
  data() {
    return {
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
    await this.$store.commit('exam/clearExam')
    this.$store.commit('examUrls/setFrontendUrls', this.frontendUrls)
    this.$store.commit('examUrls/setBackendUrls', this.backendUrls)
    await this.init()
  },
  computed: {
    content() {
      return this.$store.state.exam.content
    },
    isResultAvailable() {
      return this.$store.state.exam.isResultAvailable
    },
    result() {
      return this.$store.state.exam.result
    },
    exam() {
      return this.content.exam || {}
    },
    checkExamAvailability() {
      if (this.exam && (this.exam.start_time && this.exam.end_time))
        return moment().isBetween(this.exam.start_time, this.exam.end_time, 'seconds')
      else return false
    }
  },
  beforeDestroy() {
    clearInterval(this.timer.interval)
  },
  methods: {
    async init() {
      await this.$axios.get(this.$store.state.examUrls.backendUrls.getContent)
        .then((response) => {
          if (response.data.data && Object.keys(response.data.data).length) {
            this.$store.commit('exam/setContent', response.data.data)
            this.checkExamTiming()
          }
        })
    },
    async examStartButtonClicked() {
      this.isLoading = true
      await this.$store.dispatch('exam/initExam', this.content).then(() => {
        this.openExamDialog = true;
      })
      this.isLoading = false
    },
    checkExamTiming() {
      const {start_time} = this.exam

      if (start_time && moment(start_time).isValid()) {
        const isBefore = moment().isBefore(start_time)
        const thirtyMinBefore = moment().isSameOrAfter(moment(start_time).subtract(30, 'minute'))

        if (isBefore && thirtyMinBefore) this.ticTic()
      }
    },
    ticTic() {
      const countDownDate = moment(this.exam.start_time)
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
          // location.reload()
          this.init()
        }
      }, 1000)
    },
  }
}
</script>
