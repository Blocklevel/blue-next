const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const merge = require('webpack-merge')
const base = require('blue-scripts').getWebpackConfig()

module.exports = merge.smart({}, base, {
  devtool: '#cheap-module-source-map',
  output: {
    publicPath: '/dist/',
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist/')
  },
  plugins: base.plugins.concat([
    new VueSSRClientPlugin()
  ])
})
