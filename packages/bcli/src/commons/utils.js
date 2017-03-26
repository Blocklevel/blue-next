// required by any-observable package to run shortcuts
require('any-observable/register/rxjs-all')

const log = require('./log')
const co = require('co')
const execa = require('execa')
const fs = require('fs')
const _ = require('lodash')
const detectInstalled = require('detect-installed')
const fetch = require('node-fetch')
const semver = require('semver')
const bcliVersion = require('../../package.json').version
const Observable = require('any-observable')
const streamToObservable = require('stream-to-observable')
const split = require('split')

/**
 * Detects if the blue.config.js file exists, so we know we are in the root of a project
 * @return {Boolean}
 */
const canCommandRun = function () {
  const exists = fs.existsSync('./blue.config.js')

  if (!exists) {
    log.error('No Blue config file found. You need to run the command in the root of your project')
  }

  return true
}

/**
 * Streaming stdout with `execa`
 * @param  {String} cmd
 * @param  {Array<String>} args
 * @return {Observable}
 */
const exec = function (cmd, args) {
  const cp = execa(cmd, args)

  return Observable.merge(
    streamToObservable(cp.stdout.pipe(split()), {await: cp}),
    streamToObservable(cp.stderr.pipe(split()), {await: cp})
  ).filter(Boolean)
}
/**
 * Get the credentials of the current git user
 * @return {Object}
 */
const getGitUser = co.wrap(function * (name = '', email = '') {
  /**
   * It's possible that the current user hasn't set up the git global user info.
   * In that case we'll use placeholders.
   */
  try {
    const configName = yield execa.shell('git config user.name')
    const configEmail = yield execa.shell('git config user.email')

    name = configName.stdout
    email = configEmail.stdout
  } catch (error) {}

  return { name, email }
})

/**
 * Replace name of given files
 * @param  {String} dir
 * @param  {Array<String>} files
 * @param  {Regexp|String} substr
 * @param  {Regexp|String} newSubstr
 */
const replaceFilesName = function (dir, files, substr, newSubstr) {
  files.forEach(file => {
    fs.rename(`${dir}/${file}`, `${dir}/${file.replace(substr, newSubstr)}`, error => {
      if (error) {
        log.error('something wrong happend renaming files')
      }
    })
  })
}

/**
 * Rename files
 * @param  {String} dir
 * @param  {Array<String>} files
 * @param  {String} newName
 */
const renameFiles = function (dir, files, newName) {
  files.forEach(file => {
    const extention = file.split('.')[1]
    const origin = `${dir}/${file}`
    const dest = `${dir}/${newName}.${extention}`

    try {
      fs.renameSync(origin, dest)
    } catch (error) {
      log.error(`an error occured trying to rename files in ${dir} folder`)
    }
  })
}

/**
 * Rename all files in a folder to a single filename
 * @param  {String} destination
 * @param  {String} filename
 */
const renameFilesFromDir = function (dir, newName) {
  try {
    const files = fs.readdirSync(dir)
    renameFiles(dir, files, newName)
  } catch (error) {
    log.error(`the folder ${dir} doesn't exist`)
  }
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
 * Returns true if the type of component is supported
 * @param  {String} type
 * @return {Boolean}
 */
const isComponentType = function (type) {
  return ['component', 'page', 'container'].indexOf(type) !== -1
}

/**
 * Check whether yarn is available for commands
 * @returns {Boolean}
 */
const isYarn = co.wrap(function * () {
  return yield detectInstalled('yarn')
})

module.exports = {
  getGitUser,
  renameFiles,
  renameFilesFromDir,
  getEvents,
  isYarn,
  getSemverFromMajor,
  getSemverFromPackage,
  replaceFilesName,
  isComponentType,
  exec,
  canCommandRun
}
