const chalk = require('chalk')

const error = function (message) {
  throw new Error(chalk.bold.red(message))
}

module.exports = {
  error
}
