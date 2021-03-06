import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import store from './vuex'
import router from './router'
import axios from 'axios'

Vue.use(VueI18nManager, {
  store,
  router,
  proxy: {
    getTranslation ({ translationKey }) {
      const options = { baseURL: process.env.BASE_URL }
      return axios.get(`/static/lang/${translationKey}.json`, options)
        .then(response => response.data)
        .catch(() => {
          /* eslint-disable */
          console.error(`Translation file "${translationKey}.json" not found.`)
          /* eslint-enable */
          return {}
        })
    }
  }
})

export default {
  start: Vue.initI18nManager
}
