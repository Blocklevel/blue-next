const generateComponent = require('../component')
const _ = require('lodash')
const pathExists = require('path-exists')
const questions = require('../commons/questions')
const blueTemplates = require('blue-templates')
const utils = require('../commons/utils')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('component [name] [type]', 'create a component')
    .option('-f, --force', 'Force file overwrite')
    .option('--hooks', 'Add basic component hooks')
    .alias('c')
    .action(function (args, callback) {
      this.prompt([
        {
          when: function () {
            return !args.name
          },
          type: 'input',
          name: 'name',
          message: 'What\'s the name of your component?',
          validate: function (answer) {
            return answer !== ''
          }
        },
        {
          when: function () {
            return typeof args.type !== 'undefined' && !utils.isComponentType(args.type)
          },
          type: 'list',
          name: 'type',
          message: 'Which type of component do you want?',
          choices: [
            {
              name: 'Just a component',
              value: 'component'
            },
            {
              name: 'A container component',
              value: 'container'
            },
            {
              name: 'A page component',
              value: 'page'
            }
          ],
          default: 'component'
        },
        {
          when: function () {
            return !args.options.hooks
          },
          type: 'confirm',
          name: 'basic',
          message: 'Would you like some basic Vue hooks?',
          default: false
        }
      ])

      // Check if the folder is not already there, so we can ask for to overwrite or not
      .then(promptResult => {
        // It's not possible to know whether data is passed via command line options
        // or via questions. Both results needs to be merged so in any cases
        // a name and a type will always be available
        let mergedResult = _.assignIn({}, promptResult, args)

        // It's not possible to pass a default value if a question is skipped,
        // so in case the type of component is undefuned: type is 'component'
        if (!mergedResult.type) {
          mergedResult.type = 'component'
        }

        const { name, type } = mergedResult
        const dest = `${process.cwd()}/src/app/${type}/${name}`

        return pathExists(dest)
          .then(exists => {
            const overwriteQuestion = _.assignIn({
              when: function () {
                return exists && !args.options.force
              }
            }, questions.overwrite)

            return this.prompt(overwriteQuestion)
          })
          .then(overwritePromptResult => {
            if (overwritePromptResult.overwrite === false) {
              this.log('')
              this.log(chalk.yellow('   Ok thanks bye!'))
              this.log('')
              process.exit(1)
            }

            return _.assignIn({ dest }, args, mergedResult)
          })
      })

      // Collecting all data from all questions
      .then(result => {
        return _.assignIn({
          template: blueTemplates.getComponent()
        }, result, result.options)
      })

      // Here the component is actually generated!
      .then(generateComponent)

      // When the component is generated we need to fire the callback
      // provided by the action to bring the terminal back to the delimiter
      .then(callback)

      .catch(error => {
        this.log('')
        throw error
      })
    })

    // We need to kill all process if during the questions ctrl+c is called
    // otherwise the application might crashes
    // see dthree/vorpal/issues/220
    .cancel(function (args) {
      this.log('')
      process.exit(1)
    })
}
