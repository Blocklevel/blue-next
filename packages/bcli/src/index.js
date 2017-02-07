'use strict'
const _ = require('lodash')
const inquirer = require('inquirer')
const chalk = require('chalk')
const copy = require('graceful-copy')
const execa = require('execa')
const pathExists = require('path-exists')
const co = require('co')
const ora = require('ora')
const emoji = require('node-emoji').emoji
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const commonQuestions = require('./commons/questions')
const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = 'Create a new awesome project'
  spinner.start()

  const name = _.kebabCase(options.projectName)
  const folderName = _.kebabCase(options.folderName)
  const dest = `${paths.appDirectory}/${folderName}`
  const exists = yield pathExists(dest)

  if (exists && !options.force) {
    spinner.fail()
    console.error(chalk.red('\n Looks like the project already exists\n'))

    const confirm = yield inquirer.prompt([commonQuestions.force])

    if (!confirm.force) {
      console.log(chalk.bold.yellow('\nNo problem!'))
      return
    }
  }

  const template = `${paths.cliTemplates}/blue`
  const data = Object.assign({
    name,
    author: yield utils.getGitUser(),
    dependencies: options.dependencies
  }, options)

  // copy and interpolate all template files
  yield copy(template, dest, { data })

  spinner.succeed()

  spinner.text = 'Install dependencies'
  spinner.start()

  // change directory context and install all dependencies
  process.chdir(dest)
  yield execa.shell('npm install')

  spinner.succeed()

  console.log('\nWebsite!', emoji.heart)
  console.log('\nNew project', chalk.bold(name), 'was created successfully!')
  console.log(chalk.bold('\nTo get started:\n'))
  console.log(chalk.italic(`  cd ${folderName} && npm run dev`))
})
