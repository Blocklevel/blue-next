const path = require('path')
const fs = require('fs')

var appDirectory = fs.realpathSync(process.cwd())

const resolveApp = function (relativePath) {
  return path.resolve(appDirectory, relativePath)
}

// see Blocklevel/blue-next/issues/38
const appBuildHash = process.env.VERSION_STRING || 'dist'

// see Blocklevel/blue-next/issues/67
const appPublicPath = process.env.BASE_URL || '/'

// we are in the ./config folder in the root of the project
module.exports = {
  appDirectory: resolveApp('.'),
  appNodeModules: resolveApp('node_modules'),
  appConfig: resolveApp('blue.config.js'),
  appStyle: resolveApp('./src/asset/style'),
  appRoot: resolveApp('./src/app'),
  appEntry: resolveApp('./src/core/bootstrap.js'),
  appBuild: resolveApp('./build'),
  appSrc: resolveApp('./src'),
  appPackageJSON: resolveApp('./package.json'),
  appStatic: resolveApp('./static'),
  appHTMLIndex: resolveApp('./index.html'),
  webpackRules: resolveApp('./config/webpack/rules'),
  appBuildHash,
  appPublicPath
}

// @remove-on-eject-begin
const resolveOwn = function (relativePath) {
  return path.resolve(__dirname, '..', relativePath)
}

// we are inside blue-scripts here!
module.exports = {
  appDirectory: resolveApp('.'),
  appNodeModules: resolveApp('node_modules'),
  appConfig: resolveApp('blue.config.js'),
  appStyle: resolveApp('./src/asset/style'),
  appRoot: resolveApp('./src/app'),
  appEntry: resolveApp('./src/core/bootstrap.js'),
  appBuild: resolveApp('./build'),
  appSrc: resolveApp('./src'),
  appPackageJSON: resolveApp('./package.json'),
  appStatic: resolveApp('./static'),
  appHTMLIndex: resolveApp('./index.html'),
  webpackRules: resolveOwn('./webpack/rules'),
  blueScripts: resolveApp('node_modules/blue-scripts'),
  webpackRules: resolveOwn('./webpack/rules'),
  ownNodeModules: resolveOwn('node_modules'),
  appBuildHash,
  appPublicPath
}
// @remove-on-eject-end
