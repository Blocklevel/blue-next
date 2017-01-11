const chalk = require('chalk')
const inquirer = require('inquirer')
const co = require('co')
const runShare = require('../src/share')

module.exports = co.wrap(function * (input, flags) {
  const answer = yield inquirer.prompt([
    {
      when: function () {
        return !flags.port
      },
      type: 'input',
      name: 'port',
      message: 'Which port would you like to use?',
      validate: function (answer) {
        return answer !== ''
      }
    }
  ])

  const port = answer.port || flags.port

  return runShare(port).catch(err => {
    console.error(chalk.red(err.stack))
    return
  })
})
