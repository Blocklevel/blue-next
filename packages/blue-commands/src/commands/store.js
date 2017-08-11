const chalk = require('chalk')
const fs = require('fs')
const inquirer = require('inquirer')
const { createStoreModule } = require('../scaffold')

module.exports = function store (args, options, logger) {
  const cwd = process.cwd()
  const blueTemplates = require(`${cwd}/node_modules/blue-templates`)
  const storeFolder = blueTemplates.getStoreModulePath(cwd)
  const dest = `${storeFolder}/${args.name}`
  const moduleDirExists = fs.existsSync(dest)

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
      events,
      name: args.name,
      template: blueTemplates.getStoreModule()
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
