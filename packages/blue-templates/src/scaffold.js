const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const copy = require('kopy')
const co = require('co')
const semver = require('semver')
const pkg = require('../package.json')
const getPath = relativePath => path.resolve(__dirname, relativePath)

const getBlue = () => getPath('./templates/blue')
const getPreProcessor = type => getPath(`./templates/pre-processor/${type}`)
const getComponent = () => getPath('./templates/component')
const getStoreModule = () => getPath('./templates/store')
const getSSR = () => getPath('./templates/ssr')

const getStylePath = dir => `${dir}/src/asset/style`
const getStoreModulePath = dir => `${dir}/src/app/data/store`
const getComponentPath = (dir, type) => `${dir}/src/app/${type}`

/**
 * Scaffolds a Blue project
 */
const createProject = co.wrap(function * (inputs) {
  const paths = {
    template: getBlue(),
    cssTemplate: getPreProcessor('postcss'),
    cssDest: getStylePath(inputs.dest),
    dest: inputs.dest
  }

  const data = {
    name: inputs.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  yield copy(paths.template, paths.dest, { data, clean: false })

  yield copy(paths.cssTemplate, paths.cssDest, { data, clean: false })

  utils.replaceFilesName(paths.dest, [
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
  const data = Object.assign({}, {
    author: yield utils.getGitUser()
  }, inputs)

  yield copy(inputs.template, inputs.dest, { data })

  utils.renameFilesFromDir(inputs.dest, inputs.name)
})

/**
 * Scaffolds a Vuex store module
 */
const createStoreModule = co.wrap(function * (inputs) {
  const data = Object.assign({}, inputs, {
    author: yield utils.getGitUser(),
    events: inputs.events
  })

  yield copy(inputs.template, inputs.dest, { data })
})

/**
 * Scaffolds SSR
 */
const createSSR = co.wrap(function * (inputs) {
  const { template, dest } = inputs
  const { name } = require(`${process.cwd()}/blue.config.js`)
  const data = Object.assign({}, inputs, { name })

  yield copy(template, dest, { data })
})

module.exports = {
  createProject,
  createComponent,
  createStoreModule,
  createSSR,
  getBlue,
  getPreProcessor,
  getComponent,
  getStoreModule,
  getStylePath,
  getStoreModulePath,
  getComponentPath,
  getSSR
}
