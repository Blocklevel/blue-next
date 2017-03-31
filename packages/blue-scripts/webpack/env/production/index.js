'use strict'
const config = require('../../base.config')
const webpackMerge = require('webpack-merge')
const plugins = require('./plugins')
const rules = require('./rules')

module.exports = webpackMerge.smart({}, config, {
  devtool: false,
  plugins: config.plugins.concat(plugins),
  module: {
    rules
  }
})
