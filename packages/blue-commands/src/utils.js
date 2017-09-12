const co = require('co')
const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs')
const _ = require('lodash')
const fetch = require('node-fetch')
const semver = require('semver')
const bcliVersion = require('../package.json').version
const path = require('path')
const recursive = require('recursive-readdir')
const homedir = require('homedir')

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
 * @param  {Regexp|String} [substr=/[!@#$%^&*]/g]
 * @param  {String} [newSubstr='']
 */
function replaceFilesName (dir, files, substr = /[!@#$%^&*]/g, newSubstr = '') {
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
function renameFiles (dir, files, newName) {
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
function renameFilesFromDir (dir, newName) {
  try {
    const files = fs.readdirSync(dir)
    renameFiles(dir, files, newName)
  } catch (error) {
    log.error(`the folder ${dir} doesn't exist`)
  }
}

/**
 * Get the most satisfying semver from a list of versions
 * @param  {Array<String>} versions - list of version number
 * @param  {String} baseVersion - the major version to compare
 * @return {String} semver string
 */
function getSemverFromMajor (versions, baseVersion) {
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
 * It runs all commands with Yarn but it fallsback to Npm if Yarn is not installed
 * or maybe because Yarn is not globally accessable
 * @param  {Array<String>} cmds          list of commands
 * @param  {Array<String>} fallsbackCmds list of fallback commands
 * @return {Promise}
 */
function yarnWithFallback (cmds, fallsbackCmds) {
  return execa('yarn', cmds).catch(() => execa('npm', fallsbackCmds || cmds))
}

function symlinkPackages (dest, packagesRoot) {
  const packages = fs.readdirSync(packagesRoot).filter(item => {
    return fs.lstatSync(`${packagesRoot}/${item}`).isDirectory() && item !== 'bcli'
  })

  const symlinks = packages.map(folder => {
    process.chdir(`${packagesRoot}/${folder}`)
    return yarnWithFallback(['link'])
  })

  return Promise.all(symlinks).then(() => {
    process.chdir(dest)
    return Promise.all(
      packages.map(pack => yarnWithFallback(['link', pack]))
    )
  })
}

function getOverwritePrompt (name, shouldPrompt = false) {
  return {
    type: 'input',
    name: 'overwrite',
    message: 'The file or folder already exists, please type the name to confirm',
    validate: function (answer) {
      const done = this.async()

      if (answer !== name) {
        done(chalk.red('The name is not correct! You can try again or give up!'))
        return
      }

      return done(null, true)
    },
    when: function () {
      return shouldPrompt
    }
  }
}

function getEvents (events) {
  const array = events.split(',')
  return array
    .map(event => event.trim())
    .filter(event => event !== '')
    .map((event, i) => ({
      value: _.snakeCase(event).toUpperCase(),
      isNotLastItem: i !== array.length - 1
    }))
}

function getConfigPath () {
  return path.resolve(homedir(), '.bluerc')
}

function getConfig () {
  try {
    const bluercPath = getConfigPath()
    return JSON.parse(fs.readFileSync(bluercPath, 'utf8'))
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getConfig,
  getConfigPath,
  getOverwritePrompt,
  getGitUser,
  getEvents,
  renameFiles,
  renameFilesFromDir,
  getSemverFromMajor,
  getSemverFromPackage,
  replaceFilesName,
  yarnWithFallback,
  symlinkPackages
}
