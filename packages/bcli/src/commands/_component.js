const generateComponent = require('../component')
const _ = require('lodash')
const pathExists = require('path-exists')
const questions = require('../commons/questions')
const blueTemplates = require('blue-templates')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('component [name] [type]', 'create a component')
    .option('-f, --force', 'Force file overwrite')
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
            return ['component', 'page', 'container'].indexOf(args.type) === -1
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
      .then(response => {
        const { type, name } = response
        const dest = `${process.cwd()}/src/app/${type}/${name}`

        return pathExists(dest).then(exists => {
          return this.prompt(questions.overwrite(exists && !args.force))
        }).then(response => {
          if (response.overwrite === false) {
            this.log('')
            this.log(chalk.yellow('   Ok thanks bye!'))
            this.log('')
            process.exit(1)
          }

          return _.assignIn({
            dest, name, type
          }, args)
        })
      })

      // Collecting all data from all questions
      .then(response => {
        return _.assignIn({
          template: blueTemplates.getComponent()
        }, response)
      })

      // Here the component is actually generated!
      .then(generateComponent)

      // When the component is generated we need to fire the callback
      // provided by the action to bring the terminal to the delimiter
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
