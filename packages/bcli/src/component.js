'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const copy = require('graceful-copy')
const pathExists = require('path-exists')
const co = require('co')
const ora = require('ora')
const utils = require('./commons/utils')
const questions = require('./commons/questions')
const blueTemplates = require('blue-templates')

const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = `Create a new ${options.type}`
  spinner.start()

  const name = _.kebabCase(options.name)
  const dest = `${process.cwd()}/src/app/${options.type}/${name}`
  const exists = yield pathExists(dest)

  if (exists && !options.force) {
    spinner.fail()
    console.error(chalk.red(`\n Looks like ${dest} already exists\n`))
    yield questions.confirmPrompt()
  }

  const template = blueTemplates.getComponent()
  const data = _.assignIn(options, {
    name,
    author: yield utils.getGitUser()
  })

  // Copy template files to the new destination
  yield copy(template, dest, { data })

  // Rename all component files from the template to the component name
  utils.renameFilesFromDir(dest, name)

  spinner.succeed()

  console.log(`
  ${_.startCase(options.type)} ${chalk.yellow.bold(name)} created!

    ${chalk.italic(`import ${_.camelCase(name)} from '${options.type}/${name}/${name}.vue`)}'
  `)
})
