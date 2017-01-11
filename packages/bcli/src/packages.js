'use strict'
const chalk = require('chalk')
const co = require('co')
const ora = require('ora')
const emoji = require('node-emoji').emoji
const execa = require('execa')
const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = 'Install dependencies'
  spinner.start()

  try {
    yield execa.shell(`npm install --save ${options.dependencies.join(' ')}`)
  } catch (error) {
    spinner.fail()
    console.error(chalk.red(`\n${error.stderr}`))
    return
  }

  spinner.succeed()
  console.log(`\nPackages installed!`, emoji.heart)
})
