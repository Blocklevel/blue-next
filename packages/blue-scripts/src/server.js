'use strict'
const chalk = require('chalk')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const paths = require('./commons/paths')
const utils = require('./commons/utils')
const WebpackDevServer = require('webpack-dev-server')
const detectPort = require('./detect-port')
const co = require('co')
const blueConfig = require('./commons/config')
const ip = require('ip')

module.exports = co.wrap(function * (options) {
  const config = blueConfig.get()
  const webpackConfig = config.webpack
  const port = yield detectPort(webpackConfig.devServer.port)
  const host = utils.getHost(webpackConfig.devServer.host)
  const serverUrl = `http://${host.value}:${port}`

  // Add the FriendlyErrorsWebpackPlugin after everything is sorted.
  // We need this to be able to change server port in runtime and
  // display the current project and where it's served.
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          // see https://github.com/Blocklevel/blue-next/issues/25
          `Project ${chalk.bold.blue(config.project.title)} is running on http://${host.display}:${port}\n`,
          `Your current ip address ${ip.address()}`
        ]
      }
    })
  )

  // Add webpack-dev-server to the webpack entry point.
  // webpack-dev-server needs to point to the cli node_modules
  // folder or won't be recognized
  const devServerUrl = `${paths.appNodeModules}/webpack-dev-server/client?${serverUrl}`
  webpackConfig.entry['devServer'] = devServerUrl

  // Start the server!
  const server = new WebpackDevServer(
    webpack(webpackConfig),
    webpackConfig.devServer
  )

  server.listen(port, host, function () {
    console.log(`\n   Starting the server...`)
  })
})
