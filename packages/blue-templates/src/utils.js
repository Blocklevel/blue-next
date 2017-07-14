const co = require('co')
const fs = require('fs')
const fetch = require('node-fetch')
const semver = require('semver')
const path = require('path')
const execa = require('execa')
const _ = require('lodash')
const pkg = require('../package.json')

const getGitUser = co.wrap(function * (name = '', email = '') {
  /**
   * It's possible that the current user hasn't set up the git global user info.
   * In that case we'll use placeholders.
   */
  try {
    const configName = yield execa.shell('git config user.name')
    const configEmail = yield execa.shell('git config user.email')
    console.log(configName.stdout)
    name = configName.stdout
    email = configEmail.stdout
  } catch (error) {
    console.log(error)
  }

  return { name, email }
})

/**
 * Replace name of given files
 * @param  {String} dir
 * @param  {Array<String>} files
 * @param  {Regexp|String} [substr=/[!@#$%^&*]/g]
 * @param  {String} [newSubstr='']
 */
const replaceFilesName = function (dir, files, substr = /[!@#$%^&*]/g, newSubstr = '') {
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
const getSemverFromPackage = co.wrap(function * (name, baseVersion = pkg.version) {
  const response = yield fetch(`https://registry.npmjs.org/${name}`)
  const pkgData = yield response.json()
  return getSemverFromMajor(_.keys(pkgData.versions), baseVersion)
})

module.exports = {
  getGitUser,
  getSemverFromPackage,
  replaceFilesName,
  renameFiles,
  renameFilesFromDir,
  getSemverFromMajor
}
