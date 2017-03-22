#!/usr/bin/env node
const semver = require('semver')
const chalk = require('chalk')

const currentNodeVersion = process.versions.node

if (!semver.satisfies(currentNodeVersion, '>=6.10.x')) {
  /* eslint-disable */
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
  /* eslint-enable */
}

require('./src/cli')
