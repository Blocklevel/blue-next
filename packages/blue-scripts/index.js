// Makes the script crash on unhandled rejections instead of silently
// ignoring them
process.on('unhandledRejection', err => {
  throw err
})

/**
 * Get PostCSS config
 * @return {Object}
 */
const getPostCSSConfig = function () {
  return {
    plugins: require('./webpack/style/postcss').postcss
  }
}

const getEslintConfig = function () {
  return require('eslint-config-blocklevel')
}

module.exports = {
  getPostCSSConfig,
  getEslintConfig
}
