/**
 * The application store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'dev'

const plugins = []

if (debug) {
  plugins.push(createLogger())
}

let modules = {}

// Load all store modules in the '/modules' folder
const modulesFolder = require.context('./modules', true, /index.js$/)

// Add all modules to the 'modules' object
modulesFolder.keys().forEach(module => {
  const name = module.split('/')[1]
  modules = {
    ...modules,
    [name]: modulesFolder(module).default
  }
})

export default new Vuex.Store({
  modules,
  strict: debug,
  plugins
})
