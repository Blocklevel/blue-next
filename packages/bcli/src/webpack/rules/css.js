const bcliConfig = require('../../commons/config')
const preProcessor = bcliConfig.getPreProcessor()

// let rule = {}

// if (preProcessor === 'sass') {
//   rule = {
//     test: /\.scss$/,
//     loader: 'style-loader!css-loader!sass-loader'
//   }
// }

// if (preProcessor === 'postcss') {
//
//

module.exports = {
  test: /\.css$/,
  exclude: [/node_modules/],
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    'postcss-loader'
  ]
}
