<template>
  <v-card
    min-width="100%"
    width="100%"
    :loading="$fetchState.pending"
    flat
    class="pa-0 ma-0"
  >
    <!--      <v-card-title>
            {{ content.title }}
          </v-card-title>
          <hr>-->
    <v-card-text v-if="$fetchState.pending">
      <v-progress-circular
        :size="40"
        :width="2"
        color="purple"
        indeterminate
        class="text-center my-4"
      ></v-progress-circular>
    </v-card-text>
    <v-card-text v-else class="pa-0">
      <v-row no-gutters align-content="center">
        <v-col cols="12" align="center">
          <!-- Timer Section-->
          <v-card
            v-if="examConfig.totalQuestions && (examQuestions && examQuestions.length) || (examConfig.mode === 'group' && selectedSubjects && selectedSubjects.length)"
            max-width="400px"
            color="#ffffff"
            elevation="20"
            style="transform: translateY(30px); margin-top: -30px; z-index: 10; border-radius: 20px"
          >
            <template v-if="timeOver && !attended">
              <h4 class="error--text">
                You Missed the exam. Exam ended at: <strong>{{ exam.end_time | formatDate('MMMM Do YYYY, h:mm a') }}</strong>
              </h4>
            </template>
            <div v-else class="text-center Timer">
              <div class="d-flex justify-center align-center gap-10">
                <Timer
                  v-if="!result || ((result && Object.keys(result).length) && !result.end_time)"
                  :strict="examConfig.strict"
                  :duration="examConfig.duration"
                  :end-time="examConfig.end_time"
                  :start-time="examConfig.start_time"
                  @endCallBack="handelSubmitAnswer"
                >
                  <template v-slot:examInfo>
                    <strong class="mt-2 mx-1 d-md-none">
                      ( <span class="primary--text">{{ selectedMcqs.length }}</span> / <span class="primary--text">{{ examConfig.totalQuestions }}</span> )
                    </strong>
                  </template>
                </Timer>

                <div>
                  <div v-if="!result || ((result && Object.keys(result).length) && !result.end_time)" class="my-2 d-none d-md-block">
                    <strong class="mt-2">
                      Total Answered: <span class="primary--text">{{ selectedMcqs.length }}</span> / <span class="primary--text">{{ examConfig.totalQuestions }}</span>
                    </strong>
                  </div>
                  <div v-if="(result && result.submitted)" class="my-2 result-mobile-flex">
                    <template v-if="!isResultAvailable">
                      <div>
                        <span>Result available at:</span>
                        <strong class="success--text">{{ examConfig.result_publish_time | formatDate('lll') }}</strong>
                      </div>
                      <div>
                        <span>Status:</span>
                        <strong v-if="result.submitted" class="success--text">Submitted</strong>
                        <strong v-else class="error--text">Not Submitted</strong>
                      </div>
                    </template>
                    <template v-else>
                      <div>
                        <strong>
                          You got: <strong class="primary--text">{{ result.obtained_mark || 0 }}</strong>
                          out of <strong class="primary--text">{{ result.total_mark }}</strong>
                        </strong>
                      </div>
                      <template>
                        <div v-if="result.wrong !== null">
                          <strong>Wrong answers: <strong class="error--text">{{ result.wrong }}</strong></strong>
                          <strong v-if="resultDuration">, Duration: <strong class="error--text">{{ resultDuration }} min</strong></strong>
                        </div>
                        <!--                        <div v-if="examConfig.strict || (result && (result.submitted && result.start_time))"><strong>Start Time: <strong class="primary&#45;&#45;text">{{ result.start_time | formatDate('MMMM Do YYYY, h:mm:ss a') }}</strong></strong></div>-->
                        <!--                        <div v-if="result.end_time"><strong>End Time: <strong class="success&#45;&#45;text">{{ result.end_time | formatDate('MMMM Do YYYY, h:mm:ss a') }}</strong></strong></div>-->
                      </template>
                      <div class="ma-2">
                        <!--                        <nuxt-link :to="`${$nuxt.$route.path}/ranking/exam`">-->
                        <nuxt-link :to="rankingUrl">
                          <!--                          :to="`${$nuxt.$route.path}/ranking/`"-->
                          <v-btn class="lime lighten-1">See Ranking</v-btn>
                        </nuxt-link>
                      </div>
                    </template>
                  </div>
                  <div v-else-if="examConfig.mode === 'practice'">
                    <strong>
                      You got: <strong class="primary--text">{{ practiceMark() || 0 }}</strong>
                      out of <strong class="primary--text">{{ examConfig.totalQuestions }}</strong>
                    </strong>
                  </div>
                  <template v-if="!result || !result.submitted && examConfig.mode !== 'practice'">
                    <v-btn class="white--text mb-1 ml-1" color="#FF4040" @click="submitConfirmation()">Submit Answers</v-btn>
                  </template>
                </div>
              </div>
            </div>
          </v-card>
          <v-card elevation="20" class="pa-2 examQuestionCard">
            <div v-if="examStarted" class="my-4">
              <v-row v-if="examConfig.mode !== 'group'" dense>
                <v-col v-if="examQuestions && examQuestions.length" cols="12" class="examQuestions">
                  <!-- Regular Exam -->
                  <RegularExamination/>
                </v-col>
                <v-col v-else cols="12">
                  <v-alert dense outlined type="error">No MCQs available in Exam!</v-alert>
                </v-col>
              </v-row>
              <v-row v-else dense>
                <v-col v-if="selectedSubjects && selectedSubjects.length" cols="12">
                  <!--                        <group-exam-container
                                            :submit-answers="submitAnswers"
                                            :exam-config="examConfig"
                                            :selected-subjects="selectedSubjects"
                                            :results="result"
                                            @result="result = $event"
                                          ></group-exam-container>-->
                </v-col>
                <v-col v-else cols="12">
                  <v-alert dense outlined type="error">No MCQs available in Exam!</v-alert>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'
