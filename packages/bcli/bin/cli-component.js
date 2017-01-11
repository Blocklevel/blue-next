'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const co = require('co')
const runComponent = require('../src/component')
const inquirer = require('inquirer')
const commonQuestions = require('../src/commons/questions')

module.exports = co.wrap(function * () {
  let answer = yield inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What\'s the name of the component?',
      validate: function (answer) {
        return answer !== ''
      }
    },
    commonQuestions.vueHooks,
    commonQuestions.fileLocation
  ])

  const options = _.assignIn(answer, {
    type: 'component'
  })

  return runComponent(options).catch(err => {
    console.error(chalk.red(err.stack))
    return
  })
})
