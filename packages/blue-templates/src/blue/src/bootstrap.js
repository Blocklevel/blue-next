import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

import store from './app/store'
import routes from './app/routes'
import App from './app'

/**
 * Initialize vue-resource plugin to manage application routing
 */
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes
})

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
    path: 'static/lang'
  }
})

Vue.initI18nManager()

/**
 * Create new app instance
 */
const app = new App({
  store,
  router
})

app.$mount('#app')
