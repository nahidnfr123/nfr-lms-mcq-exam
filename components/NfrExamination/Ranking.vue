<template>
  <v-container fluid>
    <div class="my-2">
      <h1 class="text-center mb-2">{{ pageInfo.title }}</h1>
      <hr>
      <div v-if="items && items.length">
        <!-- Ranking Cards -->
        <v-card flat class="mt-4">
          <v-row>
            <v-col cols="4" justify="center" class="d-flex flex-column justify-start">
              <ranking-card v-if="itemsWithPosition[2]" :item="items[2]" color="#006D89" class="mt-8">
                <template slot="image">
                  <img src="./images/3rd.png" alt="" height="100" style="position: absolute; top: -15%; right: 0">
                </template>
              </ranking-card>
            </v-col>
            <v-col cols="4" justify="center" class="d-flex flex-column justify-start">
              <ranking-card v-if="itemsWithPosition[0]" :item="items[0]" color="#8E181D">
                <template slot="image">
                  <img src="./images/1st.png" alt="" height="100" style="position: absolute; top: -15%; right: 0">
                </template>
              </ranking-card>
            </v-col>
            <v-col cols="4" justify="center" class="d-flex flex-column justify-start">
              <ranking-card v-if="itemsWithPosition[1]" :item="items[1]" color="#009563" class="mt-4">
                <template slot="image">
                  <img src="./images/2nd.png" alt="" height="100" style="position: absolute; top: -20%; right: 0">
                </template>
              </ranking-card>
            </v-col>
          </v-row>
        </v-card>

        <v-data-table
          :loading="isLoading || $fetchState.pending"
          :headers="headers"
          :items="itemsWithPosition"
          :item-class="itemRowBackground"
          disable-pagination
          mobile-breakpoint="0"
          :items-per-page="30"
          class="elevation-1"
          :options.sync="itemsPagination.options"
          :server-items-length="itemsPagination.totalItems"
          :footer-props="itemsPagination.footerProps"
        >
          <!-- <template v-slot:item.position="{ item }">
            <div v-if="item.user">
              <div v-if="item.user.id === $auth.user.id" style="background-color: #0be02b; border-radius: 200px" class="pa-1 text-center">
                <strong>{{ item.position }}</strong>
              </div>
              <template v-else>
                {{ item.position }}
              </template>
            </div>
          </template> -->
          <template v-slot:item.user="{ item }">
            <div v-if="item.user">
              <strong>
                {{ item.user.name | capitalize }} <br>
                <span>{{ item.user.current_institution }}</span>
              </strong>
            </div>
          </template>
          <!--  <template v-slot:item.obtained_mark="{ item }">
             <div v-if="item.user">
               <div v-if="item.user.id === $auth.user.id" style="background-color: #0be02b; border-radius: 200px" class="pa-1 text-center">
                 <strong>{{ item.obtained_mark }}</strong>
               </div>
               <template v-else>
                 {{ item.obtained_mark }}
               </template>
             </div>
           </template> -->
          <!--          <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length">
                        <div class="ml-2">
                          <span v-if="item.correct">Correct: <strong>{{ item.correct }} </strong>, </span>
                          <span v-if="item.duration">Duration: <strong>{{ item.duration }} </strong>, </span> <br>
                          <span v-if="item.user"> <strong>Institution:</strong> {{ item.user.current_institution }}</span>
                        </div>
                      </td>
                    </template>-->
        </v-data-table>
      </div>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment'
import RankingCard from './RankingCard'

export default {
  components: {RankingCard},
  props: {
    type: {type: String, required: true},
    // examType: {type: String, required: true},
    contentId: {type: [Number, String], required: true}
  },
  async fetch() {
    await this.init()
  },
  // fetchOnServer: false,
  data() {
    return {
      pageInfo: {
        title: 'Ranking',
        apiUrl: `/ranking/${this.contentId}/`,
        permission: 'model test category'
      },
      isLoading: false,
      items: [],
      expanded: [],
      headers: [
        {text: 'Rank', align: 'start', sortable: false, value: 'position'},
        {text: 'Name', align: 'start', sortable: false, value: 'user'},
        {text: 'Mark', value: 'obtained_mark'},
        {text: '', value: 'data-table-expand'}
        // {text: 'Start Time', value: 'start_time'},
        // {text: 'End Time', value: 'end_time'},
        // {text: 'Duration', value: 'duration'}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      itemsPagination: {
        options: {},
        totalItems: 0,
        footerProps: {
          itemsPerPageOptions: [30, 50, 100, 500, 1000]
        }
      }
    }
  },
  computed: {
    $auth() {
      return this.$store.state.exam.authUser
    },
    itemsWithPosition() {
      return this.items.map((d, index) => (
        {
          ...d,
          position: index + 1,
          duration: moment.utc(moment(d.end_time).diff(d.start_time, 'seconds') * 1000).format('HH:mm:ss')
        }
      ))
    }
  },
  watch: {
    'itemsPagination.options': {
      handler() {
        if (!this.$fetchState.pending) this.init()
      }, deep: true
    }
  },
  // mounted() {
  //   if (this.$getSiteInfo('siteShortName') === 'IEducation')
  //     this.headers.splice(2, 0, {text: 'Current Institution', align: 'start', sortable: false, value: 'user.current_institution'})
  // },
  methods: {
    async init() {
      this.isLoading = true
      const perPage = this.itemsPagination?.options?.itemsPerPage ? this.itemsPagination?.options?.itemsPerPage : 20
      const pageNo = this.itemsPagination?.options?.page ? this.itemsPagination?.options?.page : 1
      await this.$axios.$get(this.pageInfo.apiUrl + '?per_page=' + perPage + '&page=' + pageNo)
        .then((response) => {
          this.items = response.data || []
          this.itemsPagination.totalItems = response?.meta?.total ? response.meta.total : 0
        }).finally(() => this.isLoading = false)
    },
    itemRowBackground(item) {
      return item.user?.id === this.$auth.user?.id ? 'red' : ''
    },
  }
}
</script>

<style>
.green {
  background-color: #E52520;
}
</style>
