import Vue from 'vue'
import VueResource from 'vue-resource'
import VueI18nManager from 'vue-i18n-manager'
import VueAnalytics from 'vue-analytics'
import { sync } from 'vuex-router-sync'

import App from './app'
import router from 'src/app/router'
import store from 'src/app/store'

/**
* Initialize base application styles
*/
require('./asset/style/base.css')

/**
 * The debug mode is available globally in the Vue.config.debug property
 */
Vue.config.debug = process.env.debug

/**
 * Initialize vue-resource plugin to manage http requests
 */
Vue.use(VueResource)

Vue.http.headers.common.Accept = 'application/json'

/**
 * Analytics
 */
Vue.use(VueAnalytics, { router })

/**
 * Create new app instance
 */
const app = new Vue(App)

/**
 * Sync store and router
 */
sync(store, router)

/**
 * I18N manager
 */
Vue.use(VueI18nManager, {
  store,
  router,
  config: {
    path: `${process.env.publicPath}static/lang`
  }
})

Vue.initI18nManager().then(() => {
  app.$mount('#app')
})
