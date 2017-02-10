#!/usr/bin/env node
'use strict'
const cac = require('cac')
const chalk = require('chalk')
const pkg = require('../package.json')
const cli = cac()

cli.usage(`${chalk.yellow(pkg.name)} [command] [options]`)
cli.example(`${pkg.name} init my-project`)

cli.command('*', 'Show the prompt')
cli.command('project', 'Create a new awesome project')
cli.command('component', 'Create a new component')
cli.command('page', 'Create a new page')
cli.command('store', 'Create a new Vuex store module')
cli.command('packages', 'Install frequently used npm packages')
cli.command('start', 'Run the webpack dev server')
cli.command('share', 'Share the current local revision with ngrok')
cli.command('build', 'Bundles the application for production')

cli.parse()
