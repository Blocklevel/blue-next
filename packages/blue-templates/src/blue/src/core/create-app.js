import Vue from 'vue'
import App from 'container/app/app.vue'
import createRouter from './create-router'
import createStore from './create-store'
import { sync } from 'vuex-router-sync'

export default function createApp () {
  const router = createRouter()
  const store = createStore()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
