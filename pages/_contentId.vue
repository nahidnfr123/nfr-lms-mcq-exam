<template>
  <v-container fluid>
    <examination
      :contentId="this.$route.params.contentId"
      :frontEndUrls="{exam: null, result: null}"
      :backendUrls="{getExam: null, submitExam: null, getRanking: null,}"
    />
  </v-container>
</template>

<script>
import Examination from '~/components/examination/Examination'

export default {
  name: 'Content',
  components: {Examination}
}
</script>
