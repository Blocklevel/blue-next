const paths = require('./paths')
const merge = require('webpack-merge')
const fs = require('fs')

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
 * @param  {String} [env=process.env.NODE_ENV]
 * @return {Object}
 */
const get = function (env = process.env.NODE_ENV) {
  if (!exists()) {
    console.log(chalk.red(`\nYou need to be in the root of a Blue project.`))
    process.exit(1)
  }

  const appConfig = require(paths.appConfig)
  const envConfig = require(`${paths.cliEnv}/${env}`)
  const webpackConfig = merge.smart({}, envConfig, appConfig.settings)

  delete appConfig.settings

  return {
    app: appConfig,
    webpack: webpackConfig
  }
}

const getPreProcessor = function () {
  const config = get()
  const defaultPreProcessor = 'postcss'
  const hasValue = config.css && config.css.preProcessor

  return hasValue ? config.css.preProcessor : defaultPreProcessor
}

module.exports = {
  exists,
  get,
  getPreProcessor
}
