import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store/{{ name }}'

Vue.use(Vuex)

describe('store/{{ name }}', () => {
  let $store

  beforeEach(() => {
    $store = new Vuex.Store(store)
  })

  it ('should be a test', () => {
    // start testing!
  })
})
