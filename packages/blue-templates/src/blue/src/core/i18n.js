import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import { getTranslations } from 'core/utils'

import store from './vuex'
import router from './router'

Vue.use(VueI18nManager, {
  store,
  router,
  config: {
    persistent: false,
    translations: getTranslations('../asset/lang'),
    defaultCode: 'en-GB',
    languages: [
      {
        name: 'English',
        code: 'en-GB',
        translationKey: 'en',
        urlPrefix: 'en'
      }
    ]
  }
})

export default {
  start: Vue.initI18nManager
}
