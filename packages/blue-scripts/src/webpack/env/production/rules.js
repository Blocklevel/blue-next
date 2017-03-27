const vue = require('../../rules/vue')
const babel = require('../../rules/babel')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

vue.options.cssModules.localIdentName = '[hash:8]'

vue.options.loaders.css = ExtractTextPlugin.extract({
  use: 'css-loader',
  fallback: 'vue-style-loader'
})

babel.options.plugins = [require.resolve('babel-plugin-transform-flow-strip-types')]

module.exports = [vue, babel]
