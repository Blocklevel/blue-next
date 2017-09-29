const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const copy = require('graceful-copy')
const co = require('co')
const _ = require('lodash')

/**
 * Scaffolds a Blue project
 */
const createProject = co.wrap(function * (inputs) {
  // see Blocklevel/blue-next/issues/41
  const eslintrc = 'module.exports = require(\'eslint-config-blue\')'

  // see Blocklevel/blue-next/issues/44
  const gitignore = 'node_modules\nbuild\ntest\n*.gz\n*.map'

  const data = {
    name: inputs.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  const { dest } = inputs

  yield copy(inputs.template, dest, { data, clean: false })
  yield copy(inputs.cssTemplate, inputs.cssDest, { data, clean: false })

  fs.writeFileSync(path.resolve(dest, '.eslintrc.js'), eslintrc, 'utf-8')
  fs.writeFileSync(path.resolve(dest, '.gitignore'), gitignore, 'utf-8')
})

/**
 * Scaffold a component
 */
const createComponent = co.wrap(function * (inputs) {
  const data = _.assignIn({}, {
    author: yield utils.getGitUser()
  }, inputs)

  yield copy(inputs.template, inputs.dest, { data })

  utils.renameFilesFromDir(inputs.dest, inputs.name)
})

/**
 * Scaffolds a Vuex store module
 */
const createStoreModule = co.wrap(function * (inputs) {
  const data = _.assignIn({}, inputs, {
    author: yield utils.getGitUser(),
    noEvents: !inputs.addEvents,
    events: inputs.events ? utils.getEvents(inputs.events) : []
  })

  yield copy(inputs.template, inputs.dest, { data })
})

module.exports = {
  createProject,
  createComponent,
  createStoreModule
}
