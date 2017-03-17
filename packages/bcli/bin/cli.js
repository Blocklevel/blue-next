#!/usr/bin/env node
const vorpal = require('vorpal')()
const project = require('./project')

vorpal.use(project)

vorpal
  .delimiter('bcli$')
  .show()
  .parse(process.argv)
