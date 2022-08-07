<template>
  <div>
    <div v-for="(mcq, n) in mcqs" :key="mcq.id+'-'+n">
      <MCQQuestion class="ma-0 pa-0" :mcq="mcq" :serial="n+1"/>
    </div>
  </div>
</template>

<script>
import MCQQuestion from '@/components/examination/MCQ_Question'

export default {
  name: 'RegularExamination',
  components: {MCQQuestion},
  computed: {
    mcqs() {
      return this.$store.state.exam.exam.examQuestions
    }
  }
}

</script>
