#!/usr/bin/env node

const chalk = require('chalk')

var currentNodeVersion = process.versions.node
if (currentNodeVersion.split('.')[0] < 6.10) {
  console.error(
    chalk.red(
      'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Blue CLI requires Node 6.10 or higher. \n' +
        'Please update your version of Node.'
    )
  )
  process.exit(1)
}

require('./src/cli')
