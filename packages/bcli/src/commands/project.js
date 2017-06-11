const Listr = require('listr')
const inquirer = require('inquirer')
const execa = require('execa')
const extractPackage = require('extract-package')
const fs = require('fs')
const path = require('path')
const del = require('del')
const chalk = require('chalk')
const utils = require('../commons/utils')
const kopy = require('kopy')
const { createProject } = require('../commons/scaffold')

/**
 * It runs all commands with Yarn but it fallsback to Npm if Yarn is not installed
 * or maybe because Yarn is not globally accessable
 * @param  {Array<String>} cmds list of commands
 * @return {Promise}
 */
function yarnWithFallback (cmds) {
  return execa('yarn', cmds).catch(() => execa('npm', cmds))
}

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
      title: 'Create packages symlink',
      enabled: () => options.symlinkPackages,
      task: ctx => {
        const packagesFolder = path.resolve(__dirname, '../../..')
        const packages = fs.readdirSync(packagesFolder).filter(item => {
          return fs.lstatSync(`${packagesFolder}/${item}`).isDirectory()
        })
        const symlinks = packages.map(folder => {
          process.chdir(`${packagesFolder}/${folder}`)
          return yarnWithFallback(['link'])
        })

        return Promise.all(symlinks).then(() => {
          process.chdir(dest)
          return Promise.all(
            packages.map(pack => yarnWithFallback(['link', pack]))
          )
        })
      }
    },
    {
      title: 'Bootstrap packages',
      enabled: () => options.lernaBootstrap,
      task: () => {
        const blueNextRootFolder = path.resolve(__dirname, '../../../../')
        process.chdir(blueNextRootFolder)
        return execa('lerna', ['bootstrap'])
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
