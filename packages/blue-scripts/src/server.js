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

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

module.exports = co.wrap(function * (options) {
  const config = blueConfig.get()
  const webpackConfig = config.webpack
  const port = yield detectPort
  const host = utils.getHost(webpackConfig.devServer.host)
  const serverUrl = `http://${host.value}:${port}`

  const messages = [
    // see https://github.com/Blocklevel/blue-next/issues/25
    `Project ${chalk.bold.blue(config.projectName)} is running on http://${host.display}:${port}\n`,
    `Your current ip address ${ip.address()}\n`
  ]

  if (config.isConfigurationModified) {
    messages.push('blue.config.js modifiers applied')
  }

  // Add the FriendlyErrorsWebpackPlugin after everything is sorted.
  // We need this to be able to change server port in runtime and
  // display the current project and where it's served.
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: { messages }
    })
  )

  // Add webpack-dev-server and webpack HMR to the webpack entry point.
  webpackConfig.entry.app.unshift(
    `webpack-dev-server/client?${serverUrl}`,
    'webpack/hot/dev-server'
  )

  // Start the server!
  const server = new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer)

  server.listen(port, host.value, function () {
    console.log(`\n   Starting the server...`)
  })
})
