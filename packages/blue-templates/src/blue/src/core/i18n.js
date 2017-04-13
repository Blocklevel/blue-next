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
      const options = { baseURL: '/' }
      return axios.get(`/static/lang/${translationKey}.json`, options)
        .then(response => response.data)
        .catch(() => {
          console.error(`Translation file "${translationKey}.json" not found.`)
          return {}
        })
    }
  }
})

export default {
  start: Vue.initI18nManager
}
