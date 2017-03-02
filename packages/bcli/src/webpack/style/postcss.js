const webpack = require('webpack')
const paths = require('../../commons/paths')
const variables = require(`${paths.appStyle}/config/variables.js`)

module.exports = {
  postcss: [
    require('postcss-advanced-variables')({ variables }),
    require('postcss-cssnext')({
      browsers: ['last 3 versions', 'iOS >= 8']
    })
  ],

  cssModules: {
    importLoaders: 1,
    modules: true,
    localIdentName: '[name]__[local]__[hash:base64:5]',
    camelCase: true
  }
}
