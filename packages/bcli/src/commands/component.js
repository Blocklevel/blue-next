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
      // the command needs to run in the root of the project
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

        const { name, type } = mergedResult
        const dest = `${process.cwd()}/src/app/${type}/${name}`
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
        const blueTemplates = require(`${process.cwd()}/node_modules/blue-templates`)

        return _.assignIn({
          template: blueTemplates.getComponent()
        }, result, result.options)
      })

      // Here the component is actually generated!
      .then(result => scaffold.component(result).then(() => result))

      // Done!
      .then(result => {
        const { type, name } = result

        this.log('')
        this.log(`   ${_.startCase(type)}`, chalk.yellow.bold(name), 'was created successfully!')
        this.log('')
        this.log(chalk.italic(`    import ${_.camelCase(name)} from '${type}/${name}/${name}.vue'`))
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
