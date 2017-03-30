const path = require('path')
const fs = require('fs')

var appDirectory = fs.realpathSync(process.cwd())

const resolveApp = function (relativePath) {
  return path.resolve(appDirectory, relativePath)
}

const resolvePkg = function (relativePath) {
  return path.resolve(__dirname, '../', relativePath)
}

module.exports = {
  appDirectory: resolveApp('.'),
  ownNodeModules: resolveApp('node_modules/blue-scripts/node_modules'),
  appNodeModules: resolveApp('node_modules'),
  appConfig: resolveApp('blue.config.js'),
  appStyle: resolveApp('./src/asset/style'),
  appRoot: resolveApp('./src/app'),
  appEntry: resolveApp('./src/bootstrap.js'),
  appBuild: resolveApp('./build'),
  appBuildHash: process.env.VERSION_STRING || '[hash:6]',
  appSrc: resolveApp('./src'),
  appPackageJSON: resolveApp('./package.json'),
  appStatic: resolveApp('./static'),
  appHTMLIndex: resolveApp('./index.html'),
  webpackRules: resolvePkg('./webpack/rules'),
  blueScripts: resolveApp('node_modules/blue-scripts')
}
