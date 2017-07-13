/**
 * The application store
 *
 * You can probably leave this code as it is.
 *
 * The only reason you have to touch this file, is that you might want to add
 * some new plugins for your store.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

const plugins = [
  // Vuex Promise Middleware
  // https://github.com/MatteoGabriele/vuex-promise-middleware
  require('vuex-promise-middleware')
]

if (debug) {
  plugins.push(
    require('vuex/dist/logger')()
  )
}

// Require all store modules
const modulesFolder = require.context('../app/data/store', true, /index.js$/)

// Add all modules to the 'modules' object
const modules = _.reduce(modulesFolder.keys(), (collection, item) => {
  const name = item.split('/')[1]
  return {
    ...collection,
    [name]: modulesFolder(item).default
  }
}, {})

export default new Vuex.Store({
  modules,
  strict: debug,
  plugins
})
