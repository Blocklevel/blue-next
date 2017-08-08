const fs = require('fs')
const utils = require('./utils')
const copy = require('graceful-copy')
const co = require('co')
const _ = require('lodash')

/**
 * Scaffolds a Blue project
 */
const createProject = co.wrap(function * (inputs) {
  const data = {
    name: inputs.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  yield copy(inputs.template, inputs.dest, { data, clean: false })
  yield copy(inputs.cssTemplate, inputs.cssDest, { data, clean: false })

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
    events: inputs.events
  })

  yield copy(inputs.template, inputs.dest, { data })
})

const createSSR = co.wrap(function * (inputs) {
  const { template, dest } = inputs
  const { name } = require(`${process.cwd()}/blue.config.js`)
  const data = _.assignIn({}, inputs, { name })

  yield copy(template, dest, { data })
})

module.exports = {
  createProject,
  createComponent,
  createStoreModule,
  createSSR
}
