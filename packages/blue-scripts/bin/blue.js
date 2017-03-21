#!/usr/bin/env node
'use strict'
const cac = require('cac')

const cli = cac()

cli.command('start', 'Start dev server')
cli.command('build', 'Build project')

cli.parse()
