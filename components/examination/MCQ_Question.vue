<template>
  <v-card class="mb-2" style="position: relative">
    <v-card-text class="theme-text-dark">
      <div class="d-flex justify-space-between">
        <div class="d-flex">
          <div class="mr-1"><strong v-if="serial">{{ serial }}.</strong></div>
          <div v-katex:auto v-html="mcq.question"></div>
        </div>
        <div v-if="attended && resultIsAvailable">
          <v-icon v-if="answerIsCorrect === 2" color="success">mdi-help</v-icon>
          <v-icon v-if="answerIsCorrect === 1" color="success">mdi-check-bold</v-icon>
          <v-icon v-if="answerIsCorrect === 0" color="error">mdi-close-thick</v-icon>
        </div>
      </div>
      <div v-if="mcq.question_description" class="mt-1">
        <v-divider></v-divider>
        <small>
          <strong>Question Description:</strong>
          <div v-if="mcq.question_description" v-katex:auto v-html="mcq.question_description"/>
        </small>
      </div>
      <div style="max-width: 100%; position: relative;">
        <!--        :aspect-ratio="16/9"-->
        <img
          v-if="mcq.question_photo"
          :src="mcq.question_photo"
          alt=""
          class="mcq-image"
          style="max-height: 600px !important; max-width: 100% !important;"
        />
      </div>
      <!--      <v-radio-group v-model="choice" column :disabled="!!choice">-->
      <v-radio-group v-model="choice" column :disabled="!!choice">
        <v-radio
          v-for="(option, n) in options"
          :key="option+n"
          v-if="mcq[options[n]]"
          color="primary"
          class="mb-1 rounded pa-1"
          :value="mcq[options[n]]"
          ripple
          :disabled="attended"
          :off-icon="`mdi-alpha-${options[n]}-circle-outline`"
          :on-icon="`mdi-alpha-${options[n]}-circle-outline`"
          :class="getStyleClass(attended, choice, mcq[options[n]], mcq.answer)"
        >
          <template v-slot:label>
            <div
              v-if="examConfig.exam_mode === 'practice'"
              v-katex:auto
              :class="choice && mcq.answer===mcq[options[n]] ? 'correct-option' : (choice===mcq[options[n]] && mcq.answer===mcq[options[n]] ? 'correct-option':( mcq[options[n]] === choice ? 'wrong-option' : ''))"
              v-html="mcq[options[n]]"
            ></div>
            <div v-else>
              <strong v-katex:auto v-html="mcq[options[n]]"></strong>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
      <template v-if="(attended || (examConfig.exam_mode === 'practice' && choice)) && resultIsAvailable">
        <div class="text-center">
          <v-btn class="primary" x-small @click="showAnswerDescription = !showAnswerDescription"> {{ showAnswerDescription ? 'Hide Answer Description' : 'Show Answer Description' }}</v-btn>
        </div>
        <template v-if="showAnswerDescription ">
          <v-divider v-if="(mcq.answer_description || mcq.answer_photo) && attended" class="mx-4"></v-divider>
          <div class="pa-1" style="border-radius: 20px; border: 2px solid rgba(20,20,20,0.8)">
            <small class="text-center">Answer Description</small>
            <v-card-text v-if="mcq.answer_description && attended" v-katex:auto v-html="mcq.answer_description"></v-card-text>
            <img
              v-if="mcq.answer_photo && attended"
              height="300"
              :src="mcq.answer_photo"
              class="mx-1 mcq-image"
              alt=""
            />
          </div>
        </template>
      </template>
    </v-card-text>
    <!--    <v-card-actions v-if="serial" class="justify-center pt-0">
          <v-chip
            :color="(mcq.answer === mcq.user_answer && !attended) ? 'success': (mcq.user_answer && !attended ? 'red' : '')"
          >
            {{ serial }}
          </v-chip>
        </v-card-actions>-->
  </v-card>
</template>

<script>
export default {
  name: 'MCQQuestion',
  props: {
    mcq: {type: Object, required: true},
    serial: {type: Number, required: false, default: null},
  },
  data() {
    return {
      showAnswerDescription: false,
      choice: this.mcq.user_answer,
      options: ['a', 'b', 'c', 'd', 'e', 'f', 'h']
    }
  },
  computed: {
    answerIsCorrect() {
      // eslint-disable-next-line no-eq-null,eqeqeq
      if (!this.choice && this.choice == null) return 2 // Not Answered
      if (this.choice === this.mcq.answer) return 1 // Correct Answer
      else return 0 // Wrong Answer
    },
    resultIsAvailable() {
      return this.$store.state.exam.exam.isResultAvailable
    },
    examConfig() {
      return this.$store.state.exam.exam.examConfig
    },
    attended() {
      return this.$store.state.exam.exam.attended
    },
    timeOver() {
      return this.$store.state.exam.exam.timeOver
    },
  },
  watch: {
    choice() {
      // this.$emit('input', this.choice)
      this.$store.commit('exam/exam/mcqClicked', {id: this.mcq.id, choice: this.choice})
    }
  },
  methods: {
    getBgStyle(attended, choice, option, correctAnswer) {
      if (attended && (correctAnswer === choice) && (correctAnswer === option))
        return 'background: #04cc75; color: black'
      else
        return 'background: white'
    },
    getStyleClass(attended, choice, option, correctAnswer) {
      if (this.resultIsAvailable) {
        if (attended && this.answerIsCorrect === 1 && (correctAnswer === choice && option === choice))
          return 'correctUserAnswer'
        else if (!attended && choice === option) // Correct Answer ...
          return 'correctUserAnswer'
        else if (attended && correctAnswer === option) // attended
          return 'originalAnswer'
        else if (!attended && correctAnswer === option && this.timeOver) // Not attended
          return 'originalAnswer'
        else if (attended && option === choice)  // Not attended
          return 'wrongAnswer'
      } else {
        if (attended && (option === choice)) return 'correctUserAnswer'
        else if (!attended && (choice === option)) return 'correctUserAnswer'
      }

      return 'defaultColor'
    },
  }
}
</script>

<style lang="scss">
.correctUserAnswer {
  background-color: rgba(10, 178, 66, 0.40) !important;
  border: 2px solid #04cc75 !important;
  color: black !important;
  font-weight: 600;
  font-size: 16px;

  > > > .v-radio--is-disabled {
    color: black !important;
  }
}

.originalAnswer {
  background-color: rgba(62, 164, 2, 0.40) !important;
  border: 2px solid #3ea402 !important;
  color: black !important;
  font-weight: 600;
  font-size: 16px;
}

.wrongAnswer {
  background-color: rgba(255, 64, 64, 0.40) !important;
  border: 2px solid red !important;
  color: white !important;
  font-weight: 600;
  font-size: 16px;
}

.defaultColor {
  background-color: transparent !important;
  border: 2px solid #eeeeee !important;
  color: black !important;
  font-weight: 600;
  font-size: 16px;
}

.theme-text-dark {
  font-weight: 500;
  color: #232428 !important;
}

.correct-option {
  color: #04cc75;
  font-weight: 600;
  font-size: 16px;
}

.wrong-option {
  color: red;
  font-weight: 600;
  font-size: 16px;
}
</style>
