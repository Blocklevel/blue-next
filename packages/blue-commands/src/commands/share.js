const detectInstalled = require('detect-installed')
const Listr = require('listr')
const { yarnWithFallback } = require('../utils')
const globalModules = require('global-modules')
const chalk = require('chalk')

module.exports = function share (args, options, logger) {
  const hasPackage = detectInstalled.sync('ngrok')

  const tasks = new Listr([
    {
      title: 'Installing ngrok package',
      enabled: () => !hasPackage,
      task: () => yarnWithFallback(['install', '-g', 'ngrok'])
    }
  ])

  tasks.run()
    .then(() => {
      require(`${globalModules}/ngrok`).connect('8080', (error, url) => {
        if (error) {
          logger.error(error.message)
        }

        logger.info(`   Sharing at ${chalk.bold(url)}`)
      })
    })
    .catch(error => {
      logger.info(chalk.red(error.message))
    })
}
