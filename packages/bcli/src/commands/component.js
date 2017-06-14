const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const argv = require('minimist')(process.argv.slice(2))
const { createComponent } = require('../commons/scaffold')

module.exports = function component (args, options, logger) {
  // because we use the trick of the alias to retrieve the component type
  // we have to grab it from the arguments
  // there's no way yet to know which alias is used in Caporal
  const type = argv._[0]
  const cwd = process.cwd()

  if (!fs.existsSync(`${cwd}/blue.config.js`)) {
    logger.error(chalk.red(`
      Blue configuration file not found.
      You need to run the command in the root folder of your Blue project.
    `))
    process.exit(1)
  }

  const blueTemplates = require(`${cwd}/node_modules/blue-templates`)
  const nameAsPath = args.name.split('/')
  const hasCustomPath = nameAsPath.length > 1
  const name = hasCustomPath ? nameAsPath[nameAsPath.length - 1] : nameAsPath[0]
  const componentFolder = blueTemplates.getComponentPath(cwd, type)
  const dest = hasCustomPath ? `${componentFolder}/${nameAsPath.join('/')}` : `${componentFolder}/${name}`
  const componentExists = fs.existsSync(dest)

  logger.debug(chalk.gray(`Current working directory: ${cwd}`))
  logger.debug(chalk.gray(`Component name: ${name}`))
  logger.debug(chalk.gray(`Component destination: ${dest}`))
  logger.debug(chalk.gray(`Component exists? ${componentExists}`))

  return inquirer.prompt([
    {
      type: 'input',
      name: 'overwrite',
      message: 'The component already exists, please type the name to confirm',
      validate: function (answer) {
        const done = this.async()

        if (answer !== name) {
          done(chalk.red('The name is not correct! You can try again or give up!'))
          return
        }

        return done(null, true)
      },
      when: function () {
        return componentExists && !options.force
      }
    }
  ])
  .then(() => {
    return createComponent({
      boilerplate: options.boilerplate,
      template: blueTemplates.getComponent(),
      dest,
      type,
      name
    })
  })
  .then(() => {
    logger.info(`
      Component ${chalk.green(name)} created
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
