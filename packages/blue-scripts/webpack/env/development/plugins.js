'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isServer = process.env.VUE_ENV

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"',
      VUE_ENV: '"client"',
      BASE_URL: '"/"'
    }
  }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  }),

  new webpack.NamedModulesPlugin(),

  new webpack.LoaderOptionsPlugin({
    options: {
      eslint: {
        formatter: require('eslint-formatter-pretty')
      }
    }
  })
]

if (!isServer) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = plugins
