import Vue from 'vue'
import VueRouter from 'vue-router'
import { routeParser } from 'vue-i18n-manager'
import { sync } from 'vuex-router-sync'

import store from './vuex'
import routes from '../app/routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // Apply routes with language route parser.
  // The routeParser helper will inject the `params.lang` object
  // in every listed route.
  routes: routeParser(routes)
})

// Sync routes with Vuex store
sync(store, router)

export default router
