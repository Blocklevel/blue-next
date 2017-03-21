const pkg = require('../../package.json')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk

  vorpal
    .command('version', 'check current version')
    .alias('-v')
    .action(function (args, callback) {
      this.log(`you are running version ${chalk.bold(pkg.version)}`)
    })
}
