const vorpal = require('vorpal')()

// Add all commands
vorpal.use(require('./commands/_project'))
vorpal.use(require('./commands/_component'))
vorpal.use(require('./commands/_store'))
vorpal.use(require('./commands/_share'))

vorpal
  .delimiter('bcli$')
  .show()
  .parse(process.argv)

// workaround to kill node with CTRL + C
process.on('SIGINT', () => process.exit(2))
