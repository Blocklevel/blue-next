#!/usr/bin/env node
'use strict'
const cac = require('cac')
const chalk = require('chalk')

const cli = cac()

cli.usage(`${chalk.yellow('blue-scripts')} [command] [options]`)
cli.example('blue-scripts project')

cli.command('*', 'Show the prompt')
cli.command('start', 'Start dev server')
cli.command('build', 'Build project')

cli.parse()
