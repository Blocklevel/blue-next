const inquirer = require('inquirer')

const overwrite = function (shouldAsk) {
  return {
    when: function () {
      return shouldAsk
    },
    type: 'confirm',
    name: 'overwrite',
    message: 'The folder already exists. Do you want to overwrite it?',
    default: false
  }
}

const vueHooks = {
  type: 'list',
  name: 'basic',
  message: 'Would you like some basic Vue hooks?',
  choices: [
    {
      name: 'No, thanks!',
      value: false
    },
    {
      name: 'Oh, yes!',
      value: true
    }
  ],
  default: false
}

module.exports = {
  overwrite,
  vueHooks
}
