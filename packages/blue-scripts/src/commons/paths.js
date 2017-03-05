const path = require('path')
const fs = require('fs')

var appDirectory = fs.realpathSync(process.cwd())

const resolveApp = function (relativePath) {
  return path.resolve(appDirectory, relativePath)
}

module.exports = {
  appDirectory: resolveApp('.'),
  ownNodeModules: resolveApp('node_modules/blue-scripts/node_modules'),
  appNodeModules: resolveApp('node_modules'),
  appConfig: resolveApp('bcli.config.js'),
  appStyle: resolveApp('./src/asset/style'),
  appRoot: resolveApp('./src/app'),
  appEntry: resolveApp('./src/bootstrap.js'),
  appBuild: resolveApp('./build'),
  appSrc: resolveApp('./src'),
  appHTMLIndex: resolveApp('./index.html'),
  blueScripts: resolveApp('node_modules/blue-scripts')
}