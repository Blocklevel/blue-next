const detectInstalled = require('detect-installed')
const Listr = require('listr')
const utils = require('../commons/utils')
const globalModules = require('global-modules')
const log = require('../commons/log')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('share <port>', 'share your localhost with a secure tunnel')
    .action(function (args, callback) {
      const hasPackage = detectInstalled.sync('ngrok')

      const tasks = new Listr([
        {
          title: 'Installing ngrok package',
          enabled: () => !hasPackage,
          task: () => utils.exec('npm', ['install', '-g', 'ngrok'])
        }
      ])

      tasks.run()
        .then(() => {
          require(`${globalModules}/ngrok`).connect('8080', (error, url) => {
            if (error) {
              log.error(error.message)
            }

            // Pure visual stuff.
            // I like a space after the task is completed
            if (!hasPackage) {
              this.log('')
            }

            this.log(`   Sharing at ${chalk.italic(url)}`)
            this.log('')
          })
        })
        .catch(error => {
          this.log('')
          this.log(chalk.red(error.message))
        })
    })
}
