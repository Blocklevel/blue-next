const paths = require('../../commons/paths')

module.exports = {
  test: /\.js$/,
  enforce: 'pre',
  loader: 'eslint-loader',
  include: [
    paths.appSrc
  ],
  options: {
    configFile: 'eslint-config-blocklevel'
  }
}
