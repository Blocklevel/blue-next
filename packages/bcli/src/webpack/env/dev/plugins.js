'use strict'
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env': {
      NODE_ENV: '"dev"'
    }
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  })
]
