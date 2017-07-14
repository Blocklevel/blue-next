const log = require('./log')
const co = require('co')
const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs')
const _ = require('lodash')
const fetch = require('node-fetch')
const semver = require('semver')
const bcliVersion = require('../../package.json').version
const path = require('path')
const recursive = require('recursive-readdir')

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
 * Check if a component already exists in the application
 * If the component exists it throws an error
 * The component needs to be unique!
 * @param  {String} name component name
 */
function componentNameExists (name) {
  const dir = path.resolve(process.cwd(), './src/app')
  return recursive(dir, ['*.js', '*.css', '.gitkeep', '*.html'])
  .then(files => {
    return files.map(file => {
      const splitPath = file.split('/')
      return {
        location: file,
        name: splitPath[splitPath.length - 1].replace(/\.vue$/, '')
      }
    })
  })
  .then(files => files.filter(file => file.name === name))
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

function symlinkPackages (dest) {
  const packagesFolder = path.resolve(__dirname, '../../..')
  const packages = fs.readdirSync(packagesFolder).filter(item => {
    return fs.lstatSync(`${packagesFolder}/${item}`).isDirectory() && item !== 'bcli'
  })
  const symlinks = packages.map(folder => {
    process.chdir(`${packagesFolder}/${folder}`)
    return yarnWithFallback(['link'])
  })

  return Promise.all(symlinks).then(() => {
    process.chdir(dest)
    return Promise.all(
      packages.map(pack => yarnWithFallback(['link', pack]))
    )
  })
}

function bootstrapBlue () {
  const blueNextRootFolder = path.resolve(__dirname, '../../../../')
  process.chdir(blueNextRootFolder)

  try {
    return execa('lerna', ['bootstrap'])
  } catch (e) {
    console.error(chalk.red(
      'Please install Lerna globally in your machine before start development. \n' +
      'https://lernajs.io/'
    ))
    process.exit(1)
  }
}

function checkBlueContext () {
  if (!fs.existsSync(`${process.cwd()}/blue.config.js`)) {
    console.error(chalk.red(`
      Blue configuration file not found.
      You need to run the command in the root folder of your Blue project.
    `))
    process.exit(1)
  }
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

function yarnWithFallback (cmds, fallsbackCmds) {
  return execa('yarn', cmds).catch(() => execa('npm', fallsbackCmds || cmds))
}

function symlinkPackages (dest) {
  const packagesFolder = path.resolve(__dirname, '../../..')
  const packages = fs.readdirSync(packagesFolder).filter(item => {
    return fs.lstatSync(`${packagesFolder}/${item}`).isDirectory() && item !== 'bcli'
  })
  const symlinks = packages.map(folder => {
    process.chdir(`${packagesFolder}/${folder}`)
    return yarnWithFallback(['link'])
  })

  return Promise.all(symlinks).then(() => {
    process.chdir(dest)
    return Promise.all(
      packages.map(pack => yarnWithFallback(['link', pack]))
    )
  })
}

module.exports = {
  getOverwritePrompt,
  checkBlueContext,
  getGitUser,
  renameFiles,
  renameFilesFromDir,
  getSemverFromMajor,
  getSemverFromPackage,
  replaceFilesName,
  canCommandRun,
  componentNameExists,
  yarnWithFallback,
  symlinkPackages,
  bootstrapBlue
}
