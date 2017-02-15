const combineLoaders = require('webpack-combine-loaders')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// @todo: i've had to copy and paste this from ../../rules/vue.js to make it work
module.exports = [{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      js: combineLoaders([
        require('../../rules/babel'),
        require('../../rules/eslint')
      ]),

      css: ExtractTextPlugin.extract({
        use: 'css-loader',
        fallback: 'vue-style-loader'
      })
    }
  }
}]
