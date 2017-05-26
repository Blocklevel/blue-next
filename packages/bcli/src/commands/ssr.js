const scaffold = require('../commons/scaffold')
const utils = require('../commons/utils')
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
    'webpack-node-externals'
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
        }
      ])

      tasks.run()
        .then(() => {
          console.log('done!')
        })
        .catch(() => {
          console.log('Error')
        })
    })
}
