import camelCase from 'lodash/camelCase'
import { connect } from 'vuex-connect'

export default class BlueUtils {
  constructor ({ componentsContext, vuexContext }) {
    this.componentsContext = componentsContext
    this.vuexContext = vuexContext
  }

  /**
   * [mapComponents description]
   * @param  {Array}  [filenames=[]] [description]
   * @return {[type]}                [description]
   */
  mapComponents (filenames = []) {
    return this.componentsContext.keys().reduce((map, component) => {
      const names = component.split('/')
      const name = names[names.length - 2]

      if (filenames.indexOf(name) === -1) {
        return map
      }

      const key = camelCase(name)

      if (map[key]) {
        throw new Error(
          `[BlueUtils] Component ${name} already exists. Please make sure to use unique names.`
        )
      }

      return { ...map, [key]: this.componentsContext(component) }
    }, {})
  }

  /**
   * [connectComponent description]
   * @param  {[type]} name            [description]
   * @param  {Object} [connection={}] [description]
   * @return {[type]}                 [description]
   */
  connectComponent (name, connection = {}) {
    const maps = this.mapComponents([name])
    const keys = Object.keys(maps)

    if (!keys.length) {
      throw new Error(
        `[BlueUtils] There is no ${name} component listed in you application.`
      )
    }

    return connect(connection)(name, maps[keys[0]])
  }

  registerStoreModules () {
    return this.vuexContext.keys().reduce((map, storeModule) => {
      const name = storeModule.split('/')[1]
      return { ...map, [name]: this.vuexContext(storeModule).default }
    }, {})
  }
}
