const utils = require('./utils')
const fs = require('fs')
const copy = require('graceful-copy')
const co = require('co')

/**
 * Scaffolds a Blue project
 * @param  {Object} options
 */
const project = co.wrap(function * (options) {
  const data = {
    name: options.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  yield copy(options.template, options.dest, { data })
  yield copy(options.cssTemplate, `${options.dest}/src/asset/style`, data)
})

module.exports = {
  project
}
