const _ = require('lodash')
const questions = require('../commons/questions')
const utils = require('../commons/utils')
const scaffold = require('../commons/scaffold')
const fs = require('fs')
const log = require('../commons/log')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('component <name>', 'create a component')
    .option('-f, --force', 'Force file overwrite')
    .option('-t, --types', 'Show component types')
    .option('--hooks', 'Add basic component hooks')
    .alias('page')
    .alias('container')
    .action(function (args, callback) {
      utils.canCommandRun()

      this.prompt([
        {
          when: function () {
            return args.options.types
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
        }
      ])

      // Check if the folder is not already there, so we can ask for to overwrite or not
      .then(promptResult => {
        // It's not possible to know whether data is passed via command line options
        // or via questions. Both results needs to be merged so in any cases
        // a name and a type will always be available
        let mergedResult = _.assignIn({}, promptResult, { basic: args.options.hooks }, args)

        // the type of component is not mandatory so if not defined we can use the alias used
        // to call the command and assign that value as default component type
        // @example: `bcli page my-page` will evaluate the default type with the value of `page`
        if (!mergedResult.type) {
          mergedResult.type = process.argv[0]
        }

        const nameArray = mergedResult.name.split('/')
        const hasCustomPath = nameArray.length > 1
        const name = hasCustomPath ? nameArray[nameArray.length - 1] : nameArray[0]
        const componentPath = `${process.cwd()}/src/app/${mergedResult.type}`
        const dest = hasCustomPath ? `${componentPath}/${nameArray.join('/')}` : `${componentPath}/${name}`

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

          return _.assignIn(args, { dest }, { name, type: mergedResult.type })
        })
      })

      // Collecting all data from all questions
      .then(result => {
        const blueTemplates = require(`${process.cwd()}/node_modules/blue-templates`)

        return _.assignIn({
          template: blueTemplates.getComponent()
        }, result, result.options)
      })

      // Here the component is actually generated!
      .then(result => scaffold.component(result).then(() => result))

      // Done!
      .then(result => {
        this.log('')
        this.log(`   ${_.startCase(result.type)}`, chalk.yellow.bold(result.name), 'was created successfully!')
        this.log('')

        // exit from vorpal delimiter
        process.exit(0)
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
