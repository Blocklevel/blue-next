'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const paths = require('../../../config/paths')
const WebpackManifestPlugin = require('webpack-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const argv = require('minimist')(process.argv.slice(2))
const hasImageOptimization = !argv['skip-image-optimization']

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      // Essential for Vue to build a smaller bundle
      // https://vue-loader.vuejs.org/en/workflow/production.html
      NODE_ENV: '"production"',
      VUE_ENV: '"client"',
      BASE_URL: JSON.stringify(paths.appPublicPath)
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
    compress: {
      screw_ie8: true,
      warnings: false
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      comments: false,
      screw_ie8: true
    },
    sourceMap: true
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
    minChunks (module, count) {
      // look for every required node_modules
      var context = module.context;
      return context && context.indexOf('node_modules') >= 0;
    }
  }),

  new ExtractTextPlugin({
    filename: `${paths.appBuildHash}/[name].css`,
    ignoreOrder: true,
    allChunks: true
  }),

  new webpack.optimize.OccurrenceOrderPlugin(),

  new WebpackManifestPlugin(),

  new LodashModuleReplacementPlugin({
    collections: true,
    shorthands: true
  }),

  new CopyWebpackPlugin([
    {
      from: './static',
      to: './static'
    }
  ])
]

if (hasImageOptimization) {
  plugins.push(
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
        quality: 65,
        verbose: true
      }
    })
  )
}

module.exports = plugins
