'use strict'
const chalk = require('chalk')
const co = require('co')
const runDefault = require('../src')
const inquirer = require('inquirer')

module.exports = co.wrap(function * (input, flags) {
  const answer = yield inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What\'s the name of the project?',
      validate: function (answer) {
        return answer !== ''
      }
    },
    {
      type: 'input',
      name: 'folderName',
      message: 'What\'s the name of the folder?',
      default: function (response) {
        return response.projectName
      },
      validate: function (answer) {
        return answer !== ''
      }
    }
  ])

  const options = Object.assign(answer, flags)

  return runDefault(options).catch(err => {
    console.error(chalk.red(err.stack))
    return
  })
})
