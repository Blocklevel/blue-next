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
const spawn = require('cross-spawn')

const spinner = ora()

module.exports = co.wrap(function * (args) {
  const isYarn = yield utils.isYarn()

  console.log('')
  spinner.text = 'Create a new project'
  spinner.start()

  const blue = blueTemplates.getBlue()
  const cssPreprocessor = blueTemplates.getPreProcessor('postcss')
  const data = {
    name: args.name,
    author: yield utils.getGitUser(),
    blueScriptsVersion: yield utils.getSemverFromPackage('blue-scripts')
  }

  try {
    yield copy(blue, args.dest, { data })
    yield copy(cssPreprocessor, `${args.dest}/src/asset/style`, data)
  } catch (error) {
    spinner.fail()
    throw error
  }

  // see https://github.com/Blocklevel/blue-next/issues/41
  // see https://github.com/Blocklevel/blue-next/issues/44
  const filesToRename = ['__.eslintrc.js', '__.gitignore']
  filesToRename.forEach(file => {
    fs.rename(`${args.dest}/${file}`, `${args.dest}/${file.replace('__', '')}`, function (error) {
      if (error) {
        spinner.fail()
        throw error
      }
    })
  })

  spinner.succeed()

  spinner.text = 'Install dependencies'
  spinner.start()

  process.chdir(args.dest)

  try {
    yield execa.shell(isYarn ? 'yarn' : 'npm install')
  } catch (error) {
    // see https://github.com/Blocklevel/blue-next/issues/46
    spawn.sync('npm', ['install'], { stdio: 'inherit' })
  }

  spinner.succeed()

  console.log(chalk.bold('\n   Website!!!'))
  console.log('\n   New project', chalk.yellow.bold(args.name), 'was created successfully!')
  console.log(chalk.bold('\n   To get started:\n'))
  console.log(chalk.italic(`     cd ${args.name} && ${isYarn ? 'yarn dev' : 'npm run dev'}`))
})
