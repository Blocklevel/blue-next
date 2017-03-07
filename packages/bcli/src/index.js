'use strict'
const _ = require('lodash')
const inquirer = require('inquirer')
const chalk = require('chalk')
const copy = require('graceful-copy')
const execa = require('execa')
const pathExists = require('path-exists')
const utils = require('./commons/utils')
const hasYarn = utils.yarnAvailable()
const co = require('co')
const ora = require('ora')
const commonQuestions = require('./commons/questions')
const blueTemplates = require('blue-templates')

const spinner = ora()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = 'Create a new project'
  spinner.start()

  const name = _.kebabCase(options.projectName)
  const folderName = _.kebabCase(options.folderName)
  const dest = `${process.cwd()}/${folderName}`
  const exists = yield pathExists(dest)

  if (exists && !options.force) {
    spinner.fail()
    console.error(chalk.red('\n Looks like the project already exists\n'))

    const confirm = yield inquirer.prompt([
      commonQuestions.force
    ])

    if (!confirm.force) {
      console.log(chalk.bold.yellow('\nNo problem!'))
      return
    }

    console.log('')
  }

  const blue = blueTemplates.getBlue()
  const cssPreprocessor = blueTemplates.getPreProcessor('postcss')

  const data = Object.assign({
    name,
    author: yield utils.getGitUser()
  }, options)

  yield copy(blue, dest, { data })
  yield copy(cssPreprocessor, `${dest}/src/asset/style`, data)

  spinner.succeed()

  spinner.text = 'Install dependencies with ' + (hasYarn ? 'yarn' : 'npm')
  spinner.start()

  process.chdir(dest)
  if (hasYarn) {
    yield execa.shell('yarn')
  } else {
    yield execa.shell('npm install')
  }

  spinner.succeed()

  console.log(chalk.bold('\n   Website!!!'))
  console.log('\n   New project', chalk.yellow.bold(name), 'was created successfully!')
  console.log(chalk.bold('\n   To get started:\n'))
  console.log(chalk.italic(`     cd ${folderName} && ${(hasYarn ? 'yarn' : 'npm')} run dev`))
})
