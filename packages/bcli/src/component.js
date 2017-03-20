'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const co = require('co')
const ora = require('ora')
const utils = require('./commons/utils')
const scaffold = require('./commons/scaffold')

const spinner = ora()

module.exports = co.wrap(function * (args) {
  const { name, type, dest } = args

  console.log('')
  spinner.text = `Create a new ${type}`
  spinner.start()

  try {
    yield scaffold.component(args)
  } catch (error) {
    spinner.fail()
    throw error
  }

  spinner.succeed()

  console.log('')
  console.log(`   ${_.startCase(type)}`, chalk.yellow.bold(name), 'was created successfully!')
  console.log('')
  console.log(chalk.italic(`     import ${_.camelCase(name)} from '${type}/${name}/${name}.vue'`))
  console.log('')
})
