const defaultBrowsers = ['last 3 versions', 'iOS >= 8']

module.exports = function (variables = {}, browsers = defaultBrowsers) {
  return [
   require('postcss-import'),
   require('rucksack-css')({ shorthandPosition: true }),
   require('postcss-nested'),
   require('postcss-mixins'),
   require('postcss-short'),
   require('postcss-custom-media'),
   require('postcss-advanced-variables')({ variables }),
   require('postcss-cssnext')({ browsers })
  ]
}
