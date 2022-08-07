<template>
  <v-container fluid>
    <examination
      :contentId="$route.params.contentId"
      :frontendUrls="frontendUrls"
      :backendUrls="backendUrls"
    />
  </v-container>
</template>

<script>
import Examination from '~/components/examination/Examination'

export default {
  name: 'Content',
  components: {Examination},
  data() {
    return {
      frontendUrls: {
        exam: null,
        ranking: '/ranking/' + this.$route.params.contentId
      },
      backendUrls: {
        getContent: '/contents/' + this.$route.params.contentId,
        getExam: '/exams/',
        submitExam: '/results/',
        getRanking: null,
      },
    }
  }
}
</script>
