const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const base = require('blue-scripts').getWebpackConfig()

module.exports = merge.smart({}, base, {
  target: 'node',
  devtool: 'source-map',
  entry: './src/server-entry.js',
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VUE_ENV: '"server"'
      }
    }),
    new VueSSRServerPlugin()
  ]
})
