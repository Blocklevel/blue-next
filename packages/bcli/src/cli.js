const vorpal = require('vorpal')()

// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

// Add all commands
vorpal.use(require('./commands/project'))
vorpal.use(require('./commands/component'))
vorpal.use(require('./commands/page'))
vorpal.use(require('./commands/container'))
vorpal.use(require('./commands/store'))
vorpal.use(require('./commands/ssr'))
vorpal.use(require('./commands/share'))
vorpal.use(require('./commands/version'))

// shows the current vorlap instance with delimiter
vorpal.delimiter('bcli$').show()

// process the given inputs
vorpal.parse(process.argv)

// workaround to kill node with CTRL + C
process.on('SIGINT', () => process.exit(2))
