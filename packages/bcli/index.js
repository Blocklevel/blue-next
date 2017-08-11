#!/usr/bin/env node
const semver = require('semver')
const chalk = require('chalk')
const currentNodeVersion = process.versions.node

if (!semver.satisfies(currentNodeVersion, '>=6.10.x')) {
  console.error(chalk.red(`
    You are running Node ${currentNodeVersion}
    Blue CLI requires Node 6.10 or higher.
    Please update your version of Node.
  `))

  process.exit(1)
}

require('./src/cli')
