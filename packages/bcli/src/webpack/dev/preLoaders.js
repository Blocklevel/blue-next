const paths = require('../../commons/paths')

module.exports = [
  {
    test: /\.js$/,
    loader: 'eslint-loader',
    include: [paths.appSrc]
  }
]
