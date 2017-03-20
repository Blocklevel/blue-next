const utils = require('./utils')
const fs = require('fs')
const copy = require('graceful-copy')
const co = require('co')
const _ = require('lodash')

/**
 * Scaffolds a Blue project
 */
const project = co.wrap(function * (inputs) {
  const data = {
    name: inputs.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  yield copy(inputs.template, inputs.dest, { data })
  yield copy(inputs.cssTemplate, inputs.templateCssFolder, data)

  // see Blocklevel/blue-next/issues/41
  // see Blocklevel/blue-next/issues/44
  utils.replaceFilesName(inputs.dest, [`__.eslintrc.js`, `__.gitignore`], '__', '')
})

/**
 * Scaffold a component
 */
const component = co.wrap(function * (inputs) {
  const data = _.assignIn({}, {
    author: yield utils.getGitUser()
  }, inputs)

  yield copy(inputs.template, inputs.dest, { data })

  utils.renameFilesFromDir(inputs.dest, inputs.name)
})

/**
 * Scaffolds a Vuex store module
 */
const storeModule = co.wrap(function * (inputs) {
  const data = _.assignIn({}, inputs, {
    author: yield utils.getGitUser(),
    noEvents: !inputs.addEvents,
    events: utils.getEvents(inputs.events)
  })

  yield copy(inputs.template, inputs.dest, { data })
})

module.exports = {
  project,
  component,
  storeModule
}
