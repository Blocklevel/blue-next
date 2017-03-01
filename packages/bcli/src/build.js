'use strict'
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const webpack = require('webpack')
const co = require('co')
const ora = require('ora')
const spinner = ora()
const bcliConfig = require('./commons/config')

module.exports = co.wrap(function * (options) {
  const config = bcliConfig.get()

  console.log('') // extra space
  spinner.text = `Building "${config.app.title}" project`
  spinner.start()

  webpack(config.webpack, function (error, stats) {
    if (error) {
      spinner.fail()
      return
    }

    spinner.succeed()
    console.log('')

    process.stdout.write(stats.toString({
      colors: true,
      modules: true,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
})
