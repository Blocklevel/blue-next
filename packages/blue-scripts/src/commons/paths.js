const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = function (relativePath) {
  return path.resolve(appDirectory, relativePath)
}

module.exports = {
  // App
  appDirectory: appDirectory,
  appBuild: resolveApp('build'),
  appStatic: resolveApp('./static'),
  appEntry: './src/bootstrap.js',
  appHTMLIndex: resolveApp('./index.html'),
  appPackageJSON: resolveApp('package.json'),
  appConfig: resolveApp('bcli.config.js'),
  appSrc: resolveApp('src'),
  appRoot: resolveApp('src/app'),
  appNodeModules: resolveApp('node_modules'),
  appStyle: resolveApp('src/asset/style'),

  // Blue script
  blueEnv: resolveApp(`./node_modules/blue-scripts/src/webpack/env`)
}
