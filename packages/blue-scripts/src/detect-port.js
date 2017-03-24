'use strict'
const portfinder = require('portfinder')
const chalk = require('chalk')

portfinder.basePort = 8080

module.exports = portfinder.getPortPromise().then(response => {
  return response
}).catch(errpr => {
  console.log(chalk.red(error))
})
