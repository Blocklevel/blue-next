'use strict'
const config = require('../../base.config')
const merge = require('webpack-merge')
const plugins = require('./plugins')
const rules = require('./rules')
const serverOptions = require('./server')

module.exports = merge.smart({}, config, {
  devtool: 'eval-source-map',
  devServer: serverOptions,
  plugins: config.plugins.concat(plugins),
  module: {
    rules
  }
})
