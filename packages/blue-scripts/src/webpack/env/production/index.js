'use strict'
const config = require('../../base.config')
const merge = require('webpack-merge')
const plugins = require('./plugins')
const rules = require('./rules')

module.exports = merge.smart({}, config, {
  devtool: false,
  plugins: config.plugins.concat(plugins),
  module: {
    rules
  }
})
