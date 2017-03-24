const scaffold = require('../commons/scaffold')
const fs = require('fs')
const del = require('del')
const Listr = require('listr')
const utils = require('../commons/utils')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

module.exports = function (vorpal) {
  const chalk = vorpal.chalk
  const cwd = process.cwd()

  vorpal
    .command('project <name>', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .option('--verbose')
    .alias('p')
    .action(function (args, callback) {
      const dir = `${cwd}/${args.name}`
      const dirExists = fs.existsSync(dir)

      if (dirExists && !args.options.force) {
        this.log(chalk.red(`Folder ${dir} already exists. Pass --force flag to overwrite it.`))
        process.exit(1)
      }

      this.log('')

      const tasks = new Listr([
        {
          title: 'Delete existing project folder',
          enabled: () => dirExists,
          task: () => del(dir)
        },
        {
          title: 'Create project folder',
          task: () => fs.mkdirSync(dir)
        },
        {
          title: 'Install Blue templates',
          task: () => {
            process.chdir(dir)
            return utils.exec('npm', ['install', 'blue-templates'])
          }
        },
        {
          title: 'Scaffold project',
          task: () => {
            const blueTemplates = require(`${dir}/node_modules/blue-templates`)

            return scaffold.project({
              name: args.name,
              dest: dir,
              template: blueTemplates.getBlue(),
              cssTemplate: blueTemplates.getPreProcessor('postcss'),
              templateCssFolder: blueTemplates.getStylePath(dir)
            })
          }
        },
        {
          title: 'Install dependencies',
          task: () => utils.exec('npm', ['install'])
        }
      ])

      tasks.run()
        .then(result => {
          this.log('')
          this.log(chalk.bold('\n   Website!!!'))
          this.log('\n   New project', chalk.yellow.bold(args.name), 'was created successfully!')
          this.log(chalk.bold('\n   To get started:\n'))
          this.log(chalk.italic(`     cd ${args.name} && npm run dev`))
          this.log('')
        })
        .catch(error => {
          this.log('')
          this.log(chalk.red(error.message))

          // go verbose!
          if (args.options.verbose) {
            this.log('')
            this.log(error)
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
