const combineLoaders = require('webpack-combine-loaders')
const paths = require('../../commons/paths')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      /**
       * For the vue-loader documentation this is the way to go
       * but it's super ugly and, when there's an error, the file path
       * has this huge string attached to it.
       * @todo: open an issue to vue-loader to see if there's a more elegant solution
       */
      js: combineLoaders([
        require('./babel'),
        require('./eslint')
      ])
    },
    cssModules: {
      importLoaders: 1,
      modules: true,
      localIdentName: '[name]__[local]__[hash:base64:5]',
      camelCase: true
    },
    postcss: function () {
      const mixinsDir = `${paths.appStyle}/mixin`
      const variables = `${paths.appStyle}/config/variables.js`
      const globPath = [`${paths.appSrc}/**/*.css`, `${paths.appSrc}/**/*.vue`]

      return [
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
         * PostCSS plugin for Sass-like variables, conditionals, and iteratives
         * https://github.com/jonathantneal/postcss-advanced-variables
         */
        require('postcss-advanced-variables')({
          variables
        }),

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
          mixinsDir
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
    }
  }
}
