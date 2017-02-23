'use strict'
const inquirer = require('inquirer')
const co = require('co')
const chalk = require('chalk')

module.exports = co.wrap(function * () {
  const answer = yield inquirer.prompt([
    {
      type: 'list',
      name: 'task',
      message: 'What would you like to do?',
      choices: [
        {
          name: 'Create a new component',
          value: 'component'
        },
        {
          name: 'Create a new page',
          value: 'page'
        },
        {
          name: 'Create a new Vuex store module',
          value: 'store'
        },
        {
          name: 'Create a new project',
          value: 'project'
        },
        {
          name: 'Install frequently used npm packages',
          value: 'packages'
        },
        {
          name: 'Start the development server',
          value: 'start'
        },
        {
          name: 'Build my application',
          value: 'build'
        },
        {
          name: 'Share the current local revision with ngrok',
          value: 'share'
        },
        new inquirer.Separator(),
        {
          name: 'Quit',
          value: false
        }
      ]
    }
  ])

  if (!answer.task) {
    console.log(chalk.bold('\nSee you!'))
    return
  }

  /**
   * Fire the command!
   */
  try {
    require(`./cli-${answer.task}`)()
  } catch (e) {
    console.log(e)
  }
})
