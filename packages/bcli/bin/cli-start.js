'use strict'
const runServer = require('../src/server')
const _ = require('lodash')

module.exports = function (input, flags) {
  const options = _.assignIn(flags, {
    dev: true
  })

  runServer(options)
}
