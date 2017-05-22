const combineLoaders = require('webpack-combine-loaders')
const blueConfig = require('../../config')

const vue = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      // all javascript that passes via vue-loader needs to pass also
      // via eslint and babel: babel-loader itself can't reach
      // these files
      js: combineLoaders([
        require('./babel'),
        require('./eslint')
      ])
    }
  }
}

// Merges the selected pre-processor from the configuration
vue.options = Object.assign(
  {},
  vue.options,
  require(`../style/${blueConfig.getPreProcessor()}`)
)

module.exports = vue
