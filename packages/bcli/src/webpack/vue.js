const babelOptions = require('./babelOptions')
const combineLoaders = require('webpack-combine-loaders')

module.exports = {
  loaders: {
    js: combineLoaders([
      {
        loader: 'babel-loader',
        query: babelOptions
      },
      {
        loader: 'eslint-loader'
      }
    ])
  }
}
