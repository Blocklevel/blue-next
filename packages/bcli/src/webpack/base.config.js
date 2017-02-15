'use strict'
const paths = require('../commons/paths')
const combineLoaders = require('webpack-combine-loaders')
const path = require('path')
const utils = require('../commons/utils')
const rulesFolder = path.resolve(__dirname, './rules/')

module.exports = {
  context: paths.appDirectory,
  entry: {
    app: [
      'babel-polyfill',
      paths.appEntry
    ]
  },
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: '[name].js'
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
      paths.appDirectory,
      paths.appNodeModules,
      paths.cliNodeModules
    ]
  },
  resolveLoader: {
    modules: [
      paths.appRoot,
      paths.appNodeModules,
      paths.cliNodeModules
    ]
  },
  module: {
    rules: utils.requireFromFolder(rulesFolder)
  },
  plugins: []
}
