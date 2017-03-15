const co = require('co')
const execa = require('execa')
const chalk = require('chalk')
const fs = require('fs')
const questions = require('./questions')
const _ = require('lodash')
const detectInstalled = require('detect-installed')
const fetch = require('node-fetch')
const semver = require('semver')
const bcliVersion = require('../../package.json').version

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
const renameFilesFromDir = function (dir, newName) {
  fs.readdir(dir, (error, files) => {
    files.forEach(file => {
      const extention = file.split('.')[1]
      const origin = `${dir}/${file}`
      const dest = `${dir}/${newName}.${extention}`

      fs.rename(origin, dest, renameError => {
        if (renameError) {
          throw renameError
        }
      })
    })
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
 * Get the most satisfying semver from a list of versions
 * @param  {Array<String>} versions - list of version number
 * @param  {String} baseVersion - the major version to compare
 * @return {String} semver string
 */
const getSemverFromMajor = function (versions, baseVersion) {
  const majorVersion = semver.major(baseVersion)
  const version = _.findLast(versions, version => {
    return semver.satisfies(version, `${majorVersion}.x`)
  })

  if (!version) {
    return _.last(versions)
  }

  return version
}

/**
 * Get latest available blue-script package version
 * see https://github.com/Blocklevel/blue-next/issues/28
 * @return {String} version
 */
const getSemverFromPackage = co.wrap(function * (pkg, baseVersion = bcliVersion) {
  const response = yield fetch(`https://registry.npmjs.org/${pkg}`)
  const pkgData = yield response.json()

  return getSemverFromMajor(_.keys(pkgData.versions), baseVersion)
})

/**
 * Check whether yarn is available for commands
 * @returns {Boolean}
 */
const isYarn = co.wrap(function * () {
  return yield detectInstalled('yarn')
})

module.exports = {
  getGitUser,
  renameFilesFromDir,
  getEvents,
  isYarn,
  getSemverFromMajor,
  getSemverFromPackage
}
