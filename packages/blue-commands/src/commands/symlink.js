const Listr = require('listr')
const chalk = require('chalk')
const { symlinkPackages, bootstrapBlue } = require('../utils')

module.exports = function symlink (args, options, logger) {
  const tasks = new Listr([
    {
      title: 'Create packages symlink',
      task: ctx => symlinkPackages(process.cwd())
    },
    {
      title: 'Bootstrap packages',
      enabled: () => options.lernaBootstrap,
      task: () => bootstrapBlue()
    }
  ])

  return tasks.run()
    .then(() => {
      logger.info(`
        Packages successfully symlinked to the local Blue repository
      `)
    })
    .catch(error => {
      logger.error(chalk.red(`
        Opps! Something bad happened! :(
        ${chalk.bold(error.message)}
      `))
      logger.debug(error.stack)
      process.exit(1)
    })
}
