import 'babel-polyfill'
import Vue from 'vue'
import VueConfigManager from 'vue-config-manager'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import app from 'component/app/app.vue'

import store from './vuex'
import router from './router'
import i18n from './i18n'

// Application configuration
Vue.use(VueConfigManager, {
  defaults: {
    debug: true,
    api: {
      baseURL: 'http://localhost:3000'
    }
  }
})

// Sync routes with Vuex store
sync(store, router)

// Set axios defaults
axios.defaults.headers.common.Accept = 'application/json'

// Start the i18n manager
i18n.start()

// Create and mount the application
new Vue({
  store,
  router,
  render: h => h(app)
}).$mount('#app')
