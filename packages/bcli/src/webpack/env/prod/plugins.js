'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")

const webpack = require('webpack')

module.exports = [
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env': {
      NODE_ENV: '"production"' // this needs to be production for reducing file size
    }
  }),

  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  }),

  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: false
    },
    comments: false,
    minimize: false
  }),

  new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
  }),

  new ExtractTextPlugin({
    filename: '[hash:8]/[name].css',
    ignoreOrder: true,
    allChunks: true
  })
]
