const chalk = require('chalk')

/**
 * Logs or throw errors
 * For testing purposes an error needs to be thrown.
 * @param  {String}  message
 * @param  {Boolean} [stack=false]
 */
const error = function (message, stack = false) {
  if (stack || process.env.NODE_ENV === 'test') {
    throw new Error(chalk.red(message))
  }

  /* eslint-disable */
  console.log(chalk.bold.red(message))
  /* eslint-disable */
  process.exit(1)
}

module.exports = {
  error
}
