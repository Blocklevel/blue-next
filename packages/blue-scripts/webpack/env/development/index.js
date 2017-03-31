'use strict'
const config = require('../../base.config')
const serverOptions = require('./server')
const plugins = require('./plugins')
const webpackMerge = require('webpack-merge')

module.exports = webpackMerge.smart({}, config, {
  devtool: 'eval-source-map',
  devServer: serverOptions,
  plugins: config.plugins.concat(plugins),
  performance: {
    hints: false
  }
})
