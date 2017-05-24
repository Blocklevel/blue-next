import Vue from 'vue'
import VueRouter from 'vue-router'
import { pageLoader } from 'lib/utils'

Vue.use(VueRouter)

const baseUrl = process.env.BASE_URL

export default function createRouter () {
  return new VueRouter({
    base: baseUrl,
    mode: 'history',
    routes: [
      {
        name: 'home',
        path: '/',
        component: pageLoader('home')
      }
    ]
  })
}
