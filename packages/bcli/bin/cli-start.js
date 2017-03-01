'use strict'
const runServer = require('../src/server')
const _ = require('lodash')

module.exports = function (input, flags) {
  process.env.NODE_ENV = 'dev'
  runServer()
}
