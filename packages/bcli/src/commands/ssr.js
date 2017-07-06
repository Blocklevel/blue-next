const fs = require('fs')
const { createSSR } = require('../commons/scaffold')
const { checkBlueContext, yarnWithFallback } = require('../commons/utils')
const Listr = require('listr')
const chalk = require('chalk')
const detectInstalled = require('detect-installed')

const dependencies = [
  'vue-server-renderer',
  'memory-fs',
  'webpack-hot-middleware',
  'webpack-dev-middleware',
  'express',
  'webpack-merge',
  'webpack-node-externals',
  'friendly-errors-webpack-plugin',
  'cross-env',
  'rimraf'
]

module.exports = function ssr (args, options, logger) {
  checkBlueContext()

  const cwd = process.cwd()

  const tasks = new Listr([
    {
      title: 'Install dependencies',
      task: () => yarnWithFallback(
        ['add', '--dev'].concat(dependencies),
        ['install', '--save-dev'].concat(dependencies)
      )
    },
    {
      title: 'Add files to existing application',
      task: () => {
        const blueTemplates = require(`${cwd}/node_modules/blue-templates`)
        return createSSR({
          template: blueTemplates.getSSR(),
          dest: process.cwd()
        })
      }
    },
    {
      title: 'Update package.json scripts',
      task: () => {
        const packageJsonPath = `${cwd}/package.json`
        const projectPackage = require(packageJsonPath)

        projectPackage.scripts = Object.assign({}, projectPackage.scripts, {
          'dev': 'cross-env NODE_ENV=development node server/start-server.js',
          'start': 'cross-env NODE_ENV=production node server/start-server.js',
          'build': 'rimraf dist & npm run build:client & npm run build:server',
          'build:client': 'cross-env NODE_ENV=production webpack --config server/webpack.client.config.js --progress --hide-modules',
          'build:server': 'cross-env NODE_ENV=production webpack --config server/webpack.server.config.js --progress --hide-modules'
        })

        fs.writeFileSync(packageJsonPath, JSON.stringify(projectPackage, null, '\t'))
      }
    }
  ])

  return tasks.run()
  .then(() => {
    // TODO: add an explanation of all new commands added in the package.json scripts
    logger.info(`
      Server Side Rendering added successfully

      Before run:
        Remember to add id "app" to the root element of your application
    `)
  })
  .catch(error => {
    logger.error(chalk.red(`
      Opps! Something bad happened! :(
      ${chalk.bold(error.message)}
    `))
    logger.debug(error.stack)
    process.exit(1)
  })
}
