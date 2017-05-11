const paths = require('../../commons/paths')

module.exports = {
  test: /\.js$/,
  enforce: 'pre',
  loader: 'eslint-loader',
  exclude: /node_modules/,
  include: [
    paths.appSrc
  ]
}
