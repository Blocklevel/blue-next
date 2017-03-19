const generateProject = require('../project')
const _ = require('lodash')
const pathExists = require('path-exists')
const questions = require('../commons/questions')
const blueTemplates = require('blue-templates')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('project <name>', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .alias('p')
    .action(function (args, callback) {
      const dest = `${process.cwd()}/${args.name}`

      pathExists(dest)
        .then(exists => {
          return this.prompt({
            when: function () {
              return exists && !args.force
            },
            type: 'confirm',
            name: 'overwrite',
            message: 'The folder already exists: do you want to overwrite it?',
            default: false
          })
        })
        .then(response => {
          if (!response.overwrite) {
            this.log('')
            this.log(chalk.yellow('   Ok thanks bye!'))
            this.log('')
            process.exit(1)
          }

          return args
        })
        .then(() => {
          const data = _.assignIn({
            dest,
            template: blueTemplates.getBlue(),
            cssTemplate: blueTemplates.getPreProcessor('postcss'),
            templateCssFolder: blueTemplates.getStylePath(dest)
          }, args)

          return generateProject(data)
        })
        .catch(error => {
          this.log('')
          throw error
        })
    })
}
