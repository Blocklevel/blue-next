const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const { getConfigPath, getConfig } = require('../utils')

module.exports = function development (args, options, logger) {
  const allQuestions = !options.enable && !options.path

  return inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: 'Type the absolute path of the Blue repository in your machine',
      validate: function (answer) {
        const done = this.async()

        if (!fs.existsSync(answer)) {
          done(chalk.red('Sorry, I can\'t resolve this path. Try again.'))
          return
        }

        return done(null, true)
      },
      when: function () {
        return allQuestions || options.path
      }
    },
    {
      type: 'confirm',
      name: 'enabled',
      message: 'Do you want to enable the development mode?',
      default: true,
      when: function () {
        return allQuestions || options.enable
      }
    }
  ])
  .then(response => {
    const configPath = getConfigPath()
    const config = getConfig()
    const packagesPath = response.path
      ? path.resolve(response.path, './packages')
      : config.development.packages

    const newConfig = Object.assign({}, config, {
      development: {
        enabled: typeof response.enabled === 'undefined'
          ? config.development.enabled
          : response.enabled,
        packages: packagesPath
      }
    })

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 1))

    logger.info(`
      Development setup updated!
    `)
  })
}
