const chalk = require('chalk')
const fs = require('fs')
const inquirer = require('inquirer')
const { createStoreModule } = require('../commons/scaffold')

module.exports = function storeModule (args, options, logger) {
  const cwd = process.cwd()
  const blueTemplates = require(`${cwd}/node_modules/blue-templates`)
  const storeFolder = blueTemplates.getStoreModulePath(cwd)
  const dest = `${storeFolder}/${args.name}`
  const moduleDirExists = fs.existsSync(dest)

  logger.debug(chalk.gray('Current working directory: ' + cwd))
  logger.debug(chalk.gray('Module name: ' + args.name))
  logger.debug(chalk.gray('Module destination: ' + dest))
  logger.debug(chalk.gray('Module exists? ' + moduleDirExists))

  return inquirer.prompt([
    {
      type: 'input',
      name: 'overwrite',
      message: 'The module already exists, please type the name to confirm',
      validate: function (answer) {
        const done = this.async()

        if (answer !== args.name) {
          done(chalk.red('The name is not correct! You can try again or give up!'))
          return
        }

        return done(null, true)
      },
      when: function () {
        return moduleDirExists && !options.force
      }
    },
    {
      when: function () {
        return !options.skipAll
      },
      type: 'confirm',
      name: 'addEvents',
      message: 'Would you like to add events, actions and mutations?',
      default: false
    },
    {
      when: function (answer) {
        return answer.addEvents
      },
      type: 'input',
      name: 'events',
      message: 'Add a comma separated string of camelcased values',
      validate: function (answer) {
        return answer !== ''
      }
    }
  ])
  .then(({ events = '' }) => {
    return createStoreModule({
      dest,
      name: args.name,
      template: blueTemplates.getStoreModule(),
      events: events
        .split(',')
        .map(event => event.trim())
        .filter(event => event !== '')
    })
  })
  .then(result => {
    logger.info(`
      Vuex store module ${chalk.green(args.name)} created
    `)
  })
  .catch(error => {
    logger.error(chalk.red(`
      Opps! Something bad happened! :(
      ${chalk.bold(error.message)}
    `))
    logger.debug(error.stack)
    process.exit(1)
  })
}
