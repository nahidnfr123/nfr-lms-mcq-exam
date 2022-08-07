<template>
  <v-dialog v-model="warningDialogue" max-width="760">
    <v-card class="pa-3">
      <div>
        <h3 class="text-center">Warnings !!!</h3>
        <div class="d-flex align-center justify-center">
          <div>
            <svg
              width="170"
              height="170"
              viewBox="0 0 170 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M143.225 120.606L97.2305 35.8889C96.0128 33.6516 94.2144 31.784 92.0246 30.4827C89.8348 29.1814 87.3347 28.4946 84.7874 28.4946C82.2402 28.4946 79.7401 29.1814 77.5503 30.4827C75.3605 31.784 73.5621 33.6516 72.3444 35.8889L26.3027 120.606C25.0976 122.769 24.4805 125.21 24.5129 127.686C24.5453 130.162 25.2261 132.586 26.4874 134.717C27.7486 136.847 29.5464 138.61 31.7014 139.83C33.8564 141.049 36.2933 141.683 38.7694 141.667H130.758C133.214 141.669 135.628 141.033 137.764 139.821C139.9 138.608 141.684 136.862 142.941 134.752C144.198 132.643 144.885 130.243 144.935 127.787C144.985 125.332 144.396 122.906 143.225 120.747V120.606ZM77.7277 60.1612C77.7277 58.2825 78.474 56.4809 79.8024 55.1525C81.1308 53.8241 82.9324 53.0778 84.811 53.0778C86.6897 53.0778 88.4913 53.8241 89.8197 55.1525C91.1481 56.4809 91.8944 58.2825 91.8944 60.1612V92.6973C91.8944 94.5759 91.1481 96.3776 89.8197 97.7059C88.4913 99.0343 86.6897 99.7806 84.811 99.7806C82.9324 99.7806 81.1308 99.0343 79.8024 97.7059C78.474 96.3776 77.7277 94.5759 77.7277 92.6973V60.1612ZM84.9999 123.958C83.3935 123.958 81.8232 123.482 80.4875 122.59C79.1518 121.697 78.1107 120.429 77.496 118.944C76.8812 117.46 76.7204 115.827 77.0338 114.252C77.3472 112.676 78.1208 111.229 79.2567 110.093C80.3926 108.957 81.8398 108.183 83.4154 107.87C84.9909 107.557 86.624 107.717 88.1082 108.332C89.5923 108.947 90.8608 109.988 91.7533 111.324C92.6458 112.659 93.1222 114.23 93.1222 115.836C93.1222 117.99 92.2664 120.056 90.7432 121.579C89.22 123.103 87.1541 123.958 84.9999 123.958Z"
                fill="#E52520"
              />
            </svg>
          </div>
          <ul>
            <li>Make sure you have a stable internet connection.</li>
            <li>Do not 'close' or 'refresh' tab before submitting the exam.</li>
            <li>Do not click the ‘Back’ button on the browser while giving exam.</li>
          </ul>
        </div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#00A1FF" class="white--text px-2 mr-1" @click="$emit('openExamDialog', true);warningDialogue = false;$emit('close', false)">Start now</v-btn>
        <v-btn color="#E52520" class="px-2 ml-1" outlined @click="warningDialogue = false;$emit('close', false)">Not Now</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['examWarning'],
  data() {
    return {
      warningDialogue: false
    }
  },
  watch: {
    examWarning(newVal) {
      this.warningDialogue = newVal
    }
  }
}
</script>
