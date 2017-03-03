'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const copy = require('graceful-copy')
const pathExists = require('path-exists')
const co = require('co')
const ora = require('ora')
const utils = require('./commons/utils')
const blueTemplates = require('blue-templates')

const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = 'Create a new Vuex store module'
  spinner.start()

  const name = _.kebabCase(options.name)
  const dest = `${process.cwd()}/src/app/store/modules/${name}`
  const exists = yield pathExists(dest)

  if (exists && !options.force) {
    spinner.fail()
    console.error(chalk.red('\n Looks like the module already exists\n'))

    yield utils.confirmPrompt()
  }

  const template = blueTemplates.getStoreModule()

  const data = {
    name,
    author: yield utils.getGitUser(),
    noEvents: !options.addEvents,
    hasNamespace: options.namespaced,
    events: utils.getEvents(options.eventsList)
  }

  yield copy(template, dest, { data })

  spinner.succeed()
  console.log(`\n  Vuex store module ${chalk.yellow.bold(name)} created and autoloaded in your application!`)
})
