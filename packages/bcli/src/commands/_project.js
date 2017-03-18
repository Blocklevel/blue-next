const generateProject = require('../project')
const _ = require('lodash')
const pathExists = require('path-exists')
const questions = require('../commons/questions')
const blueTemplates = require('blue-templates')

module.exports = function (vorpal) {
  const c = vorpal.chalk

  vorpal
    .command('project <name>', 'create a new project with Blue <3')
    .option('-f, --force', 'Force file overwrite')
    .alias('p')
    .action(function (args, callback) {
      const dest = `${process.cwd()}/${args.name}`

      pathExists(dest)
        .then(exists => {
          if (exists && !args.options.force) {
            return this.prompt(questions.force).then(response => {
              if (!response.overwrite) {
                this.log('')
                this.log(c.yellow('   Ok thanks bye!'))
                this.log('')
                process.exit(1)
                return
              }

              return _.assignIn({}, args, response)
            })
          }

          return args
        })
        .then(() => {
          const template = blueTemplates.getBlue()
          const cssTemplate = blueTemplates.getPreProcessor('postcss')
          const data = _.assignIn({
            dest,
            template,
            cssTemplate
          }, args)

          return generateProject(data)
        })
        .catch(error => {
          this.log('')
          throw error
        })
    })
}
