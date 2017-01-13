'use strict'
const paths = require('../commons/paths')
const combineLoaders = require('webpack-combine-loaders')
const babelOptions = require('./babelOptions')

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
    root: paths.appSrc,
    extensions: ['', '.js', '.vue', '.css'],
    alias: {
      // Vue is installed in the project itself because it can't be coupled with the cli
      vue: 'vue/dist/vue.js',
      component: `${paths.appRoot}/component`,
      store: `${paths.appRoot}/store/modules`,
      page: `${paths.appRoot}/page`
    },
    modules: [
      paths.appDirectory,
      paths.appNodeModules,
      paths.cliNodeModules
    ]
  },
  resolveLoader: {
    modulesDirectories: [
      paths.appNodeModules,
      paths.cliNodeModules
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelOptions
      },
      {
        test: /\.vue$/,
        // vue-loader is installed in the project itself because it can't be coupled with the cli
        loader: 'vue-loader'
      },
      {
        test: /\.html$/,
        loader: require.resolve('html-loader')
      }
    ]
  },
  vue: {
    loaders: {
      js: combineLoaders([
        {
          loader: 'babel-loader',
          query: babelOptions
        }
      ])
    }
  },
  plugins: []
}
