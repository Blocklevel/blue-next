const path = require('path')
const fs = require('fs')
const caporal = require('caporal')
const info = require('./package.json')

const project = require('./src/commands/project')
const component = require('./src/commands/component')
const share = require('./src/commands/share')
const store = require('./src/commands/store')
const ssr = require('./src/commands/ssr')
const symlink = require('./src/commands/symlink')

caporal.version(info.version)

function register (config) {
  const projectConfigFilePath = path.resolve(process.cwd(), 'blue.config.js')
  const isBlueProject = fs.existsSync(projectConfigFilePath)

  caporal
    .command('project', 'Create project')
    .argument('<name>', 'name of the project')
    .option('--major <version>', 'Install templates based on the major version')
    .option('-f, --force', 'Force project creation')
    .option('--skip-deps', 'Skip dependencies installation')
    .option('--skip-git', 'Skip git initialization')
    .option('--skip-git-commit', 'Skip first git commit')
    .option('--symlink-packages', 'Symlink local Blue packages. (Only for development)')
    .option('--lerna-bootstrap', 'Use Lerna to bootstrap all Blue packages. (Only for development)')
    .action(project)

  caporal
    .command('share', 'Share localhost with a secure tunnel')
    .argument('<port>')
    .action(share)

  caporal
    .command('symlink-packages', 'Symlink local Blue packages. (Only for development)')
    .option('--lerna-bootstrap', 'Use Lerna to bootstrap all Blue packages. (Only for development)')
    .action(symlink)

  if (isBlueProject) {
    caporal
      .command('component', 'Create a component')
      .argument('<name>', 'The name of the component')
      .option('-f, --force', 'Force component creation')
      .action(component)

    caporal
      .command('container', 'Create a container')
      .argument('<name>', 'The name of the container')
      .option('-f, --force', 'Force container creation')
      .action(component)

    caporal
      .command('page', 'Create a page')
      .argument('<name>', 'The name of the page')
      .option('-f, --force', 'Force page creation')
      .action(component)

    caporal
      .command('store', 'Create a Vuex store module')
      .argument('<name>', 'The name of the store module')
      .option('-f, --force', 'Force store module creation')
      .action(store)

    caporal
      .command('ssr', 'Add server side rendering scaffold')
      .action(ssr)
  }

  caporal.parse(process.argv)
}

module.exports = { register }
