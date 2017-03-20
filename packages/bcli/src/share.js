const ngrok = require('ngrok')
const chalk = require('chalk')
const ora = require('ora')
const co = require('co')

const spinner = ora()

module.exports = co.wrap(function (args) {
  console.log('')
  spinner.text = `Share port ${args.port}`
  spinner.start()

  ngrok.connect(args, function (error, url) {
    if (error) {
      spinner.fail()
      console.log('')
      console.log(
        chalk.red('   Unable to share! Probably the port is still busy.')
      )
      console.log('')
      return
    }

    spinner.succeed()
    console.log('')
    console.log(`   ${chalk.italic(url)}`)
    console.log('')
  })
})
