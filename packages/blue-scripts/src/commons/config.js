const messages = require('./messages')
const paths = require('./paths')
const merge = require('webpack-merge')
const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs')

let isConfigurationModified = false

const blueConfigDefaults = {
  name: 'my-project'
}

/**
 * Detects the bcli.config.js file
 * It returns the file content if detected, otherwise returns false
 * @return {Object|Boolean}
 */
const getBlueConfig = function () {
  try {
    return require(paths.appConfig)
  } catch (error) {
    console.log(chalk.red(messages.NO_BLUE_CONFIG_FOUND))
    process.exit(1)
  }
}

/**
 * Returns available node environment string
 * If the value is not handled by Blue, the application will
 * fallback to 'production'
 * @return {String}
 */
function getNodeEnv () {
  const env = process.env.NODE_ENV
  const allowed = ['development', 'production']

  if (allowed.indexOf(env) === -1) {
    return 'production'
  }

  return env
}

/**
 * Returns the modified property in the webpack configuration
 * @param  {Function} modifier - function from the configuration file
 * @param  {Array} data
 * @param  {Function} arrayToMap - custom function that returns a map of the array
 * @return {Array}
 */
function webpackConfigModifierHandler (modifier, data, arrayToMap) {
  const toArray = _.values
  const changes = modifier({ map: arrayToMap(), array: data }, toArray)

  return changes.constructor === Array ? changes : toArray(changes)
}

/**
 * Modifies the webpack configuration
 * @param  {Object} config
 * @param  {Object} webpack
 * @param  {String} [nodeEnv=process.env.NODE_ENV]
 * @return {Object}
 */
function applyWebpackConfigModifiers (config, webpackConfig, nodeEnv = getNodeEnv()) {
  const envConfig = config[nodeEnv] || {}
  // TODO better implementation of these checks
  const pluginHelper = envConfig.webpackHelper && envConfig.webpackHelper.plugins
  const rulesHelper = envConfig.webpackHelper && envConfig.webpackHelper.rules
  const webpackModifier = envConfig.webpack

  if (webpackModifier) {
    // notify that configuration is changed
    isConfigurationModified = true
    // directly change webpack configuration object
    webpackConfig = webpackModifier(webpackConfig)
  }

  if (pluginHelper) {
    // notify that configuration is changed
    isConfigurationModified = true

    webpackConfig.plugins = webpackConfigModifierHandler(pluginHelper, webpackConfig.plugins, function () {
      return _.keyBy(webpackConfig.plugins, plugin => plugin.constructor.name)
    })
  }

  if (rulesHelper) {
    // notify that configuration is changed
    isConfigurationModified = true

    webpackConfig.module.rules = webpackConfigModifierHandler(rulesHelper, webpackConfig.module.rules, function () {
      const rulesMap = {}
      const files = fs.readdirSync(paths.webpackRules)

      files.forEach(file => {
        const filename = file.replace('.js', '')
        rulesMap[filename] = require(`${paths.webpackRules}/${file}`)
      })

      return rulesMap
    })
  }

  return webpackConfig
}

/**
 * If the bcli.config.js exits, it returns the env configuration
 * merged with the webpack configuration
 * @param  {String} [nodeEnv=process.env.NODE_ENV]
 * @return {Object}
 */
const get = function (nodeEnv = getNodeEnv()) {
  const blueConfig = _.merge({}, blueConfigDefaults, getBlueConfig())
  const webpackConfig = require(`../webpack/env/${nodeEnv}`)

  applyWebpackConfigModifiers(blueConfig, webpackConfig)

  return {
    // Webpack only configurations
    // This object will be directly merged with webpack and it's a very strict
    // comparison. No other parameters are allowed
    webpack: webpackConfig,

    projectName: blueConfig.name,
    versbose: blueConfig.webpackVerboseOutput,
    isConfigurationModified
  }
}

const getPreProcessor = function () {
  const config = getBlueConfig()
  const allowed = ['postcss', 'scss']

  if (config.preProcessor && allowed.indexOf(config.preProcessor) === -1) {
    console.log(chalk.red(`${config.preProcessor} is not a valid pre-processor. Try 'postcss' or 'scss'`))
    process.exit(1)
  }

  return config.preProcessor || 'postcss'
}

module.exports = {
  get,
  getPreProcessor,
  getNodeEnv
}
