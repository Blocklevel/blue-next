/**
 * The application store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const { debug } = process.env

let plugins = []

if (debug) {
  plugins = [createLogger()]
}

// Store modules
let modules = {}

// Load all store modules dynamically
const modulesFolder = require.context('./modules', true, /index.js$/)

modulesFolder.keys().forEach(module => {
  const name = module.split('/')[1]

  modules = {
    ...modules,
    [name]: modulesFolder(module).default
  }
})

export default new Vuex.Store({

  /**
   * Assign the modules to the store
   */
  modules,

  /**
   * If strict mode should be enabled
   */
  strict: debug,

  /**
   * Plugins used in the store
   */
  plugins
})
