const path = require('path')
const scaffold = require('./src/scaffold')

/**
 * This method will take any process from the CLI
 * and will check first if that command is available
 * and then will execute it
 * Moving the brain of the template generator to the template itself
 * will move all logic locally, removing the need to change the CLI
 * @param  {String} key
 * @param  {*}      args
 */
function execute (key, args) {
  const process = scaffold[key]

  if (!process) {
    return
  }

  return Promise.resolve(process(args))
}

module.exports = Object.assign(scaffold, { execute })
