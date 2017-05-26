const fs = require('fs')
const scaffold = require('../commons/scaffold')
const utils = require('../commons/utils')
const log = require('../commons/log')
const Listr = require('listr')
const detectInstalled = require('detect-installed')

module.exports = function (vorpal) {
  const chalk = vorpal.chalk
  const ssrDependencies = [
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

  vorpal
    .command('ssr', 'add server side rendering support')
    .option('-y, --yarn', 'Force installation with Yarn')
    .option('-n, --npm', 'Force installation with NPM')
    .action(function (args, callback) {
      const hasYarn = args.options.yarn || detectInstalled.sync('yarn')

      utils.canCommandRun()

      const tasks = new Listr([
        {
          title: 'Install dependencies',
          enabled: () => !hasYarn,
          task: () => {
            return utils.exec('npm', ['install', '--save'].concat(ssrDependencies))
          }
        },
        {
          title: 'Install dependencies with ' + chalk.italic('yarn'),
          enabled: () => hasYarn,
          task: () => {
            return utils.exec('yarn', ['add'].concat(ssrDependencies))
          }
        },
        {
          title: 'Drop scaffold',
          task: () => {
            const blueTemplates = require(`${process.cwd()}/node_modules/blue-templates`)
            return scaffold.ssr({
              template: blueTemplates.getSSR(),
              dest: process.cwd()
            })
          }
        },
        {
          title: 'Update package.json scripts',
          task: () => {
            const packageJsonPath = `${process.cwd()}/package.json`
            const projectPackage = require(packageJsonPath)

            // TODO improve the package scripts
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

      tasks.run()
        .then(() => {
          console.log('')
          console.log('   SSR added successfully!')
          console.log('')

          process.exit(0)
        })
        .catch(error => {
          log.error(error, true)
        })
    })
}
