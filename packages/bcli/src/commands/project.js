const Listr = require('listr')
const inquirer = require('inquirer')
const execa = require('execa')
const extractPackage = require('extract-package')
const fs = require('fs')
const path = require('path')
const del = require('del')
const chalk = require('chalk')
const utils = require('../commons/utils')
const { createProject } = require('../commons/scaffold')

module.exports = function project (args, options, logger) {
  const cwd = process.cwd()
  const dest = `${cwd}/${args.name}`
  const projectDirExists = fs.existsSync(dest)

  logger.debug(chalk.gray('Current working directory: ' + cwd))
  logger.debug(chalk.gray('Project name: ' + args.name))
  logger.debug(chalk.gray('Project destination: ' + dest))
  logger.debug(chalk.gray('Project exists? ' + projectDirExists))

  const tasks = new Listr([
    {
      title: 'Delete existing project folder',
      enabled: () => projectDirExists,
      task: () => del(dest, { force: true })
    },
    {
      title: 'Create project folder',
      task: () => fs.mkdirSync(dest)
    },
    {
      title: 'Retrieve templates',
      task: ctx => {
        return new Promise(function (resolve, reject) {
          if (options.useLocalTemplates) {
            logger.debug(chalk.gray('Using local blue-templates package'))
            return resolve(require('blue-templates'))
          }

          return extractPackage({
            name: 'blue-templates',
            version: options.major
          }, true)
          .then(path => resolve(require(path)))
          .catch(error => reject(error))
        })
        .then(blueTemplates => {
          ctx.projectData = {
            dest,
            name: args.name,
            template: blueTemplates.getBlue(),
            cssTemplate: blueTemplates.getPreProcessor('postcss'),
            cssDest: blueTemplates.getStylePath(dest)
          }
        })
      }
    },
    {
      title: 'Scaffold project',
      task: ctx => createProject(ctx.projectData)
    },
    {
      title: 'Install dependencies',
      enabled: () => !options.npm,
      task: (ctx, task) => {
        process.chdir(dest)
        return execa('yarn').catch(() => {
          ctx.npmFailed = true
          return execa('npm', ['install'])
        })
      }
    },
    {
      title: 'Install dependencies with npm',
      enabled: () => options.npm,
      task: ctx => {
        process.chdir(dest)
        return execa('npm', ['install'])
      }
    }
  ])

  return inquirer.prompt([
    {
      type: 'input',
      name: 'overwrite',
      message: 'The folder already exists, please type the name to confirm',
      validate: function (answer) {
        const done = this.async()

        if (answer !== args.name) {
          done(chalk.red('The name is not correct! You can try again or give up!'))
          return
        }

        return done(null, true)
      },
      when: function () {
        return projectDirExists && !options.force
      }
    }
  ])
  .then(() => tasks.run())
  .then(ctx => {
    logger.info(`
      The project ${chalk.green(args.name)} has been created successfully!

      To get started:
        run ${chalk.italic(`cd ${args.name} && yarn dev`)}

      Build project:
        run ${chalk.italic('yarn build')}

      Add Server Side Rendering:
        run ${chalk.italic('yarn ssr')}

      Eject Blue logic ( one way operation )
        run ${chalk.italic('yarn eject')}
    `)

    if (ctx.npmFailed) {
      logger.info(`
        ${chalk.red.bold('Was not possible to detect yarn.')}
        ${chalk.red('Npm has been used to install all project dependencies')}
      `)
    }
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
