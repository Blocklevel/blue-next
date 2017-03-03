const inquirer = require('inquirer')
const co = require('co')
const execa = require('execa')
const chalk = require('chalk')
const fs = require('fs')
const questions = require('./questions')
const _ = require('lodash')

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
 * Confirmation prompt for overriding actions
 */
const confirmPrompt = co.wrap(function * () {
  const confirm = yield inquirer.prompt([
    questions.force
  ])

  if (!confirm.force) {
    console.log(chalk.bold.yellow('\nNo problem!\n'))
    return
  }
})

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
 * Check value type
 */
const checkType = function (type, value, fallback) {
  return typeof value === type ? value : fallback
}

module.exports = {
  getGitUser,
  confirmPrompt,
  renameFiles,
  getEvents,
  checkType
}
