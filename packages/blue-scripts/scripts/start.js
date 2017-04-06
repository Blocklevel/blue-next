'use strict'

// Set the current node environment
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

const chalk = require('chalk')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const portfinder = require('portfinder')
const ip = require('ip')

const utils = require('../commons/utils')
const config = require('../commons/config').get()

portfinder.basePort = 8080

portfinder.getPortPromise().then(port => {
  const webpackConfig = config.webpack
  const host = utils.getHost(webpackConfig.devServer.host)
  const serverUrl = `http://${host.value}:${port}`

  const messages = [
    // see https://github.com/Blocklevel/blue-next/issues/25
    `Project ${chalk.bold.blue(config.projectName)} is running on http://${host.display}:${port}\n`,
    `Your current ip address ${ip.address()}\n`
  ]

  if (config.isConfigurationModified) {
    messages.push('blue.config.js changes applied')
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

  const server = new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer)

  // Start the server!
  server.listen(port, host.value, function () {
    console.log('')
    console.log('Starting the server...')
  })
})
