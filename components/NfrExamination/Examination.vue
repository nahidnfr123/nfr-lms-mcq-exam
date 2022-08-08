<template>
  <main>
    <div v-if="content && Object.keys(content).length">
      <v-card v-if="showExamDetails" class="my-2 pa-2">
        <ExamDetailsInfo/>
      </v-card>

      <!-- Exam Start Button -->
      <template v-if="(!result || !result.submitted) && !$isAfterTime(exam.end_time)">
        <v-btn
          class="mb-1 white--text px-4"
          color="red"
          :is-loading="isLoading"
          :disabled="!checkExamAvailability"
          @click.native="examWarning=true"
        >
          <slot name="startExamButton">
            <span>Start Exam</span>
          </slot>
          <span class="ml-1">{{ timer.text }}</span>
        </v-btn>
        <exam-warning
          :exam-warning="examWarning"
          @close="examWarning=false"
          @openExamDialog="examStartButtonClicked()"
        />
      </template>
      <template v-else>
        <template v-if="$isAfterTime(exam.end_time)">
          <v-alert border="left" colored-border class="error--text" type="error" elevation="2">Exam Has ended</v-alert>
        </template>
        <template v-if="result && (Object.keys(result).length && result.submitted)">
          <template v-if="$isAfterTime(exam.result_publish_time)">
            <h2>Your Result</h2>
            <strong>
              You got: <strong class="primary--text">{{ result.obtained_mark || 0 }}</strong> out of
              <strong class="primary--text">{{ result.total_mark }}</strong>
            </strong>
            <div v-if="result.wrong !== null"><strong>Wrong answers:
              <strong class="error--text">{{ result.wrong }}</strong></strong></div>

            <div v-if="(result.submitted && result.start_time)"><strong>Start Time: <strong
              class="primary--text"
            >{{ result.start_time | formatDate('lll') }}</strong></strong></div>
            <div v-if="result.end_time"><strong>End Time: <strong
              class="success--text"
            >{{ result.end_time | formatDate('lll') }}</strong></strong></div>
          </template>
        </template>

        <div class="my-2">
          <!-- See Answers -->
          <v-btn
            class="white--text"
            color="#17A5DE"
            @click="examStartButtonClicked()"
          >See Answers
          </v-btn>
          <!-- See Ranking -->
          <v-btn
            v-if="isResultAvailable"
            class="white--text"
            color="#16345E"
            :to="$store.state.examUrls.frontendUrls.ranking"
          >See Ranking
          </v-btn>
        </div>
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
import ExamContainerModal from './ExamContainerModal'
import ExamWarning from './ExamWarning'
import ExamDetailsInfo from './ExamDetailsInfo'

export default {
  name: 'Examination',
  components: {ExamDetailsInfo, ExamWarning, ExamContainerModal},
  props: {
    contentId: {type: [Number, String], required: true},
    frontendUrls: {type: Object, required: true},
    backendUrls: {type: Object, required: true},
    authUser: {type: Object, required: true},
    showExamDetails: {type: Boolean, default: true},
  },
  async fetch() {
    await this.$store.commit('exam/clearExam')
    this.$store.commit('exam/setAuthUser', this.authUser)
    this.$store.commit('examUrls/setFrontendUrls', this.frontendUrls)
    this.$store.commit('examUrls/setBackendUrls', this.backendUrls)
    await this.init()
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
        this.openExamDialog = true
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
    }
  }
}
</script>
