const Listr = require('listr')
const inquirer = require('inquirer')
const execa = require('execa')
const extractPackage = require('extract-package')
const fs = require('fs')
const path = require('path')
const del = require('del')
const chalk = require('chalk')
const { createProject } = require('../scaffold')
const {
  yarnWithFallback,
  symlinkPackages,
  bootstrapBlue,
  getOverwritePrompt
} = require('../utils')

module.exports = function project (args, options, logger) {
  const cwd = process.cwd()
  const dest = `${cwd}/${args.name}`
  const projectDirExists = fs.existsSync(dest)

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
          if (options.symlinkPackages) {
            // Before we can symlink all packages, we need to create the new project
            // using the local blue-templates pakcage and install all dependencies
            const localPath = path.resolve(__dirname, '../../../blue-templates')
            return resolve(require(localPath))
          }

          const packageOptions = {
            name: 'blue-templates',
            version: options.major
          }

          return extractPackage(packageOptions, true)
            .then(path => resolve(require(path)))
            .catch(error => reject(error))
        })
        .then(response => ctx.blueTemplates = response)
      }
    },
    {
      title: 'Scaffold project',
      task: ctx => {
        const { blueTemplates } = ctx
        return createProject({
          dest,
          name: args.name,
          template: blueTemplates.getBlue(),
          cssTemplate: blueTemplates.getPreProcessor(options.sass || 'postcss'),
          cssDest: blueTemplates.getStylePath(dest)
        })
      }
    },
    {
      title: 'Install dependencies',
      enabled: () => !options.npm && !options.skipDeps,
      task: (ctx, task) => {
        process.chdir(dest)
        return yarnWithFallback(['install'])
      }
    },
    {
      // We need to manually install blue-commands in new projects because this is a dependency
      // for the cli >=1.6.0 only, not for the template.
      // Adding the dependency in the template will break earlier cli users workflow
      title: 'Install local commands',
      task: () => {
        process.chdir(dest)
        return yarnWithFallback(
          ['add', '--dev', 'blue-commands'],
          ['install', '--save-dev', 'blue-commands']
        )
      }
    },
    {
      title: 'Initialize git',
      enabled: () => !options.skipGit,
      task: () => execa.shell('git init')
    },
    {
      title: 'Initial commit',
      enabled: () => !options.skipGitCommit && !options.skipGit,
      task: () => execa.shell('git add . && git commit -m "chore: initial commit"')
    },
    {
      title: 'Create packages symlink',
      enabled: () => options.symlinkPackages,
      task: ctx => symlinkPackages(dest)
    },
    {
      title: 'Bootstrap packages',
      enabled: () => options.lernaBootstrap,
      task: () => bootstrapBlue()
    }
  ])

  return inquirer.prompt([
    getOverwritePrompt(args.name, projectDirExists && !options.force)
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
