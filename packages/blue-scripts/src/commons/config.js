const messages = require('./messages')
const paths = require('./paths')
const merge = require('webpack-merge')
const chalk = require('chalk')
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
  // blue.config.js is required!
  if (!exists()) {
    console.log(chalk.red(messages.NO_BLUE_CONFIG_FOUND))
    process.exit(1)
  }

  const blueConfig = require(paths.appConfig)
  const envConfig = require(`../webpack/env/${nodeEnv}`)
  const blueConfigWebpack = blueConfig.webpack || {}

  // assign the environment webpack configuration
  let webpackConfig = envConfig

  // merge the configuration with the blue.config.js webpack object if is not empty
  if (!_.isEmpty(blueConfigWebpack)) {
    webpackConfig = merge.smart({}, envConfig, blueConfigWebpack)
  }

  // It's important to separate the two type of informations.
  // Webpack 2 is very strict with properties, only Webpack properties are
  // allowed to be added.
  return {
    // Bcli configurations
    project: blueConfig.project,
    // Webpack only configurations
    webpack: webpackConfig
  }
}

const getPreProcessor = function () {
  const config = get().project
  const hasValue = !!(config.css && config.css.preProcessor)

  return hasValue ? config.css.preProcessor : 'postcss'
}

module.exports = {
  exists,
  get,
  getPreProcessor
}
