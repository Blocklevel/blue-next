/**
 * The application store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

// Store modules
// import locale from './modules/locale'

Vue.use(Vuex)

const { debug } = process.env

let plugins = []

if (debug) {
  plugins = [createLogger()]
}

export default new Vuex.Store({

  /**
   * Assign the modules to the store
   */
  modules: {},

  /**
   * If strict mode should be enabled
   */
  strict: debug,

  /**
   * Plugins used in the store
   */
  plugins
})
