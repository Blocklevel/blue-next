'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const copy = require('graceful-copy')
const pathExists = require('path-exists')
const co = require('co')
const ora = require('ora')
const emoji = require('node-emoji').emoji
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = 'Create a new Vuex store module'
  spinner.start()

  const name = _.kebabCase(options.name)
  const blueStructure = `${paths.appRoot}/store/modules/${name}`
  const currentFolder = `${paths.appDirectory}/${name}`
  const dest = options.location === 'blue' ? blueStructure : currentFolder
  const exists = yield pathExists(dest)

  if (exists && !options.force) {
    spinner.fail()
    console.error(chalk.red('\n Looks like the module already exists\n'))

    yield utils.confirmPrompt()
  }

  const template = `${paths.cliTemplates}/store`
  const data = {
    name,
    author: yield utils.getGitUser(),
    noEvents: !options.addEvents,
    events: utils.getEvents(options.eventsList)
  }

  yield copy(template, dest, { data })

  spinner.succeed()
  console.log(`\nVuex store module ${chalk.yellow.bold(name)} created!`, emoji.heart)
})
