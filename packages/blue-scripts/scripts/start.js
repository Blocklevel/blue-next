'use strict'

// Set the current node environment
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

const chalk = require('chalk')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const portfinder = require('portfinder')
const MFS = require('memory-fs')
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

  const clientCompiler = webpack(webpackConfig)

  if (config.isomorphic.enabled) {
    const bootstrap = require(config.isomorphic.path)
    const serverConfig = require('../webpack/ssr.config')
    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS()

    const devOptions = {
      publicPath: webpackConfig.output.publicPath,
      serverSideRender: true,
      quiet: true,
      stats: {
        colors: true,
        chunks: false
      }
    }

    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, devOptions)
    const hotMiddleware = require('webpack-hot-middleware')(clientCompiler)
    const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
    const middleware = [devMiddleware, hotMiddleware]
    const hostName = '0.0.0.0'
    const devHooks = bootstrap({ port, hostName, middleware })

    serverCompiler.outputFileSystem = mfs

    serverCompiler.watch({}, (error, stats) => {
      if (error) {
        throw error
      }

      devHooks.bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'))
    })

    return
  }

  // Add webpack-dev-server and webpack HMR to the webpack entry point.
  webpackConfig.entry.app.unshift(
    `webpack-dev-server/client?${serverUrl}`,
    'webpack/hot/dev-server'
  )

  const server = new WebpackDevServer(clientCompiler, webpackConfig.devServer)

  // Start the server!
  server.listen(port, host.value, function () {
    console.log('')
    console.log('Starting the server...')
  })
})
