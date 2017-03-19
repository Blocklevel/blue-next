'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const execa = require('execa')
const utils = require('./commons/utils')
const co = require('co')
const ora = require('ora')
const fs = require('fs')
const spawn = require('cross-spawn')
const scaffold = require('./commons/scaffold')

const spinner = ora()

module.exports = co.wrap(function * (args) {
  const isYarn = yield utils.isYarn()

  console.log('')
  spinner.text = 'Create project'
  spinner.start()

  try {
    yield scaffold.project(args)
  } catch (error) {
    spinner.fail()
    throw error
  }

  // see Blocklevel/blue-next/issues/41
  // see Blocklevel/blue-next/issues/44
  utils.replaceFilesName(args.dest, [`__.eslintrc.js`, `__.gitignore`], '__', '')

  spinner.succeed()

  spinner.text = 'Install dependencies'
  spinner.start()

  process.chdir(args.dest)

  try {
    yield execa.shell(isYarn ? 'yarn' : 'npm install')
  } catch (error) {
    // see Blocklevel/blue-next/issues/46
    spawn.sync('npm', ['install'], { stdio: 'inherit' })
  }

  console.log(chalk.bold('\n   Website!!!'))
  console.log('\n   New project', chalk.yellow.bold(args.name), 'was created successfully!')
  console.log(chalk.bold('\n   To get started:\n'))
  console.log(chalk.italic(`     cd ${args.name} && ${isYarn ? 'yarn dev' : 'npm run dev'}`))
})
