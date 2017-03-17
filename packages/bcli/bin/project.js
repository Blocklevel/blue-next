const generateProject = require('../src/project')
const _ = require('lodash')
const pathExists = require('path-exists')
const questions = require('../src/commons/questions')

module.exports = function (vorpal) {
  const c = vorpal.chalk

  vorpal
    .command('project <name>', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .alias('p')
    .action(function (args, callback) {
      const dest = `${process.cwd()}/${args.name}`

      args = _.assignIn({ dest }, args)

      pathExists(dest)
        .then(exists => {
          if (exists && !args.options.force) {
            return this.prompt(questions.force).then(response => {
              if (!response.overwrite) {
                this.log('')
                this.log(c.yellow('   Ok thanks bye!'))
                this.log('')
                callback()
                return
              }

              return _.assignIn({}, args, response)
            })
          }

          return args
        })
        .then(generateProject)
        .catch(error => {
          this.log('')
          throw error
        })
    })
}
