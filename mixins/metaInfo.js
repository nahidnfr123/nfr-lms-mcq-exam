export default {
  head() {
    return {
      title: this.pageMetaInfo ? this.pageMetaInfo.title : '',
      meta: [
        {
          hid: 'title',
          name: 'title',
          content: this.pageMetaInfo ? this.pageMetaInfo.title : ''
        },
        {
          hid: 'description',
          name: 'description',
          content: this.pageMetaInfo ? this.pageMetaInfo.title : ''
        },
        {
          hid: 'image',
          property: 'image',
          content: this.pageMetaInfo.photo ? this.pageMetaInfo.photo : ''
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'video.other'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.pageMetaInfo ? this.pageMetaInfo.title : ''
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.pageMetaInfo.description ? this.pageMetaInfo.description : ''
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.pageMetaInfo.photo ? this.pageMetaInfo.photo : ''
        }
      ]
    }
  },
  computed: {
    pageMetaInfo() {
      if (this.pageMetaItem && Object.keys(this.pageMetaItem).length) {
        return {
          title: this.pageMetaItem.title || this.pageMetaItem.subtitle || this.pageMetaItem.name,
          description: this.pageMetaItem.description || this.pageMetaItem.details || this.pageMetaItem.title || this.pageMetaItem.name,
          photo: this.pageMetaItem.photo || this.pageMetaItem.image || this.pageMetaItem.link || this.pageMetaItem.src
        }
      } else {
        return {
          title: this.$getSiteInfo('siteName'),
          description: this.$getSiteInfo('siteName'),
          photo: this.$getSiteInfo('siteLogo')
        }
      }
    }
  }
}
