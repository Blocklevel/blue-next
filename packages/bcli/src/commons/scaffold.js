const utils = require('./utils')
const fs = require('fs')
const copy = require('graceful-copy')
const co = require('co')
const _ = require('lodash')

/**
 * Scaffolds a Blue project
 */
const project = co.wrap(function * (options) {
  const data = {
    name: options.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  yield copy(options.template, options.dest, { data })
  yield copy(options.cssTemplate, options.templateCssFolder, data)
})

/**
 * Scaffold a component
 */
const component = co.wrap(function * (options) {
  const data = _.assignIn({}, {
    author: yield utils.getGitUser()
  }, options)

  yield copy(options.template, options.dest, { data })
})

module.exports = {
  project,
  component
}
