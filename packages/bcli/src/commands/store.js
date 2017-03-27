const _ = require('lodash')
const fs = require('fs')
const questions = require('../commons/questions')
const scaffold = require('../commons/scaffold')
const utils = require('../commons/utils')
const log = require('../commons/log')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('store [name]', 'create a vuex store module')
    .option('-f, --force', 'Force file overwrite')
    .alias('s')
    .action(function (args, callback) {
      // the command needs to run in the root of the project
      utils.canCommandRun()

      const blueTemplates = require(`${process.cwd()}/node_modules/blue-templates`)

      this.prompt([
        {
          when: function () {
            return !args.name
          },
          type: 'input',
          name: 'name',
          message: 'What\'s the name of your module?',
          validate: function (answer) {
            return answer !== ''
          }
        },
        {
          when: function () {
            return !args.options.hooks
          },
          type: 'confirm',
          name: 'addEvents',
          message: 'Would you like to add events, actions and mutations?',
          default: false
        },
        {
          when: function (answer) {
            return answer.addEvents
          },
          type: 'input',
          name: 'events',
          message: 'Add a comma separeted string (i.e. `get id` becomes `GET_ID`)',
          validate: function (answer) {
            return answer !== ''
          }
        }
      ])

      // Check if the folder is not already there, so we can ask for to overwrite or not
      .then(promptResult => {
        // It's not possible to know whether data is passed via command line options
        // or via questions. Both results needs to be merged so in any cases
        // a name and a type will always be available
        const mergedResult = _.assignIn({}, promptResult, args)
        const dest = `${blueTemplates.getStoreModulePath(process.cwd())}/${mergedResult.name}`
        const exists = fs.existsSync(dest)
        const overwriteQuestion = _.assignIn({
          when: function () {
            return exists && !args.options.force
          }
        }, questions.overwrite)

        return this.prompt(overwriteQuestion).then(answer => {
          if (answer.overwrite === false) {
            this.log('')
            this.log('   Ok thanks bye!')
            this.log('')
            process.exit(1)
          }

          return _.assignIn({ dest }, args, mergedResult)
        })
      })

      // Collecting all data from all questions
      .then(result => {
        return _.assignIn({
          template: blueTemplates.getStoreModule()
        }, result, result.options)
      })

      // Here the store module is actually generated!
      .then(result => {
        return scaffold.storeModule(result).then(() => {
          // pass data to the final step
          return result
        })
      })

      // Done!
      .then((result) => {
        this.log('')
        this.log(`   Vuex store module ${chalk.yellow.bold(result.name)} created!`)
        this.log('   The module is autoloaded in your application!')
        this.log('')

        // When the component is generated we need to fire the callback
        // provided by the action to bring the terminal back to the delimiter
        callback()
      })

      .catch(error => {
        this.log('')
        log.error(error, true)
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
