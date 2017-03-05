'use strict'
const paths = require('../commons/paths')
const path = require('path')
const utils = require('../commons/utils')
const rulesFolder = path.resolve(__dirname, './rules/')

/**
 * Flag that removes the issue on webpack/utils-loader
 * see https://github.com/webpack/loader-utils/issues/56
 * @type {Boolean}
 */
process.noDeprecation = true

module.exports = {
  context: paths.appDirectory,
  entry: {
    app: paths.appEntry
  },
  output: {
    path: `${paths.appBuild}`,
    publicPath: '/',
    chunkFilename: '[hash:8]/chunks/[chunkhash:8].js',
    filename: '[hash:8]/[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.scss'],
    alias: {
      component: `${paths.appRoot}/component`,
      page: `${paths.appRoot}/page`,
      store: `${paths.appRoot}/store/modules`,
      asset: `${paths.appSrc}/asset`
    },
    modules: [
      paths.appNodeModules,
      paths.appDirectory,
      paths.ownNodeModules
    ]
  },
  resolveLoader: {
    modules: [
      paths.appNodeModules,
      paths.appDirectory,
      paths.ownNodeModules
    ]
  },
  module: {
    rules: utils.requireFromFolder(rulesFolder)
  },
  plugins: []
}
