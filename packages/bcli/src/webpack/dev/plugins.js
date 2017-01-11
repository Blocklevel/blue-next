'use strict'
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('../../commons/utils')
const appConfig = utils.getAppConfig()
const serverOptions = require('./server')

const name = appConfig.title || 'Blue'
const port = appConfig.devServer && appConfig.devServer.port || serverOptions.port

module.exports = [
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  })
]
