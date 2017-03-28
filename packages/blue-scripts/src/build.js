'use strict'
const webpack = require('webpack')
const co = require('co')
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora()
const blueConfig = require('./commons/config')
const Progress = require('webpack/lib/ProgressPlugin')
const paths = require('./commons/paths')
const _ = require('lodash')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

module.exports = co.wrap(function * (options) {
  const config = blueConfig.get()

  console.log('')
  console.log(`Build ${chalk.bold.yellow(config.projectName)} project`)
  console.log('')

  spinner.start()

  if (config.isConfigurationModified) {
    spinner.text = 'Apply webpack proxy changes'
    spinner.succeed()
  }

  spinner.text = 'Compile project'
  spinner.start()

  const compile = webpack(config.webpack)

  if (config.webpackVerboseOutput) {
    compile.apply(new Progress())
  }

  compile.run(function (error, stats) {
    if (error) {
      console.log(chalk.red(error))
      process.exit(1)
    }

    spinner.succeed()
    console.log('')

    process.stdout.write(stats.toString({
      colors: true,
      hash: false,
      version: false,
      timings: false,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
})
