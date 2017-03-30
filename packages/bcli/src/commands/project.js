const scaffold = require('../commons/scaffold')
const fs = require('fs')
const del = require('del')
const Listr = require('listr')
const utils = require('../commons/utils')
const log = require('../commons/log')
const blueTemplates = require('blue-templates')
const execa = require('execa')
const detectInstalled = require('detect-installed')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk
  const cwd = process.cwd()

  vorpal
    .command('project <name>', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .option('--sass', 'Use Sass pre-processor')
    .option('--nocommit', 'Avoid git first commit')
    .option('--verbose')
    .alias('p')
    .action(function (args, callback) {
      const dest = `${cwd}/${args.name}`
      const dirExists = fs.existsSync(dest)
      const hasYarn = detectInstalled.sync('yarn')
      const projectData = {
        dest,
        name: args.name,
        template: blueTemplates.getBlue(),
        cssTemplate: blueTemplates.getPreProcessor(args.options.sass ? 'sass' : 'postcss'),
        templateCssFolder: blueTemplates.getStylePath(dest)
      }

      if (dirExists && !args.options.force) {
        log.error(`Folder ${dest} already exists. Pass --force flag to overwrite it.`)
      }

      this.log('')

      const tasks = new Listr([
        {
          title: 'Delete existing project folder',
          enabled: () => dirExists,
          task: () => del(dest)
        },
        {
          title: 'Create project folder',
          task: () => fs.mkdirSync(dest)
        },
        {
          title: 'Scaffold project',
          task: () => scaffold.project(projectData)
        },
        {
          title: 'Install dependencies', // with npm
          enabled: () => !hasYarn,
          task: () => {
            process.chdir(dest)
            return utils.exec('npm', ['install'])
          }
        },
        {
          title: 'Install dependencies', // with yarn
          enabled: () => hasYarn,
          task: () => {
            process.chdir(dest)
            return utils.exec('yarn')
          }
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
