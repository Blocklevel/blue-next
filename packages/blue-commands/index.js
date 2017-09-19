const path = require('path')
const fs = require('fs')
const caporal = require('caporal')
const info = require('./package.json')
const chalk = require('chalk')

const project = require('./src/commands/project')
const component = require('./src/commands/component')
const share = require('./src/commands/share')
const store = require('./src/commands/store')
const symlink = require('./src/commands/symlink')
const development = require('./src/commands/development')
const update = require('./src/commands/update')

caporal.version(info.version)

function register (config) {
  const projectConfigFilePath = path.resolve(process.cwd(), 'blue.config.js')
  const customCommandsPath = path.resolve(process.cwd(), 'cli.config.js')
  const isBlueProject = fs.existsSync(projectConfigFilePath)
  const hasCustomCommands = fs.existsSync(customCommandsPath)

  if (config.development.enabled) {
    console.log(`\n   ${chalk.red('[!] Running in development mode')}`)
  }

  caporal
    .command('project', 'Create project')
    .argument('<name>', 'name of the project')
    .option('--major <version>', 'Install templates based on the major version')
    .option('-f, --force', 'Force project creation')
    .option('--skip-deps', 'Skip dependencies installation')
    .option('--skip-git', 'Skip git initialization')
    .option('--skip-git-commit', 'Skip first git commit')
    .action(project)

  caporal
    .command('share', 'Share localhost with a secure tunnel')
    .argument('<port>')
    .action(share)

  caporal
    .command('update', 'Update Command-line Interface')
    .action(update)

  caporal
    .command('dev', 'Configure Blue to work with your local Blue packages')
    .option('--set-status', 'Enable/disable development mode')
    .option('--set-path', 'Add the path of your local repository')
    .action(development)

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
  }

  if (config.development.enabled && config.development.packages) {
    caporal
      .command('symlink-packages', 'Symlink local Blue packages.')
      .option('--lerna-bootstrap', 'Use Lerna to bootstrap all Blue packages')
      .action(symlink)
  }

  if (hasCustomCommands) {
    require(customCommandsPath)(caporal)
  }

  caporal.parse(process.argv)
}

module.exports = { register }
