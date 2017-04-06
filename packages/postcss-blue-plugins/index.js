const defaultBrowsers = ['last 3 versions', 'iOS >= 8']

module.exports = function (variables = {}, browsers = defaultBrowsers) {
  return [
    /**
     * Share global variable across the application
     * https://github.com/jonathantneal/postcss-advanced-variables
     */
    require('postcss-advanced-variables')({ variables }),

    /**
     * Flexbox grid system
     * https://github.com/Blocklevel/postgrid
     */
    require('postgrid'),

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
      // mixinsDir: 'src/style/mixin'
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
    require('postcss-cssnext')({ browsers })
  ]
}
