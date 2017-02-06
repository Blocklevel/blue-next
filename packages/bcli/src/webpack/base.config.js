'use strict'
const paths = require('../commons/paths')
const combineLoaders = require('webpack-combine-loaders')
const webpackModule = require('./module')

module.exports = {
  context: paths.appDirectory,
  entry: {
    app: [paths.appEntry]
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
      store: `${paths.appRoot}/store/modules`
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
  module: webpackModule,
  plugins: []
}
