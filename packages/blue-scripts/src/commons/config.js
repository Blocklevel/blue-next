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
  // notify that configuration is changed
  isConfigurationModified = true

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
function applyModifiers (config, webpack, nodeEnv = getNodeEnv()) {
  const envConfig = config[nodeEnv] || {}
  const pluginModifier = envConfig.modifier && envConfig.modifier.plugins
  const rulesModifier = envConfig.modifier && envConfig.modifier.rules
  const webpackConfigModifier = envConfig.webpackConfig

  // directly change webpack configuration object
  if (webpackConfigModifier) {
    webpack = webpackConfigModifier(webpack)
  }

  if (pluginModifier) {
    webpack.plugins = webpackConfigModifierHandler(pluginModifier, webpack.plugins, function () {
      return _.keyBy(webpack.plugins, plugin => plugin.constructor.name)
    })
  }

  if (rulesModifier) {
    webpack.module.rules = webpackConfigModifierHandler(rulesModifier, webpack.module.rules, function () {
      const rulesMap = {}

      fs.readdirSync(paths.webpackRules).forEach(file => {
        const key = file.replace('.js', '')
        rulesMap[key] = require(`${paths.webpackRules}/${file}`)
      })

      return rulesMap
    })
  }

  return webpack
}

/**
 * If the bcli.config.js exits, it returns the env configuration
 * merged with the webpack configuration
 * @param  {String} [nodeEnv=process.env.NODE_ENV]
 * @return {Object}
 */
const get = function (nodeEnv = getNodeEnv()) {
  const projectConfig = _.merge({}, blueConfigDefaults, getBlueConfig())
  const webpackConfig = require(`../webpack/env/${nodeEnv}`)

  // apply magic stuff
  applyModifiers(projectConfig, webpackConfig)

  return {
    // Webpack only configurations
    // This object will be directly merged with webpack and it's a very strict
    // comparison. No other parameters are allowed
    webpack: webpackConfig,

    projectName: projectConfig.name,
    isConfigurationModified,
    versbose: projectConfig.webpackVerboseOutput
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
