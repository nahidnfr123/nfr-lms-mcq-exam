import Vue from 'vue'
import { SiteInfo, ActiveSiteFeatures, activeFeatures } from '@@/siteInfo'
import moment from 'moment'

const can = {
  methods: {
    $getSiteInfo(InfoName = '') {
      return InfoName ? SiteInfo[InfoName] : false
    },
    $activeFeatures(feature = '') {
      if (feature && (activeFeatures && activeFeatures.length)) return activeFeatures.includes(feature)

      return false
    },
    $hasFeature(feature = '', subFeatureName = '') {
      // return ActiveSiteFeatures.includes(feature)
      const mainFeature = ActiveSiteFeatures[feature]

      return mainFeature && subFeatureName && mainFeature.includes(subFeatureName)
    },
    $hasRole(role = null) {
      if (this.$auth.loggedIn && role) {
        const user_roles = this.$auth.user.roles ? this.$auth.user.roles : []

        if (Array.isArray(role)) {
          const Roles = user_roles

          for (const key in Roles) {
            if (role.includes(Roles[key])) return true
          }
        } else return !!user_roles.includes(role)
      }

      return false
    },
    $can(permission = '') {
      if (permission === 'public') return true
      if (this.$auth.loggedIn) {
        const user_permissions = this.$auth.user.permissions ? this.$auth.user.permissions : []

        if (user_permissions && user_permissions.length) {
          if (permission.length && Array.isArray(permission)) {
            const Permissions = user_permissions

            for (const key in Permissions) {
              if (permission.includes(Permissions[key])) return true
            }
          } else return !!user_permissions.includes(permission)
        }
      }

      return false
    },
    $hasFeatureAccess(accessRequirements) {
      let permission = true
      let feature = true

      if (accessRequirements?.can) permission = this.$can(accessRequirements.can)
      if (accessRequirements?.feature && accessRequirements.feature.length === 2)
        feature = this.$hasFeature(accessRequirements.feature[0], accessRequirements.feature[1])

      return (permission && feature)
    },
    isActiveFeature(pageName = '', feature = '') {
      // if (activeFeatures.hasOwnProperty(pageName)) {
      //   return activeFeatures[pageName].hasOwnProperty(feature) ? activeFeatures[pageName][feature] : true
      // }
      return true
    }
  }
}

Vue.mixin(can)
