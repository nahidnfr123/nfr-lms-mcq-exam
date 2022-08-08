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
          <ExaminationCard :content-id="Number(content.id)" :ranking-url="rankingUrl"/>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ExaminationCard from './ExaminationCard'

export default {
  components: {ExaminationCard},
  props: {
    openExamDialog: {type: Boolean, default: false},
    showExamDetails: {type: Boolean, default: true},
    content: {type: Object, required: true},
    rankingUrl: {type: String, required: true}
  },
  data() {
    return {
      dialog: false,
    }
  },
  watch: {
    openExamDialog(val) {
      this.dialog = val
    },
    dialog(val) {
      this.$emit('close', val)
    },
  },
  methods: {
    async closeExamModal() {
      const {result} = this.$store.state.exam

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
      this.$store.dispatch('exam/submitExam')
    },
  }
}
</script>
