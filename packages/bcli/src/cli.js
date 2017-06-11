const prog = require('caporal')
const createProject = require('./commands/project')
const createStoreModule = require('./commands/store')

prog.version(require('../package.json').version)

prog
  .command('project', 'Create a new project')
  .alias('engage')
  .argument('<name>', 'The name of the project')
  .option('--major <version>', 'Install templates based on the major version')
  .option('-f, --force', 'Force new project creation')
  .option('--skip-deps', 'Skip dependencies installation')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-git-commit', 'Skip first git commit')
  .option('--symlink-packages', 'Symlink local Blue packages. (Only for development)')
  .option('--lerna-bootstrap', 'Use Lerna to bootstrap all Blue packages. (Only for development)')
  .action(createProject)

prog
  .command('component', 'Create a new component')
  .argument('<name>', 'The name of the component')
  .action(function (inputs, flags, logger) {

  })

prog
  .command('store', 'Create a new Vuex store module')
  .argument('<name>', 'The name of the store module')
  .option('-f, --force', 'Force new store module creation')
  .action(createStoreModule)

prog.parse(process.argv)
