<template>
  <div v-if="content[type]">
    <table id="customers">
      <!--    <tr>-->
      <!--      <th>Company</th>-->
      <!--      <th>Contact</th>-->
      <!--      <th>Country</th>-->
      <!--    </tr>-->
      <tr v-if="content[type].mode">
        <td>Exam Mode</td>
        <td>{{ content[type].mode }}</td>
      </tr>
      <tr v-if="content[type].total_subject">
        <td>Total Subject</td>
        <td>{{ content[type].total_subject }}</td>
      </tr>
      <tr v-if="content[type].duration">
        <td>Exam Duration</td>
        <td>{{ content[type].duration }}</td>
      </tr>
      <tr v-if="content[type].per_question_mark">
        <td>Per Question Mark</td>
        <td>{{ content[type].per_question_mark }}</td>
      </tr>
      <tr v-if="content[type].negative_mark">
        <td>Negative Mark</td>
        <td>{{ content[type].negative_mark }}</td>
      </tr>
      <tr v-if="content[type].pass_mark">
        <td>Pass Mark</td>
        <td>{{ content[type].pass_mark }}</td>
      </tr>
      <tr v-if="content[type].start_time">
        <td>Exam Starts At</td>
        <td>{{ content[type].start_time | formatDate('lll') }}</td>
      </tr>
      <tr v-if="content[type].end_time">
        <td>Exam Ends At</td>
        <td>{{ content[type].end_time | formatDate('lll') }}</td>
      </tr>
      <tr v-if="content[type].result_publish_time">
        <td>Exam Result Publish Time</td>
        <td>{{ content[type].result_publish_time | formatDate('lll') }}</td>
      </tr>
      <tr v-if="content.description">
        <td>Content Description</td>
        <td>{{ content.description }}</td>
      </tr>
      <tr v-if="content[type].description">
        <td>Exam Description</td>
        <td>{{ content[type].description }}</td>
      </tr>
      <tr v-if="totalMCQs">
        <td>Total MCQs</td>
        <td>{{ totalMCQs }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  computed: {
    totalMCQs() {
      return this.$store.state.exam.examConfig.totalQuestions
    },
    type() {
      return this.$store.state.exam.content.type
    },
    content() {
      return this.$store.state.exam.content
    }
  },
  filters: {
    formatDate(value, filterFormat) {
        if (value) return moment(value).format(filterFormat || 'lll')

        return value
    }
  }
}
</script>

<style scoped>
#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td, #customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers tr:nth-child(even) {
  background-color: #f2f2f2;
}

#customers tr:hover {
  background-color: #ddd;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}
</style>
