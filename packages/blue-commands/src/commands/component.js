const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const argv = require('minimist')(process.argv.slice(2))
const { createComponent } = require('../scaffold')
const { getOverwritePrompt, checkBlueContext } = require('../utils')

module.exports = function component (args, options, logger) {
  // because we use the trick of the alias to retrieve the component type
  // we have to grab it from the arguments
  // there's no way yet to know which alias is used in Caporal
  const type = argv._[0]
  const cwd = process.cwd()

  const blueTemplates = require(`${cwd}/node_modules/blue-templates`)
  const nameAsPath = args.name.split('/')
  const hasCustomPath = nameAsPath.length > 1
  const name = hasCustomPath ? nameAsPath[nameAsPath.length - 1] : nameAsPath[0]
  const componentFolder = blueTemplates.getComponentPath(cwd, type)
  const dest = hasCustomPath ? `${componentFolder}/${nameAsPath.join('/')}` : `${componentFolder}/${name}`
  const componentExists = fs.existsSync(dest)

  return inquirer.prompt([
    getOverwritePrompt(name, componentExists && !options.force)
  ])
  .then(() => {
    return createComponent({
      dest, type, name,
      boilerplate: options.boilerplate,
      template: blueTemplates.getComponent()
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
