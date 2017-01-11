'use strict'
const co = require('co')
const detect = require('detect-port')
const inquirer = require('inquirer')
const chalk = require('chalk')

module.exports = co.wrap(function * (port) {
  const availablePort = yield detect(port)

  if (availablePort === parseInt(port)) {
    return port
  }

  const answer = yield inquirer.prompt([
    {
      type: 'input',
      name: 'port',
      message: `Port ${port} is already in use, would you like to use another port?`,
      default: availablePort
    }
  ])

  return answer.port
})
