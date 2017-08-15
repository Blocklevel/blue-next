const co = require('co')
const homedir = require('homedir')
const path = require('path')
const extractPackage = require('extract-package')
const fs = require('fs')
const semver = require('semver')
const Listr = require('listr')

const info = require('../package.json')
const { yarnWithFallback } = require('./utils')

module.exports = co.wrap(function * () {
  const cwd = process.cwd()
  const home = homedir()
  const configFilePath = path.resolve(home, '.bluerc')
  const projectConfigFilePath = path.resolve(cwd, 'blue.config.js')
  const projecCommandPackage = path.resolve(cwd, './node_modules/blue-commands')
  const configExists = fs.existsSync(configFilePath)
  const isBlue = fs.existsSync(projectConfigFilePath)

  if (!configExists) {
    fs.writeFileSync(
      configFilePath, JSON.stringify({ version: info.version }, null, 1)
    )
  }

  let config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))

  if (!config.commands) {
    const bluepackages = path.resolve(home, '.bluepackages')

    const tasks = new Listr([
      {
        title: 'Download dependencies',
        task: ctx => {
          if (!fs.existsSync(bluepackages)) {
            fs.mkdirSync(bluepackages)
          }

          return extractPackage({ name: 'blue-commands', dest: bluepackages }, true)
            .then(response => {
              ctx.commands = response
              ctx.version = require(`${response}/package.json`).version
            })
        }
      },
      {
        title: 'Install dependencies',
        task: ctx => {
          process.chdir(ctx.commands)
          return yarnWithFallback(['install'])
        }
      }
    ])

    yield tasks.run().then(({ commands, version }) => {
      config = Object.assign({}, config, { version, commands })

      fs.writeFileSync(
        configFilePath, JSON.stringify(config, null, 1)
      )
    })
  }

  const commands = require(
    path.resolve(isBlue ? projecCommandPackage : config.commands)
  )

  // boom boom boom!
  commands.register(configFilePath)
})



// @TODO
// - check if it's a blue project and the local commands exist
// - check if it's a blue project and if it doesn't have commands, then we need to download it and
//   add that to the devDependencies
// - check if we are outside a blue project and then download it in the user home directory and
//   save the position in the bluerc file
// - when we install it in the home directory we also need to check the version we are downloading and
//   compare it to the version written in the bluerc file.
//   The package needs to be with the same major version as the cli (?) or maybe the
