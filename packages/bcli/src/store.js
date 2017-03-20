'use strict'
const chalk = require('chalk')
const co = require('co')
const ora = require('ora')
const utils = require('./commons/utils')
const scaffold = require('./commons/scaffold')

const spinner = ora()

module.exports = co.wrap(function * (inputs) {
  console.log('')
  spinner.text = 'Create a store module'
  spinner.start()

  try {
    yield scaffold.storeModule(inputs)
  } catch (error) {
    spinner.fail()
    throw error
  }

  spinner.succeed()

  console.log('')
  console.log(`Vuex store module ${chalk.yellow.bold(inputs.name)} created!`)
  console.log('The module is autoloaded in your application!')
  console.log('')
})
