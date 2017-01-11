'use strict'
const config = require('./base.config')
const serverOptions = require('./dev/server')
const plugins = require('./dev/plugins')
const merge = require('webpack-merge')
const preLoaders = require('./dev/preLoaders')

module.exports = merge(config, {
  devTool: 'evel-source-map',
  devServer: serverOptions,
  plugins: config.plugins.concat(plugins),
  module: {
    preLoaders: preLoaders
  },
  eslint: {
    configFile: require.resolve('eslint-config-blocklevel')
  }
})
