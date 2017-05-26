import Vue from 'vue'
import Vuex from 'vuex'

const isDebug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default function createStore () {
  const vuexContext = require.context('../app/data/store', true, /index.js$/)

  return new Vuex.Store({
    modules: vuexContext.keys().reduce((map, item) => {
      const key = item.split('/')[1]
      return { ...map, [key]: vuexContext(item).default }
    }, {}),
    strict: isDebug
  })
}
