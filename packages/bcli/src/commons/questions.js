const co = require('co')
const inquirer = require('inquirer')
const chalk = require('chalk')

const force = {
  type: 'list',
  name: 'force',
  message: 'Would you like to override it?',
  default: false,
  choices: [
    {
      name: 'No, thanks!',
      value: false
    },
    {
      name: 'Yes, please!',
      value: true
    }
  ]
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

/**
 * Confirmation prompt for overriding actions
 */
const confirmPrompt = co.wrap(function * () {
  const confirm = yield inquirer.prompt([force])

  if (!confirm.force) {
    console.log(chalk.bold.yellow('\nNo problem!\n'))
    process.exit(1)
  }
})

module.exports = {
  force,
  vueHooks,
  confirmPrompt
}
