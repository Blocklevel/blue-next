'use strict'

process.env.NODE_ENV = 'production'
process.env.VERSION_STRING = new Date().getTime().toString()

module.exports = require('../src/build')
