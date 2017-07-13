const scaffold = require('../commons/scaffold')
const fs = require('fs')
const path = require('path')
const del = require('del')
const Listr = require('listr')
const utils = require('../commons/utils')
const targz = require('tar.gz')
const log = require('../commons/log')
const execa = require('execa')
const fetch = require('node-fetch')
const detectInstalled = require('detect-installed')
const semver = require('semver')
const extractPackage = require('extract-package')

/**
 * Create a Promise that resolves when a stream ends and rejects when an error occurs
 * @param {WritableStream|ReadableStream} stream
 * @returns {Promise}
 */
const whenStreamDone = (stream) => new Promise((resolve, reject) => {
  stream.on('end', resolve)
  stream.on('finish', resolve)
  stream.on('error', reject)
})

module.exports = function (vorpal) {
  const chalk = vorpal.chalk
  const cwd = process.cwd()

  vorpal
    .command('project <name>', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .option('--sass', 'Use Sass pre-processor')
    .option('-y, --yarn', 'Force installation with Yarn')
    .option('-n, --npm', 'Force installation with NPM')
    .option('--major <version>', 'Major version of blue-templates package')
    .option('--nocommit', 'Avoid git first commit')
    .option('--symlink-packages', 'Symlink local Blue packages (only development)')
    .option('--verbose')
    .alias('p')
    .action(function (args, callback) {
      const hasYarn = args.options.yarn || detectInstalled.sync('yarn')

      const dest = `${cwd}/${args.name}`
      const dirExists = fs.existsSync(dest)

      const tmpPath = require('temp-dir')
      const tmpPackagePath = `${tmpPath}/package`
      const archivePath = `${tmpPath}/blue-template.tar.gz`

      if (dirExists && !args.options.force) {
        log.error(`Folder ${dest} already exists. Pass --force or -f flag to overwrite it.`)
      }

      this.log('')

      const tasks = new Listr([
        {
          title: 'Delete existing project folder',
          enabled: () => dirExists,
          task: () => del(dest, { force: true })
        },
        {
          title: 'Create project folder',
          task: () => fs.mkdirSync(dest)
        },
        {
          title: 'Download templates',
          task: ctx => {
            return new Promise(function (resolve, reject) {
              if (args.options['symlink-packages']) {
                // Before we can symlink all packages, we need to create the new project
                // using the local blue-templates pakcage and install all dependencies
                const localPath = path.resolve(__dirname, '../../../blue-templates')
                return resolve(require(localPath))
              }

              const packageOptions = {
                name: 'blue-templates',
                version: args.options.major
              }

              return extractPackage(packageOptions, true)
                .then(path => resolve(require(path)))
                .catch(error => reject(error))
            })
            .then(blueTemplates => ctx.blueTemplates = blueTemplates)
          }
        },
        {
          title: 'Scaffold project',
          task: ctx => {
            return scaffold.project({
              dest,
              name: args.name,
              template: ctx.blueTemplates.getBlue(),
              cssTemplate: ctx.blueTemplates.getPreProcessor(args.options.sass ? 'sass' : 'postcss'),
              templateCssFolder: ctx.blueTemplates.getStylePath(dest)
            })
          }
        },
        {
          title: 'Install dependencies',
          enabled: () => !hasYarn,
          task: () => {
            process.chdir(dest)
            return utils.exec('npm', ['install'])
          }
        },
        {
          title: 'Install dependencies with ' + chalk.italic('yarn'),
          enabled: () => hasYarn,
          task: () => {
            process.chdir(dest)
            return utils.exec('yarn')
          }
        },
        {
          title: 'Create packages symlink',
          enabled: () => args.options['symlink-packages'],
          task: ctx => utils.symlinkPackages(dest)
        },
        {
          title: 'Initialize git',
          enabled: () => !args.options.nocommit,
          task: () => execa.shell('git init && git add . && git commit -m \'initial commit\'')
        }
      ])

      tasks.run()
        .then(result => {
          this.log('\n   New project', chalk.yellow.bold(args.name), 'created successfully!')
          this.log(chalk.bold('\n   To get started:\n'))
          this.log(chalk.italic(`     cd ${args.name} && npm run dev`))
          this.log('')
        })
        .catch(error => {
          this.log('')
          log.error(error.message)

          // go verbose!
          if (args.options.verbose) {
            this.log('')
            log.error(error, true)
          }
        })
    })

    // We need to kill all process if during the questions ctrl+c is called
    // otherwise the application might crashes
    // see dthree/vorpal/issues/220
    .cancel(function () {
      process.exit(1)
    })
}
