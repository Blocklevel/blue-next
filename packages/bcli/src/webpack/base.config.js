'use strict'
const paths = require('../commons/paths')

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
      vue: 'vue/dist/vue.js'
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
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: [
            [
              require.resolve('babel-preset-es2015'),
              { module: false }
            ],
            require.resolve('babel-preset-stage-2')
          ],
          plugins: [
            require.resolve('babel-plugin-transform-runtime')
          ]
        }
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
  plugins: []
}
