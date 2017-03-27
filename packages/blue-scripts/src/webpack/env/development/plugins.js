'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin')

module.exports = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"',
      VUE_ENV: '"client"'
    }
  }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  }),

  new webpack.HotModuleReplacementPlugin(),

  new webpack.NoEmitOnErrorsPlugin(),

  new webpack.NamedModulesPlugin(),

  new webpack.LoaderOptionsPlugin({
    options: {
      eslint: {
        formatter: require('eslint-formatter-pretty')
      }
    }
  }),

  new FlowBabelWebpackPlugin({
    warn: true
  })
]
