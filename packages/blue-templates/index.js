const path = require('path')

const getPath = relativePath => path.resolve(__dirname, relativePath)

const getPreProcessor = type => getPath(`./src/pre-processor/${type}`)

const getStylePath = dir => `${dir}/src/asset/style`

const getStoreModulePath = dir => `${dir}/src/app/data/store`

const getBlue = () => getPath('./src/blue')

const getComponent = () => getPath('./src/component')

const getStoreModule = () => getPath('./src/store')

const getSSR = () => getPath('./src/ssr')

module.exports = {
  getBlue,
  getPreProcessor,
  getComponent,
  getStoreModule,
  getStylePath,
  getStoreModulePath,
  getSSR
}
