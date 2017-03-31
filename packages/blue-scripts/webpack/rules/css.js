const paths = require('../../commons/paths')
const variables = require(`${paths.appStyle}/config/variables.js`)

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
    {
      loader: 'postcss-loader',
      options: {
        plugins: require('../style/postcss').postcss
      }
    }
  ]
}
