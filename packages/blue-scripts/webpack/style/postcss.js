const paths = require('../../config/paths')
const variables = require(`${paths.appStyle}/config/variables.js`)

module.exports = {
  postcss: require('postcss-blue-plugins')(variables),

  cssModules: {
    importLoaders: 1,
    modules: true,
    localIdentName: '[name]__[local]__[hash:base64:5]',
    camelCase: true
  }
}
