const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const recursive = require('recursive-readdir')

const { createComponent } = require('../commons/scaffold')

module.exports = function component (type, { args, options, logger }) {
  const cwd = process.cwd()
  const blueTemplates = require(`${cwd}/node_modules/blue-templates`)
  const nameAsPath = args.name.split('/')
  const hasCustomPath = nameAsPath.length > 1
  const name = hasCustomPath ? nameAsPath[nameAsPath.length - 1] : nameAsPath[0]
  const componentFolder = blueTemplates.getComponentPath(cwd, type)
  const dest = hasCustomPath ? `${componentFolder}/${nameAsPath.join('/')}` : `${componentFolder}/${name}`
  const componentExists = fs.existsSync(dest)

  logger.debug(chalk.gray(`Current working directory: ${cwd}`))
  logger.debug(chalk.gray(`Component name: ${args.name}`))
  logger.debug(chalk.gray(`Component destination: ${dest}`))
  logger.debug(chalk.gray(`Component exists? ${componentExists}`))

  return inquirer.prompt([
    {
      type: 'input',
      name: 'overwrite',
      message: 'The component already exists, please type the name to confirm',
      validate: function (answer) {
        const done = this.async()

        if (answer !== args.name) {
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
      dest,
      type,
      boilerplate: options.boilerplate,
      template: blueTemplates.getComponent(),
      name: args.name
    })
  })
  .then(result => {
    logger.info(`
      Component ${chalk.green(args.name)} created
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
