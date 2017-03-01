'use strict'
const runBuild = require('../src/build')
const _ = require('lodash')

module.exports = function (input, flags) {
  process.env.NODE_ENV = 'production'
  runBuild()
}
