'use strict'

// Set the current node environment
process.env.NODE_ENV = 'production'
// Creates am hash string that can be used across the application
// see Blocklevel/blue-next/issues/38
process.env.VERSION_STRING = new Date().getTime().toString()
// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')
const Progress = require('webpack/lib/ProgressPlugin')

const log = require('../commons/log')
const config = require('../commons/config').get()
const spinner = ora()

log.clean()

console.log('')
console.log(`Build ${chalk.bold.yellow(config.projectName)} project`)
console.log('')

spinner.start()

// Notify any changes made via blue.config.js file
if (config.isConfigurationModified) {
  spinner.text = 'Apply blue.config.js changes'
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
    spinner.fail()
    log.write(error)
    console.log(`\n${chalk.red(error)}`)
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
