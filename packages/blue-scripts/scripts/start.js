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

const config = require('../config').getConfig()
const isWin = process.platform === 'win32'

portfinder.basePort = config.webpack.devServer.port || 8080

portfinder.getPortPromise().then(port => {
  const webpackConfig = config.webpack
  const { host } = webpackConfig.devServer
  const hostParams = {
    // see https://github.com/Blocklevel/blue-next/issues/25
    display: (host === '0.0.0.0' && isWin) ? 'localhost' : host,
    value: host
  }
  const serverUrl = `http://${hostParams.value}:${port}`

  const messages = [
    `Project ${chalk.bold.blue(config.projectName)} is running on http://${hostParams.display}:${port}\n`,
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

  server.listen(port, hostParams.value, function () {
    console.log('')
    console.log('Starting the server...')
  })
})
