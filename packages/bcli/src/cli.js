const vorpal = require('vorpal')()

// CLI commands
const project = require('./commands/_project')
const component = require('./commands/_component')
const store = require('./commands/_store')
const share = require('./commands/_share')

// Add all commands
vorpal.use(project)
vorpal.use(component)
vorpal.use(store)
vorpal.use(share)

vorpal
  .delimiter('bcli$')
  .show()
  .parse(process.argv)

// workaround to kill node with CTRL + C
process.on('SIGINT', () => process.exit(2))
