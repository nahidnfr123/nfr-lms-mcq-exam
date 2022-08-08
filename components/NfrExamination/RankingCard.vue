<template>
  <v-card v-if="item" class="text-center white--text relative pa-2" :color="color" style="height:100%; border-radius: 22px 22px 0 0">
    <div class="d-flex justify-end align-center flex-column gap-10" style="height: 100%">
      <div>
        <div>
          <img :src="item.user.photo" alt="" height="100" width="100" class="profileImage">
        </div>
        <div class="mb-2 white--text">
          <h3>{{ item.user.name }}</h3>
          <h5>{{ item.user.current_institution }}</h5>
        </div>
      </div>
      <div>
        <div class="white--text mb-1">
          <small><strong>{{ item.obtained_mark || 0 }}/{{ item.total }}</strong></small>
        </div>
        <div class="white--text">
          <small><strong>
            <v-icon color="white">mdi-clock-outline</v-icon>
            {{ item.duration || duration(item.start_time, item.end_time) || 0 }}</strong></small>
        </div>
      </div>
    </div>
    <slot name="image"></slot>
  </v-card>
</template>
<script>
import moment from 'moment'

export default {
  props: ['item', 'color', 'img'],
  methods: {
    duration(start_time, end_time) {
      const start = moment(start_time)
      const end = moment(end_time)
      const diff = moment(end).diff(moment(start))
      const minutes = moment.duration(diff).get('minutes')

      if (minutes <= 0) return moment.duration(diff).get('seconds') + ' sec'
      else return minutes + ' min'
    }
  }
}
</script>

<style scoped>
.green {
  background-color: #E52520;
}

.profileImage {
  border-radius: 50%;
  object-fit: cover;
  object-position: center center;
}
</style>
