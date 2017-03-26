'use strict'
const portfinder = require('portfinder')
const chalk = require('chalk')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

portfinder.basePort = 8080

module.exports = portfinder.getPortPromise()

  // Returns the available port
  .then(response => response)

  // Prompt errors
  .catch(errpr => {
    console.log(chalk.red(error))
  })