import Timer from '@/components/examination/Timer'
import RegularExamination from '@/components/examination/modes/RegularExam'

export default {
  components: {RegularExamination, Timer},
  props: {
    contentId: {type: Number, required: true},
    rankingUrl: {type: String, required: true}
  },
  async fetch() {
    // await this.init()
  },
  data() {
    return {
      selectedSubjects: [],
      examStarted: true,
      userAnswers: [],
    }
  },
  computed: {
    selectedMcqs() {
      return this.$store.getters['exam/selectedMcqs']
    },
    content() {
      return this.$store.state.exam.content
    },
    exam() {
      return this.$store.state.exam.exam
    },
    timeOver() {
      return this.$store.state.exam.timeOver
    },
    examQuestions() {
      return this.$store.state.exam.examQuestions
    },
    result() {
      return this.$store.state.exam.result
    },
    examConfig() {
      return this.$store.state.exam.examConfig
    },
    attended() {
      return this.$store.state.exam.attended
    },
    submitted() {
      return this.$store.state.exam.submitted
    },
    isResultAvailable() {
      return this.$store.state.exam.isResultAvailable
    },
    resultDuration() {
      if (this.isResultAvailable) {
        const start = moment(this.result.start_time)
        const end = moment(this.result.end_time)

        const diff = moment(end).diff(moment(start))

        return moment.duration(diff).get('minutes')
      }

      return false
    }
  },
  methods: {
    async init() {
      // this.$store.commit('exam/clearExam')
      await this.$axios.get(this.$store.state.examUrls.backendUrls.getContent)
        .then((response) => {
          if (response.data.data && Object.keys(response.data.data).length) {
            this.$store.dispatch('exam/initExam', response.data.data)
          }
        })
    },
    submitConfirmation() {
      this.$swal?.fire({
        title: 'Are you sure?',
        icon: 'information',
        text: 'Do you really want to submit the exam.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) this.handelSubmitAnswer()
      })
    },
    handelSubmitAnswer() {
      this.$store.dispatch('exam/submitExam')
    },
    practiceMark() { /// Working But ... Dummy Code ..
      let correct = 0

      if (this.examConfig.mode !== 'practice') return
      if (this.userAnswers && this.userAnswers.length) {
        if (this.examQuestions && this.examQuestions.length) {
          const mcqs = this.examQuestions

          mcqs.forEach((mcq) => {
            if (mcq.answer === mcq.user_answer) correct += 1
          })
        }
      }

      return correct
    },
  }
}
</script>

<style lang="scss" scoped>
.examQuestionCard {
  height: calc(100vh - 90px);
  overflow: auto;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(254, 70, 66, 0.5041) 0%, rgba(229, 37, 32, 0.71) 100%);
  max-height: calc(100vh - 180px);

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: linear-gradient(180deg, rgba(254, 70, 66, 0.5041) 0%, rgba(229, 37, 32, 0.71) 100%);
    margin-block: 30px;
    border-radius: 100vw;
    box-shadow: inset 0 0 8px rgba(254, 70, 66, 0.5);
  }

  &::-webkit-scrollbar-thumb {
    background: white;
    border-radius: 10px;
  }
}

@media only screen and (max-width: 600px) {
  .Timer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: white;
    width: 100% !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    display: flex;
    justify-content: space-around;
    align-items: center;

    padding: 0 10px 0 0;
    margin: 0;

    h2 {
      margin: 0
    }

    hr {
      display: none;
    }

    .timeProgress {
      transform: scale(0.8);
    }
  }
  .result-mobile-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .examQuestions {
    margin-top: 50px;
  }
}

.count-down {
  position: absolute;
  background-color: rgba(20, 20, 20, .98);
  pointer-events: none;
  opacity: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  transition: all 200ms ease-in-out;
  animation-name: fade-out;
  animation-duration: 1s;
  animation-delay: 4s;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.count-down .number {
  position: inherit;
  font-size: 200px;
  line-height: 1;
  color: #fff;
  opacity: 0;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, 0, 0);
  animation-name: count-down;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.count-down .number:nth-child(1) {
  animation-delay: 0.8s;
}

.count-down .number:nth-child(2) {
  animation-delay: 1.6s;
}

.count-down .number:nth-child(3) {
  animation-delay: 2.4s;
}

.count-down .number:nth-child(4) {
  animation-delay: 3.2s;
}

@keyframes count-down {
  0% {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(-50%, -66%, 0);
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    display: none;
  }
}

.bar {
  position: relative;
  height: 4px;
  width: 100%;
  border-radius: 20px;
  background: #0d131c;

  .inner {
    max-width: 100%;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    width: 0;
    height: 6px;
    border-radius: 20px;
  }
}

.v-dialog__content.v-dialog__content--active {
  z-index: 2000 !important;
}
</style>
