'use strict'
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./commons/utils')
const webpack = require('webpack')
const paths = require('./commons/paths')
const WebpackDevServer = require('webpack-dev-server')
const merge = require('webpack-merge')
const detectPort = require('./detect-port')
const co = require('co')
const bcliConfig = require('./commons/config')

module.exports = co.wrap(function * (options) {
  const config = bcliConfig.get()
  const webpackConfig = config.webpack
  const port = yield detectPort(webpackConfig.devServer.port)
  const host = webpackConfig.devServer.host
  const serverUrl =`http://${host}:${port}`

  // Add the FriendlyErrorsWebpackPlugin after everything is sorted.
  // We need this to be able to change server port in runtime and
  // display the current project and where it's served.
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`'${config.project.title}' is running on ${serverUrl}\n`]
      }
    })
  )

  // Add webpack-dev-server to the webpack entry point.
  // webpack-dev-server needs to point to the cli node_modules
  // folder or won't be recognized
  const devServerPath = `${paths.appNodeModules}/webpack-dev-server/client?${serverUrl}`
  webpackConfig.entry['devServer'] = devServerPath

  // Start the server!
  const server = new WebpackDevServer(
    webpack(webpackConfig),
    webpackConfig.devServer
  )

  server.listen(port, host, function () {
    console.log(`\n   Starting the server...`)
  })
})
