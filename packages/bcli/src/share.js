const ngrok = require('ngrok')
const chalk = require('chalk')
const ora = require('ora')
const co = require('co')

const spinner = ora()

module.exports = co.wrap(function (input) {
  spinner.text = 'Sharing a new demo'
  spinner.start()

  ngrok.connect(input, function (error, url) {
    if (error) {
      spinner.fail()
      console.error(chalk.red('Share failed'))

      return
    }

    spinner.succeed()

    console.log(`
    ${chalk.bold('Sharing a new demo:')}

    ${chalk.italic(url)}
    `)
  })
})
