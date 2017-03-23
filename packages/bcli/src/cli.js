const vorpal = require('vorpal')()
// const chalk = require('chalk')

// Add all commands
vorpal.use(require('./commands/_project'))
// vorpal.use(require('./commands/_component'))
// vorpal.use(require('./commands/_store'))
// vorpal.use(require('./commands/_share'))
// vorpal.use(require('./commands/_version'))

// shows the current vorlap instance with delimiter
vorpal.delimiter('bcli$').show()

// process the given inputs
vorpal.parse(process.argv)

// workaround to kill node with CTRL + C
process.on('SIGINT', () => process.exit(2))
