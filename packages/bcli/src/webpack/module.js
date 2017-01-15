'use strict'
const combineLoaders = require('webpack-combine-loaders')

const eslint = {
  test: /\.js$/,
  enforce: 'pre',
  loader: 'eslint-loader',
  exclude: /node_modules/,
  options: {
    configFile: require.resolve('eslint-config-blocklevel')
  }
}

const babel = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-2')
    ],
    plugins: [
      require.resolve('babel-plugin-transform-runtime')
    ]
  }
}

module.exports = {
  rules: [
    eslint,
    babel,
    {
      test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      loader: 'file-loader'
    },
    {
      test: /\.html$/,
      loader: 'html-loader'
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          js: combineLoaders([babel, eslint])
        },
        cssModules: {
          localIdentName: '[name]__[local]__[hash:base64:5]',
          camelCase: true
        }
      }
    }
  ]
}
