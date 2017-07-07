const utils = require('./utils')
const copy = require('kopy')
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

  yield copy(inputs.template, inputs.dest, { data, clean: false })
  yield copy(inputs.cssTemplate, inputs.templateCssFolder, { data, clean: false })

  utils.replaceFilesName(inputs.dest, [
    // see Blocklevel/blue-next/issues/41
    `#.eslintrc.js#`,
    // see Blocklevel/blue-next/issues/44
    `#.gitignore#`
  ])
})

/**
 * Scaffold a component
 */
const component = co.wrap(function * (inputs) {
  const data = _.assignIn({}, {
    author: yield utils.getGitUser(),
    hooks: !!inputs.options.hooks
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
