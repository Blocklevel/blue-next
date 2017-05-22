const paths = require('../../config/paths')

module.exports = {
  test: /\.js$/,
  enforce: 'pre',
  loader: 'eslint-loader',
  exclude: /node_modules/,
  include: [
    paths.appSrc
  ]
}
