'use strict'
const chalk = require('chalk')
const devServer = require('../src/server')
const co = require('co')

module.exports = co.wrap(function * () {
  process.env.NODE_ENV = 'development'

  return devServer().catch(err => {
    console.log('')
    console.error(chalk.red(err.stack))
    console.log('')
    process.exit(1)
  })
})
