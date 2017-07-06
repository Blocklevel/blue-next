const prog = require('caporal')

const createProject = require('./commands/project')
const createStoreModule = require('./commands/store')
const createComponent = require('./commands/component')
const createSymlink = require('./commands/symlink')
const { addSSR } = require('./commands/ssr')
const share = require('./commands/share')

prog.version(require('../package.json').version)

prog
  .command('project', 'Create a project')
  .alias('engage')
  .argument('<name>', 'The name of the project')
  .option('--major <version>', 'Install templates based on the major version')
  .option('-f, --force', 'Force project creation')
  .option('--ssr', 'Add Server Side Rendering')
  .option('--skip-deps', 'Skip dependencies installation')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-git-commit', 'Skip first git commit')
  .option('--symlink-packages', 'Symlink local Blue packages. (Only for development)')
  .option('--lerna-bootstrap', 'Use Lerna to bootstrap all Blue packages. (Only for development)')
  .action(createProject)

prog
  .command('store', 'Create a Vuex store module')
  .argument('<name>', 'The name of the store module')
  .option('-f, --force', 'Force store module creation')
  .action(createStoreModule)

prog
  .command('component', 'Create a component')
  .argument('<name>', 'The name of the component')
  .option('-f, --force', 'Force new component creation')
  .action(createComponent)

prog
  .command('page', 'Create a page')
  .argument('<name>', 'The name of the page')
  .option('-f, --force', 'Force page creation')
  .action(createComponent)

prog
  .command('container', 'Create a container')
  .argument('<name>', 'The name of the container')
  .option('-f, --force', 'Force container creation')
  .action(createComponent)

prog
  .command('ssr', 'Add server side rendering scaffold')
  .action(addSSR)

prog
  .command('symlink-packages', 'Symlink local Blue packages. (Only for development)')
  .option('--lerna-bootstrap', 'Use Lerna to bootstrap all Blue packages. (Only for development)')
  .action(createSymlink)

prog
  .command('share', 'Share localhost with a secure tunnel')
  .argument('<port>')
  .action(share)

prog.parse(process.argv)
