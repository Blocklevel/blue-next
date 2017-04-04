'use strict'
const paths = require('../commons/paths')
const utils = require('../commons/utils')

/**
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
    path: paths.appBuild,
    publicPath: '/dist/',
    chunkFilename: `${paths.appBuildHash}/chunks/[chunkhash:8].js`,
    filename: `${paths.appBuildHash}[name].js`
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    alias: {
      mixin: `${paths.appRoot}/mixin`,
      proxy: `${paths.appRoot}/proxy`,
      container: `${paths.appRoot}/container`,
      component: `${paths.appRoot}/component`,
      page: `${paths.appRoot}/page`,
      store: `${paths.appRoot}/store/modules`,
      asset: `${paths.appSrc}/asset`
    },
    modules: [
      paths.appNodeModules,
      paths.appDirectory
    ]
  },
  // @remove-on-eject-begin
  resolveLoader: {
    modules: [
      paths.appNodeModules,
      paths.ownNodeModules
    ]
  },
  // @remove-on-eject-end
  module: {
    rules: utils.requireFromFolder(paths.webpackRules)
  },
  plugins: [
    // leave it empty if no plugins are added
  ]
}
