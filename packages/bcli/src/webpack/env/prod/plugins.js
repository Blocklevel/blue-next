'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

module.exports = [
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env': {
      NODE_ENV: '"prod"'
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

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),

  new ExtractTextPlugin('styles.css')
]
