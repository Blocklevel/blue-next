const prog = require('caporal')
const createProject = require('./commands/project')
const createStoreModule = require('./commands/store')
const createComponent = require('./commands/component')
const { componentNameExists } = require('./commons/utils')

prog.version(require('../package.json').version)

prog
  .command('project', 'Create a project')
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
  .command('store', 'Create a Vuex store module')
  .argument('<name>', 'The name of the store module')
  .option('-f, --force', 'Force new store module creation')
  .action(createStoreModule)

const componentTypes = ['component', 'container', 'page']
componentTypes.forEach(type => {
  prog
    .command(type, `Create a ${type}`)
    .argument('<name>', `The name of the ${type}`)
    .option('-f, --force', 'Force new store module creation')
    .option('--boilerplate', 'Add a basic Vue boilerplate to the component')
    .action((args, options, logger) => {
      return componentNameExists(args.name).then(() => {
        return createComponent(type, { args, options, logger })
      })
    })
})

prog.parse(process.argv)
