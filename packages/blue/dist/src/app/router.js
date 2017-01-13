import VueRouter from 'vue-router'
import Vue from 'vue'
import routes from './routes'

/**
 * Router
 */
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  routes
})
