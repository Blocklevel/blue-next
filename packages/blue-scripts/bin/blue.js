#!/usr/bin/env node
'use strict'
const script = process.argv[2]

switch (script) {
  case 'build':
  case 'start':
  case 'eject':
  case 'lint':
    require(`../scripts/${script}`)
    break
  default:
    console.log('')
    console.log(`Unknown script "${script}".`)
    console.log('Check documentation: https://blocklevel.gitbooks.io/blue-next/content/installation.html')
    break;
}
