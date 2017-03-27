const ExtractTextPlugin = require('extract-text-webpack-plugin')

const vue = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    cssModules: {
      localIdentName: '[hash:8]'
    },
    loaders: {
      css: ExtractTextPlugin.extract({
        use: 'css-loader',
        fallback: 'vue-style-loader'
      })
    }
  }
}

const babel = {
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    plugins: [require.resolve('babel-plugin-transform-flow-strip-types')]
  }
}

module.exports = [vue, babel]
