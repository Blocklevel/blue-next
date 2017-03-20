const inquirer = require('inquirer')

const overwrite = {
  type: 'confirm',
  name: 'overwrite',
  message: 'The folder already exists. Do you want to overwrite it?',
  default: false
}

module.exports = {
  overwrite
}
