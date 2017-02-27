const execa = require('execa')
const paths = require('./paths')
const _ = require('lodash')
const co = require('co')
const inquirer = require('inquirer')
const commonQuestions = require('./questions')
const chalk = require('chalk')
const fs = require('fs')
const merge = require('webpack-merge')
const pathExists = require('path-exists')

const checkType = function (type, value, fallback) {
  return typeof value === type ? value : fallback
}

/**
 * Get the credentials of the current git user
 * @return {Object}
 */
const getGitUser = co.wrap(function * () {
  let name = 'username'
  let email = 'example@domain.com'

  /**
   * It's possible that the current user hasn't set up the git global user info.
   * In that case we'll use placeholders.
   */
  try {
    name = yield execa.shell('git config user.name')
    email = yield execa.shell('git config user.email')

    name = name.stdout
    email = email.stdout
  } catch (error) {
    console.log(chalk.yellow('\n\nGit global credentials not found.\n'))
  }

  return { name, email }
})

/**
 * Confirmation prompt for overriding actions
 */
const confirmPrompt = co.wrap(function * () {
  const confirm = yield inquirer.prompt([commonQuestions.force])

  if (!confirm.force) {
    console.log(chalk.bold.yellow('\nNo problem!\n'))
    return
  }
})

/**
 * Require a list of files from a folder
 * @param  {String} folder
 * @return {Array<Object>}
 */
const requireFromFolder = function (folder) {
  const files = fs.readdirSync(folder)
  return _.map(files, file => {
    return require(`${folder}/${file}`)
  })
}

/**
 * Returns an array of event objects in the correct format so we can loop over it later
 * It also determines whether the items need a comma
 * @param  {String} events
 * @return {Object}
 */
const getEvents = function (events) {
  if (!events) {
    return []
  }

  const array = events.split(',')

  return _.map(array, (item, i) => {
    const trimValue = _.trim(item)
    const snakeCaseValue = _.snakeCase(trimValue)
    const value = snakeCaseValue.toUpperCase()
    const isNotLastItem = i !== array.length - 1

    return { value, isNotLastItem }
  })
}

/**
 * Rename all files in a folder to a single filename
 * @param  {String} destination
 * @param  {String} filename
 */
const renameFiles = function (destination, filename) {
  fs.readdir(destination, (readError, files) => {
    files.forEach(file => {
      const extention = file.split('.')[1]
      fs.rename(`${destination}/${file}`, `${destination}/${filename}.${extention}`, (renameError) => {
        if (renameError) {
          console.log(renameError)
        }
      })
    })
  })
}

/**
 * Detects the bcli.config.js file
 * It returns the file content if detected, otherwise returns false
 * @return {Object|Boolean}
 */
const hasConfig = function () {
  try {
    return require(paths.appConfig)
  } catch (error) {
    return false
  }
}

/**
 * If the bcli.config.js exits, it returns the env configuration
 * merged with the webpack configuration
 * @param  {String} env
 * @return {Object} new configuration
 */
const getConfig = co.wrap(function * (env) {
  const appConfig = hasConfig()

  if (!appConfig) {
    console.log(chalk.red(`\nYou need to be in the root folder of a Blue project.`))
    process.exit(1)
  }

  const envPath = `${paths.cliEnv}/${env}`
  const exists = yield pathExists(envPath)

  if (!exists) {
    return {}
  }

  const envConfig = require(envPath)
  const webpackConfig = merge.smart({}, envConfig, appConfig.settings)

  delete appConfig.settings

  /**
   * TODO The bcli.config file for now returns only a title and the rest is part
   * of the webpack configuration.
   * We should decide how to handle data that is for webpack from the rest.
   * Webpack v2.x is very strict with parameters: it's not possible to pass
   * parameters that are not part of Webpack configuration
   */
  return {
    app: appConfig,
    webpack: webpackConfig
  }
})

module.exports = {
  getGitUser,
  confirmPrompt,
  getEvents,
  renameFiles,
  checkType,
  getConfig,
  hasConfig,
  requireFromFolder
}
