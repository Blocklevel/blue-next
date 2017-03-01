const paths = require('./paths')
const merge = require('webpack-merge')
const fs = require('fs')
const _ = require('lodash')

/**
 * Detects the bcli.config.js file
 * It returns the file content if detected, otherwise returns false
 * @return {Object|Boolean}
 */
const exists = function () {
  try {
    return !!require(paths.appConfig)
  } catch (error) {
    return false
  }
}

/**
 * If the bcli.config.js exits, it returns the env configuration
 * merged with the webpack configuration
 * @param  {String} [nodeEnv=process.env.NODE_ENV]
 * @return {Object}
 */
const get = function (nodeEnv = process.env.NODE_ENV) {
  if (!exists()) {
    console.log(chalk.red(`\nYou need to be in the root of a Blue project.`))
    process.exit(1)
  }

  // Configs
  const bcliConfig = require(paths.appConfig)
  const envConfig = require(`${paths.cliEnv}/${nodeEnv}`)

  // Merge the env config and the bcli.config.js file
  const webpackConfig = merge.smart({}, envConfig, bcliConfig.webpack)

  delete bcliConfig.webpack

  // It's important to separate the two type of informations.
  // Webpack 2 is very strict with properties, only Webpack properties are
  // allowed to be added.
  return {
    // Bcli configurations
    app: bcliConfig,
    // Webpack only configurations
    webpack: webpackConfig
  }
}

const getPreProcessor = function () {
  const config = get().app
  const hasValue = !!(config.css && config.css.preProcessor)

  return hasValue ? config.css.preProcessor : 'postcss'
}

module.exports = {
  exists,
  get,
  getPreProcessor
}
