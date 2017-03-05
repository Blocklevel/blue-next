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

const getEslintConfig = function () {
  return require('eslint-config-blocklevel')
}

module.exports = {
  getPostCSSConfig,
  getEslintConfig
}
