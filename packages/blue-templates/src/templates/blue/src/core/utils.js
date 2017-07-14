import _ from 'lodash'
import { connect } from 'vuex-connect'

/**
 * Returns an object map of components
 * @param  {Array}   [components=[]]
 * @return {Object}
 */
export function mapComponents (components = []) {
  const context = require.context('../app', true, /\.vue$/)

  return _.reduce(context.keys(), (collection, component) => {
    const nameArray = component.split('/')
    const name = nameArray[nameArray.length - 2]

    if (components.indexOf(name) === -1) {
      return collection
    }

    const key = _.camelCase(name)

    if (collection[key]) {
      /* eslint-disable */
      console.error(`[utils] Component "${name}" already exists. Please make sure to always use unique names.`)
      /* eslint-enable */
      return collection
    }

    return { ...collection, [key]: context(component) }
  }, {})
}

/**
 * Returns a component connected to the Vuex store
 * @param  {String} name            component name
 * @param  {Object} vuexConnectData vuex-connect property object
 * @return {Object}
 */
export function connectComponent (name, vuexConnectData) {
  const component = mapComponents([name])
  const key = Object.keys(component)[0]

  if (!key) {
    throw new Error(`[utils] Component "${name}" doesn't exist`).message
  }

  return connect(vuexConnectData)(name, component[key])
}

/**
 * Returns a resolved page component instance
 * @param  {String}  path
 * @param  {Boolean} [root=true]
 * @return {Component}
 */
export function pageLoader (path, root = true) {
  const name = root ? `${path}/${path}` : path
  return resolve => require([`page/${name}.vue`], resolve)
}
