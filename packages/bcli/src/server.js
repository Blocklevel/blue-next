'use strict'
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const webpack = require('webpack')
const envConfig = require('./webpack/dev')
const WebpackDevServer = require('webpack-dev-server')
const merge = require('webpack-merge')
const detectPort = require('./detect-port')
const co = require('co')

module.exports = co.wrap(function * () {
  const appConfig = utils.getAppConfig()
  const webpackConfig = merge.smart({}, envConfig, appConfig.options)
  const port = yield detectPort(webpackConfig.devServer.port)
  const serverUrl = `http://localhost:${port}`

  // Add the FriendlyErrorsWebpackPlugin after everything is sorted.
  // We need this to be able to change server port in runtime and
  // display the current project and where it's served.
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`'${appConfig.title}' is running on http://localhost:${port}\n`]
      }
    })
  )

  // add webpack-dev-server to the webpack entry point
  // webpack-dev-server needs to point to the cli node_modules folder or won't be recognized
  const devServerPath = `${paths.cliNodeModules}/webpack-dev-server/client?${serverUrl}`
  webpackConfig.entry.app.unshift(devServerPath)

  // start the server!
  const server = new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer)
  server.listen(port)
})
