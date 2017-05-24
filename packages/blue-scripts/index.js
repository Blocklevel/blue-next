const config = require('./config').getConfig()

/**
 * Returns final webpack configuration object based on the current NODE_ENV value
 * The configuration is the merge between the current environment and bcli.config.js options
 * @return {Object}
 */
function getWebpackConfig () {
  return config.webpack
}

module.exports = {
  config,
  getWebpackConfig
}
