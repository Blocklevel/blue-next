const co = require('co')
const homedir = require('homedir')
const path = require('path')
const extractPackage = require('extract-package')
const fs = require('fs')
const semver = require('semver')
const Listr = require('listr')

const info = require('../package.json')
const { yarnWithFallback } = require('./utils')

const cwd = process.cwd()
const home = homedir()
const configFilePath = path.resolve(home, '.bluerc')
const projectConfigFilePath = path.resolve(cwd, 'blue.config.js')
const projectCommandPackage = path.resolve(cwd, './node_modules/blue-commands')
const configExists = fs.existsSync(configFilePath)
const hasLocalCommands = fs.existsSync(projectCommandPackage)
const isBlue = fs.existsSync(projectConfigFilePath)

/**
 * Default bluerc template
 * @type {Object}
 */
const bluercTemplate = {
  version: info.version,
  commands: null,
  development: {
    enabled: false,
    packages: null
  }
}

const installLocalCommands = co.wrap(function * () {
  const tasks = new Listr([
    {
      title: 'Install cli commands in the current project',
      task: () => yarnWithFallback(
        ['add', '--dev', 'blue-commands'],
        ['install', '--save-dev', 'blue-commands']
      )
    }
  ])

  return tasks.run()
    .catch(error => {
      console.log('Something went wrong! :(')
      console.log(error.message)
    })
})

const installCommands = co.wrap(function * () {
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
  const bluepackages = path.resolve(home, '.bluepackages')
  const tasks = new Listr([
    {
      title: 'Install global cli commands',
      task: ctx => {
        if (!fs.existsSync(bluepackages)) {
          fs.mkdirSync(bluepackages)
        }

        return extractPackage({ name: 'blue-commands', dest: bluepackages }, true)
          .then(response => {
            // store responses
            ctx.commands = response
            ctx.version = require(`${response}/package.json`).version
          })
          .then(() => {
            // install dependencies
            process.chdir(ctx.commands)
            return yarnWithFallback(['install'])
          })
          .then(() => {
            // bring the context back to the current working directory
            process.chdir(cwd)
          })
      }
    }
  ])

  return tasks.run()
    .then(({ commands, version }) => {
      const newConfig = Object.assign({}, config, { version, commands })

      fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2))

      return newConfig
    })
    .catch(error => {
      console.log('Something went wrong! :(')
      console.log(error.message)
    })
})

module.exports = co.wrap(function * () {
  if (!configExists) {
    fs.writeFileSync(
      configFilePath, JSON.stringify(bluercTemplate, null, 2)
    )
  }

  let config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
  const isDev = config.development.enabled

  if (isBlue && !hasLocalCommands) {
    yield installLocalCommands()
  }

  if (!isBlue && !config.commands) {
    config = yield installCommands()
  }

  const defaultPath = isBlue ? projectCommandPackage : config.commands
  const packagePath = isDev && config.development.packages
    ? `${config.development.packages}/blue-commands`
    : defaultPath

  const commands = require(path.resolve(packagePath))

  // boom boom boom!
  commands.register(config)
})

// @TODO
// - when we install it in the home directory we also need to check the version we are downloading and
//   compare it to the version written in the bluerc file.
//   The package needs to be with the same major version as the cli (?) or maybe the
