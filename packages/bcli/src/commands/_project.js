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

      // TODO: add question if name is missing. Useless to fallback to the cli usage

      // Check if the folder is not already there, so we can ask for to overwrite or not
      pathExists(dest)
        .then(exists => {
          return this.prompt(questions.overwrite(exists && !args.force))
        })
        .then(response => {
          if (response.overwrite === false) {
            this.log('')
            this.log(chalk.yellow('   Ok thanks bye!'))
            this.log('')
            process.exit(1)
          }

          return args
        })

        // Collecting all data from all questions
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

    // We need to kill all process if during the questions ctrl+c is called
    // otherwise the application might crashes
    // see dthree/vorpal/issues/220
    .cancel(function () {
      this.log('')
      process.exit(1)
    })
}
