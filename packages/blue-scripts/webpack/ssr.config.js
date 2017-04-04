const { VueSSRServerPlugin } = require('vue-ssr-webpack-plugin')
const config = require('../commons/config').get()
const paths = require('../commons/paths')

module.exports = Object.assign({}, config.webpack, {
  target: 'node',
  devtool: false,
  entry: `${paths.appDirectory}/src/server-entry.js`,
  output: Object.assign({}, config.webpack.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  })
})
