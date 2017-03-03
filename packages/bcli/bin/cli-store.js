'use strict'
const chalk = require('chalk')
const co = require('co')
const runStore = require('../src/store')
const inquirer = require('inquirer')
const commonQuestions = require('../src/commons/questions')

module.exports = co.wrap(function * (input, flags) {
  const answer = yield inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What\'s the name of the module?',
      validate: function (answer) {
        return answer !== ''
      }
    },
    {
      type: 'list',
      name: 'addEvents',
      message: 'Would you like to add events, actions and mutations?',
      choices: [
        {
          name: 'No, thanks!',
          value: false
        },
        {
          name: 'Oh, yes!',
          value: true
        },
      ],
      default: false
    },
    {
      when: function (response) {
        return response.addEvents
      },
      type: 'input',
      name: 'eventsList',
      message: 'List your events here (ex: "get token, removeToken")',
      validate: function (answer) {
        return answer !== ''
      }
    },
    {
      type: 'list',
      name: 'namespaced',
      message: 'Would you like a namespaced module?',
      choices: [
        {
          name: 'No, thanks!',
          value: false
        },
        {
          name: 'Oh, yes!',
          value: true
        },
      ],
      default: false
    }
  ])

  const options = Object.assign(answer, flags)

  return runStore(options).catch(err => {
    console.error(chalk.red(err.stack))
    return
  })
})
