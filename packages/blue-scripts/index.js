/**
 * Returns Blue configuration object
 * @return {Object}
 */
function getConfig () {
  return require('./commons/config').get()
}

/**
 * Returns final webpack configuration object based on the current NODE_ENV value
 * The configuration is the merge between the current environment and bcli.config.js options 
 * @return {Object}
 */
function getWebpackConfig () {
  return getConfig().webpack
}

module.exports = {
  getConfig,
  getWebpackConfig
}
