const startSharing = require('../share')
const _ = require('lodash')

module.exports = function (vorpal) {
  vorpal
    .command('share [port]', 'share your localhost with a secure tunnel')
    .action(function (args, callback) {
      return this.prompt({
        when: function () {
          return !args.port
        },
        type: 'input',
        name: 'port',
        message: 'Which port would you like to share?',
        default: 8080
      })
      .then(response => {
        const options = _.assignIn({}, response, args)
        startSharing(options)
      })
    })
}
