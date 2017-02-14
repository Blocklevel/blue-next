const combineLoaders = require('webpack-combine-loaders')
const paths = require('../../commons/paths')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const _ = require('lodash')

const vue = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      /**
       * @todo:
       * For the vue-loader documentation this is the way to go
       * but it's super ugly and, when there's an error, the file path
       * has this huge string attached to it.
       * Maybe open an issue to vue-loader to see if there's a more elegant solution
       */
      js: combineLoaders([
        require('./babel'),
        require('./eslint')
      ])
    }
  }
}

const postcss = [
  /**
   * PostCSS plugin for Sass-like variables, conditionals, and iteratives
   * https://github.com/jonathantneal/postcss-advanced-variables
   */
  require('postcss-advanced-variables')({
    variables: require(`${paths.appStyle}/config/variables.js`)
  }),

  /**
   * Plugin to inline @import rules content
   */
  require('postcss-import'),

  /**
   * A little bag of CSS superpowers
   * http://simplaio.github.io/rucksack/docs
   */
  require('rucksack-css')({
    // This is handled in postcss-short
    shorthandPosition: false
  }),

  /**
   * Unwrap nested styles like Sass does.
   * https://github.com/postcss/postcss-nested
   */
  require('postcss-nested'),

  /**
   * Mixins
   * https://github.com/postcss/postcss-mixins
   */
  require('postcss-mixins')({
    mixinsDir: `${paths.appStyle}/mixin`
  }),

  /**
   * Advanced shorthand properties
   * https://github.com/jonathantneal/postcss-short
   */
  require('postcss-short'),

  /**
   * Transform W3C CSS Custom Media Queries to more compatible CSS
   * https://github.com/postcss/postcss-custom-media
   */
  require('postcss-custom-media'),

  /**
   * PostCSS plugin to use tomorrow's CSS syntax
   * https://github.com/MoOx/postcss-cssnext
   */
  require('postcss-cssnext')({
    browsers: ['last 3 versions', 'iOS >= 8']
  })
]

const cssModules = {
  importLoaders: 1,
  modules: true,
  localIdentName: '[name]__[local]__[hash:base64:5]',
  camelCase: true
}

/**
 * @todo
 * Bcli.config already sets the cssPreprocess value if it's not default so we can read that
 * value and use the selected pre-processor
 * see https://github.com/Blocklevel/blue-next/commit/54913f8bfbd2f4a3fa41fa5b53fb030b7ab1c6bf
 */
vue.options = Object.assign({}, vue.options, { cssModules, postcss })

module.exports = vue
