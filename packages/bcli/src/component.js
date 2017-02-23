'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const copy = require('graceful-copy')
const pathExists = require('path-exists')
const co = require('co')
const ora = require('ora')
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = `Create a new ${options.type}`
  spinner.start()

  const isBlue = utils.hasConfig() || options.location === 'blue'
  const name = _.kebabCase(options.name)
  const blueStructure = `${paths.appRoot}/${options.type}/${name}`
  const currentFolder = `${paths.appDirectory}/${name}`
  const dest = isBlue ? blueStructure : currentFolder
  const exists = yield pathExists(dest)

  if (exists && !options.force) {
    spinner.fail()
    console.error(chalk.red(`\n Looks like the ${options.type} already exists\n`))

    yield utils.confirmPrompt()
  }

  const template = `${paths.cliTemplates}/component`
  const data = _.assignIn(options, {
    name,
    author: yield utils.getGitUser()
  })

  // Copy template files to the new destination
  yield copy(template, dest, { data })

  // Rename all component files from the template to the component name
  utils.renameFiles(dest, name)

  spinner.succeed()
  console.log(`\n  ${_.startCase(options.type)} ${chalk.yellow.bold(name)} created!`)

  if (isBlue) {
    console.log(`\n  Copy the import line for your ${options.type}:`)
    console.log(
      chalk.italic(`\n     import ${_.camelCase(name)} from '${options.type}/${name}/${name}.vue'`)
    )
  }
})
