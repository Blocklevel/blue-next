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
})

/**
 * Scaffold a component
 */
const component = co.wrap(function * (inputs) {
  const data = _.assignIn({}, {
    author: yield utils.getGitUser()
  }, inputs, inputs.options)

  yield copy(inputs.template, inputs.dest, { data })
})

module.exports = {
  project,
  component
}
