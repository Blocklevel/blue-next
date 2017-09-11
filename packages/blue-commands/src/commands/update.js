const Listr = require('listr')
const chalk = require('chalk')
const path = require('path')
const fetch = require('node-fetch')
const semver = require('semver')
const extractPackage = require('extract-package')
const homedir = require('homedir')
const fs = require('fs')
const { getConfig, getConfigPath, yarnWithFallback } = require('../utils')

module.exports = function update (args, options, logger) {
  const bluepackages = path.resolve(homedir(), '.bluepackages')
  const config = getConfig()
  const configFilePath = getConfigPath()
  const cwd = process.cwd()

  const tasks = new Listr([
    {
      title: 'Check updates',
      task: ctx => {
        return fetch(`http://registry.npmjs.org/blue-commands`).then(response => {
          return response.json()
        })
        .then(response => {
          const versions = Object.keys(response.versions)
          const { version } = config
          const blueCommandsMajor = version.split('.')[0]

          let selectedVersion = semver.maxSatisfying(versions, `^${blueCommandsMajor}`)

          if (!selectedVersion) {
            selectedVersion = info['dist-tags']['latest']
          }

          return {
            toUpdate: selectedVersion !== version,
            version: selectedVersion
          }
        })
        .then(response => {
          if (!response.toUpdate) {
            logger.info('   Blue is up to date')
            process.exit(0)
          }

          return extractPackage({
            name: 'blue-commands',
            dest: bluepackages,
            version: response.version
          })
        })
        .then(response => {
          ctx.version = require(`${response}/package.json`).version

          process.chdir(response)

          return yarnWithFallback(['install'])
        })
        .then(() => {
          process.chdir(cwd)
        })
      }
    }
  ])

  return tasks.run()
    .then(({ version }) => {
      const newConfig = Object.assign({}, config, { version })

      fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2))

      logger.info(`   Blue ${chalk.green(`v${version}`)} has been installed!`)
    })
    .catch(error => {
      console.log('Something went wrong! :(')
      console.log(error.message)
    })
}
