const postcss = require('./webpack/style/postcss')

/**
 * Get PostCSS config
 * @return {Object}
 */
const getPostCSSConfig = function () {
  return {
    plugins: postcss.postcss
  }
}

module.exports = {
  getPostCSSConfig
}
