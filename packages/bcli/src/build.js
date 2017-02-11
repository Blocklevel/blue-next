'use strict'
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const webpack = require('webpack')
const envConfig = require('./webpack/prod')
const merge = require('webpack-merge')
const co = require('co')
const ora = require('ora')
const spinner = ora()

module.exports = co.wrap(function * (options) {
  const appConfig = utils.getAppConfig()
  const webpackConfig = merge.smart({}, envConfig, appConfig.options)

  console.log('') // extra space
  spinner.text = `Building "${appConfig.title}" project`
  spinner.start()

  webpack(webpackConfig, function (error, stats) {
    if (error) {
      spinner.fail()
      return
    }

    spinner.succeed()

    console.log('')

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
})
