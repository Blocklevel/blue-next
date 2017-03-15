'use strict'
const _ = require('lodash')
const inquirer = require('inquirer')
const chalk = require('chalk')
const copy = require('graceful-copy')
const execa = require('execa')
const pathExists = require('path-exists')
const utils = require('./commons/utils')
const co = require('co')
const ora = require('ora')
const questions = require('./commons/questions')
const blueTemplates = require('blue-templates')
const fs = require('fs')

const isYarn = utils.isYarn()
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
    console.error(chalk.red(`\n Looks like the ${dest} already exists\n`))
    yield questions.confirmPrompt()
  }

  const blue = blueTemplates.getBlue()
  const cssPreprocessor = blueTemplates.getPreProcessor('postcss')
  const data = Object.assign({
    name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }, options)

  yield copy(blue, dest, { data })
  yield copy(cssPreprocessor, `${dest}/src/asset/style`, data)

  // see https://github.com/Blocklevel/blue-next/issues/41
  fs.rename(`${dest}/__.eslintrc.js`, `${dest}/.eslintrc.js`, function (error) {
    if (error) {
      spinner.fail()
      throw error
    }
  })

  spinner.succeed()

  spinner.text = 'Install dependencies'
  spinner.start()

  process.chdir(dest)

  yield execa.shell(isYarn ? 'yarn' : 'npm install')

  spinner.succeed()

  console.log(chalk.bold('\n   Website!!!'))
  console.log('\n   New project', chalk.yellow.bold(name), 'was created successfully!')
  console.log(chalk.bold('\n   To get started:\n'))
  console.log(chalk.italic(`     cd ${folderName} && ${isYarn ? 'yarn dev' : 'npm run dev'}`))
})
