'use strict'
const paths = require('../commons/paths')
const combineLoaders = require('webpack-combine-loaders')
const path = require('path')
const utils = require('../commons/utils')
const rulesFolder = path.resolve(__dirname, './rules/')

/**
 * TODO remove noDeprecation flag when issue is closed
 *
 * Flag that removes the issue on webpack/utils-loader
 * see https://github.com/webpack/loader-utils/issues/56
 * @type {Boolean}
 */
process.noDeprecation = true

module.exports = {
  context: paths.appDirectory,
  entry: {
    app: [paths.appEntry]
  },
  output: {
    path: `${paths.appBuild}`,
    publicPath: '/',
    chunkFilename: '[hash:8]/chunks/[chunkhash:8].js',
    filename: '[hash:8]/[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    alias: {
      component: `${paths.appRoot}/component`,
      page: `${paths.appRoot}/page`,
      store: `${paths.appRoot}/store/modules`,
      asset: `${paths.appSrc}/asset`
    },
    modules: [
      paths.cliNodeModules,
      paths.appNodeModules,
      paths.appDirectory
    ]
  },
  resolveLoader: {
    modules: [
      paths.cliNodeModules,
      paths.appNodeModules,
      paths.appRoot
    ]
  },
  module: {
    rules: utils.requireFromFolder(rulesFolder)
  },
  plugins: []
}
