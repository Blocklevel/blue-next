const combineLoaders = require('webpack-combine-loaders')
const blueConfig = require('../../commons/config')

const vue = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
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
