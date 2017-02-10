'use strict'
const runBuild = require('../src/build')
const _ = require('lodash')

module.exports = function (input, flags) {
  const options = _.assignIn(flags, {
    env: 'prod'
  })

  runBuild(options)
}
