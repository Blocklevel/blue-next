import Vue from 'vue'
import Vuex from 'vuex'
import logger from 'vuex/dist/logger'

const isDebug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default function createStore () {
  const vuexContext = require.context('../app/data/store', true, /index.js$/)
  const plugins = []

  if (isDebug) {
    plugins.push(
      logger()
    )
  }

  return new Vuex.Store({
    modules: vuexContext.keys().reduce((map, item) => {
      const key = item.split('/')[1]
      return { ...map, [key]: vuexContext(item).default }
    }, {}),
    plugins,
    strict: isDebug
  })
}
