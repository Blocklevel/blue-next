'use strict'
const portfinder = require('portfinder')

portfinder.basePort = 8080

module.exports = portfinder.getPortPromise
