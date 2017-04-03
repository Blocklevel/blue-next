'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const paths = require('../../../commons/paths')
const WebpackManifestPlugin = require('webpack-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')

module.exports = [
  new webpack.DefinePlugin({
    'process.env': {
      // Essential for Vue to build a smaller bundle
      // https://vue-loader.vuejs.org/en/workflow/production.html
      NODE_ENV: '"production"'
    }
  }),

  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  }),

  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compressor: {
      warnings: false,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
      negate_iife: false
    },
    output: {
      comments: false
    }
  }),

  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  }),

  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(paths.appNodeModules) === 0
      )
    }
  }),

  new ExtractTextPlugin({
    filename: `${paths.appBuildHash}/[name].css`,
    ignoreOrder: true,
    allChunks: true
  }),

  new webpack.optimize.OccurrenceOrderPlugin(),

  new WebpackManifestPlugin(),

  new CopyWebpackPlugin([
    {
      from: './static',
      to: './static'
    }
  ]),

  new FaviconsWebpackPlugin({
    logo: `${paths.appStatic}/image/favicon.png`,
    prefix: `static/favicon/`,
    persistentCache: false,
    inject: true,
    background: '#fff',
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      opengraph: false,
      twitter: false,
      yandex: false,
      windows: false
    }
  }),

  new ImageminPlugin({
    disable: false,
    plugins: [
      imageminMozjpeg({
        quality: 65,
        progressive: true
      })
    ],
    pngquant: {
      quality: '95-100'
    }
  })
]