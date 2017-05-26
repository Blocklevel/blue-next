const _ = require('lodash')
const questions = require('./questions')
const utils = require('./utils')
const scaffold = require('./scaffold')
const fs = require('fs')
const log = require('./log')

module.exports = function createComponent (vorpal, { command, description, type }) {
  const chalk = vorpal.chalk

  vorpal
  .command(command, description)
  .option('-f, --force', 'Force file overwrite')
  .option('--hooks', 'Add basic component hooks')
  .action(function (args, callback) {
    utils.canCommandRun()

    let mergedResult = _.assignIn({}, { basic: args.options.hooks }, args)

    const nameArray = mergedResult.name.split('/')
    const hasCustomPath = nameArray.length > 1
    const name = hasCustomPath ? nameArray[nameArray.length - 1] : nameArray[0]
    const componentPath = `${process.cwd()}/src/app/${type}`
    const dest = hasCustomPath ? `${componentPath}/${nameArray.join('/')}` : `${componentPath}/${name}`

    const exists = fs.existsSync(dest)
    const overwriteQuestion = _.assignIn({
      when: function () {
        return exists && !args.options.force
      }
    }, questions.overwrite)

    this.prompt(overwriteQuestion).then(answer => {
      if (answer.overwrite === false) {
        this.log('')
        this.log('   Ok thanks bye!')
        this.log('')
        process.exit(1)
      }

      return _.assignIn(args, { dest }, { name, type })
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
