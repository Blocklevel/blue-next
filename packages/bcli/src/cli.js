const prog = require('caporal')
const createProject = require('./commands/project')

prog.version(require('../package.json').version)

prog
  .command('project', 'Create a new project')
  .alias('engage')
  .argument('<name>', 'The name of the project')
  .option('--major <version>', 'Install templates based on the major version')
  .option('--yarn', 'Install using yarn')
  .option('--npm', 'Install using npm')
  .option('-f, --force', 'Force new project creation')
  .option('--skip-deps', 'Skip dependencies installation')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-git-commit', 'Skip first git commit')
  .option('--use-local-templates', 'Use local template folder. Only for development purposes')
  .action(createProject)

prog
  .command('component', 'Create a new component')
  .argument('<name>', 'The name of the project')
  .action(function (inputs, flags, logger) {

  })


prog.parse(process.argv)
