import Vue from 'vue'
import moment from 'moment'

const mixins = {
  computed: {
    __TINYMCE_API_KEY() {
      return process.env.TINYMCE_API_KEY
    }
  },
  methods: {
    $now() {
      return moment().format('YYYY-MM-DD hh:mm A')
    },
    $sendToLoginWithNext(nextUrl = '') {
      if (!this.$auth.loggedIn) this.$router.push('/auth/signin?next=' + (nextUrl ? nextUrl : window.location.pathname))
      else if (nextUrl) this.$router.push(nextUrl)
      // this.$store.commit('loginRedirect/setRedirectTo', nextUrl ? nextUrl : window.location.pathname)
    },
    $isBetweenTime(start_time, end_time) {
      if (start_time && end_time) return moment().isBetween(item.start_time, item.end_time)

      return false
    },
    $isBeforeTime(time) {
      if (time) return moment().isSameOrBefore(time, 'seconds')

      return false
    },
    $isAfterTime(time) {
      if (time) return moment().isSameOrAfter(time, 'seconds')

      return false
    },
    $payableAmount(item) {
      if (item.subscription_status) {
        if (item.subscription_status === 'active') return 0
        if (item.subscription_status === 'expired') return 0
      }
      if (!item.price || parseInt(item.price) <= 0) return 0
      if (item.discount_till && moment(item.discount_till).isValid()) {
        if (moment().isSameOrBefore(item.discount_till)) return item.discounted_price
      }

      return item.price
    },
    $calculateDiscount(item, couponDiscount = null) {
      if (item.subscription_status) {
        if (item.subscription_status === 'active')
          return `<div style="color: var(--generalThemeColor)" class="color-success"><strong>${item.subscription_status}</strong></div>`
        if (item.subscription_status === 'expired')
          return `<div style="color: var(--generalThemeColor)" class="color-orange"><strong>${item.subscription_status}</strong></div>`
      }
      if (item.owned) {
        return `<div style="color: var(--generalThemeColor)" class="color-success"><strong>Read</strong></div>`
      }
      if (!item.price || parseInt(item.price) <= 0)
        return '<div style="color: var(--generalThemeColor)"><strong>Free</strong></div>'
      if (item.discount_till && moment(item.discount_till).isValid()) {
        if (moment().isSameOrBefore(item.discount_till))
          return `<div>
                  <span style="text-decoration: line-through;">৳ ${item.price}</span>
                  <strong class="red--text">৳ ${couponDiscount ? Number(item.discounted_price) - couponDiscount : item.discounted_price}</strong></div>`
      }

      return `<div class="red--text"><strong>৳ ${couponDiscount ? Number(item.price) - couponDiscount : item.price}</strong></div>`
    },
    $number(value) {
      const number = parseFloat(value) * 10

      if (number % 10) {
        return parseFloat(value)
      } else {
        return parseInt(value)
      }
    },
    $dateTimeFormats(value) {
      if (!moment(value).isValid()) return value

      return moment(value).format('D-MMM-Y hh:mm a')
    },
    truncate(text, length, clamp) {
      clamp = clamp || '...'
      const node = document.createElement('div')

      node.innerHTML = text
      const content = node.textContent

      return content.length > length ? content.slice(0, length) + clamp : content
    },
    __TINYMCE_PLUGINS(hasMath = false, height = 260) {
      const extensions = {
        /*plugins: 'a11ychecker advcode casechange export formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
        toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen table',*/
        toolbar_mode: 'floating',
        height: height,
        // menubar: true,
        menubar: 'favs file edit view insert format tools table help insert',
        htmlAllowedTags: ['.*'],
        htmlAllowedAttrs: ['.*'],
        draggable_modal: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'image',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic forecolor backcolor | alignleft aligncenter ' +
          '| image |' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry | ' +
          'removeformat | table | code | help | ' +
          'searchreplace | emoticons',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        a11y_advanced_options: true,
        // file_picker_types: 'file image media',
        file_picker_types: 'image',
        images_upload_handler: (blobInfo, success, failure, progress) => {
          const url = 'upload-photo'
          const formData = new FormData

          formData.append('photo', blobInfo.blob(), blobInfo.filename())
          this.$axios.post(url, formData).then((response) => {
            success(response.data)
          })
        }
        /*external_plugins: {
          'tiny_mce_wiris': 'node_modules/@wiris/mathtype-tinymce5/plugin.min.js'
        }*/
      }

      if (hasMath) {
        extensions.external_plugins = {
          tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js'
        }
      }

      return extensions
    }
  }
}

Vue.mixin(mixins)
