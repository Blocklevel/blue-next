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
    .command('project [name]', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .alias('p')
    .action(function (args, callback) {
      this.prompt({
        when: function () {
          return !args.name
        },
        type: 'input',
        name: 'name',
        message: 'What\'s the name of the project?',
        validate: function (answer) {
          return answer !== ''
        }
      })

      // Check if the folder is not already there, so we can ask for to overwrite or not
      .then(response => {
        const mergedResponse = _.assignIn({}, args, response)
        const dest = `${process.cwd()}/${mergedResponse.name}`

        return pathExists(dest)
          .then(exists => {
            return this.prompt(questions.overwrite(exists && !args.options.force))
          })
          .then(overwritePromptResult => {
            if (overwritePromptResult.overwrite === false) {
              this.log('')
              this.log(chalk.yellow('   Ok thanks bye!'))
              this.log('')
              process.exit(1)
            }

            return _.assignIn({ dest }, mergedResponse)
          })
      })

      // Collecting all data from all questions
      .then((response) => {
        const data = _.assignIn({
          template: blueTemplates.getBlue(),
          cssTemplate: blueTemplates.getPreProcessor('postcss'),
          templateCssFolder: blueTemplates.getStylePath(response.dest)
        }, response)

        return generateProject(data)
      })

      // When the project creation is completed, we need to kill the cli
      // because we need to change directory and start the project.
      // there's no need to leave the node process active in the bcli$ delimiter
      .then(() => {
        vorpal.ui.cancel()
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
