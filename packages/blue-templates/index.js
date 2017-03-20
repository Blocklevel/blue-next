const path = require('path')

const getPath = function (relativePath) {
  return path.resolve(__dirname, relativePath)
}

const getPreProcessor = function (type) {
  return getPath(`./src/pre-processor/${type}`)
}

const getStylePath = function (dir) {
  return `${dir}/src/asset/style`
}

const getStoreModulePath = function (dir) {
  return `${dir}/src/app/store/modules`
}

const getBlue = function () {
  return getPath('./src/blue')
}

const getComponent = function () {
  return getPath('./src/component')
}

const getStoreModule = function () {
  return getPath('./src/store')
}

module.exports = {
  getBlue,
  getPreProcessor,
  getComponent,
  getStoreModule,
  getStylePath,
  getStoreModulePath
}
