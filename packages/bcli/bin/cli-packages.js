'use strict'
const chalk = require('chalk')
const co = require('co')
const runPackages = require('../src/packages')
const inquirer = require('inquirer')
const deps = require('../src/commons/dependencies')
const _ = require('lodash')

module.exports = co.wrap(function * (input, flags) {
  let answer = yield inquirer.prompt([
    {
      type: 'checkbox',
      name: 'dependencies',
      message: 'Select the packages you\'d like to install',
      choices: deps
    }
  ])

  const options = _.assignIn(answer, flags)

  return runPackages(options).catch(err => {
    console.error(chalk.red(err.stack))
    return
  })
})
