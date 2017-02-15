const vue = require('../../rules/vue')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

vue.options.loaders.css = ExtractTextPlugin.extract({
  use: 'css-loader',
  fallback: 'vue-style-loader'
})

module.exports = [vue]
