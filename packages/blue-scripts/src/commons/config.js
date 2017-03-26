const messages = require('./messages')
const paths = require('./paths')
const merge = require('webpack-merge')
const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs')

let isConfigurationModified = false

const modifiers = {
  proxy: {
    rules: null,
    plugins: null
  }
}

/**
 * Detects the bcli.config.js file
 * It returns the file content if detected, otherwise returns false
 * @return {Object|Boolean}
 */
const exists = function () {
  try {
    return !!require(paths.appConfig)
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * Applies the modifiers for each proxy
 * @param  {[type]} proxy
 * @param  {[type]} data
 * @param  {[type]} modifier
 * @return [type]
 */
function webpackConfigModifierHandler (proxy, data, modifier) {
  if (!data || !data.length) {
    return data
  }

  isConfigurationModified = true

  const toArray = _.values
  const dataFromProxy = proxy({ map: modifier(), array: data }, toArray)

  return dataFromProxy.length ? dataFromProxy : toArray(dataFromProxy)
}

/**
 * Returns plugins proxy changes
 * @param  {Function} proxy
 * @param  {Array} rules
 * @return {Array}
 */
function webpackPluginsProxyHandler (proxy, plugins) {
  return webpackConfigModifierHandler(proxy, plugins, function () {
    return _.keyBy(plugins, plugin => plugin.constructor.name)
  })
}

/**
 * Returns module rules proxy changes
 * @param  {Function} proxy
 * @param  {Array} rules
 * @return {Array}
 */
function webpackRulesProxyHandler (proxy, rules) {
  return webpackConfigModifierHandler(proxy, rules, function () {
    const rulesMap = {}

    fs.readdirSync(paths.webpackRules).forEach(file => {
      const key = file.replace('.js', '')
      rulesMap[key] = require(`${paths.webpackRules}/${file}`)
    })

    return rulesMap
  })
}

/**
 * Modifies the webpack configuration
 * @param  {Object} config
 * @param  {Object} webpack
 * @param  {String} [nodeEnv=process.env.NODE_ENV]
 * @return {Object}
 */
function applyBlueProxyModifiers (config, webpack, nodeEnv = process.env.NODE_ENV) {
  const pluginProxy = config[nodeEnv].proxy.plugins
  const rulesProxy = config[nodeEnv].proxy.rules

  if (pluginProxy && webpack.plugins) {
    webpack.plugins = webpackPluginsProxyHandler(
      pluginProxy,
      webpack.plugins
    )
  }

  if (rulesProxy && webpack.module) {
    webpack.module.rules = webpackRulesProxyHandler(
      rulesProxy,
      webpack.module.rules
    )
  }

  return webpack
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

  const blueConfig = _.assignIn({}, {
    // create a mock of modifiers for the specific environment
    [nodeEnv]: modifiers
  }, require(paths.appConfig))

  const envConfig = require(`../webpack/env/${nodeEnv}`)
  const blueConfigWebpack = blueConfig.webpack || {}

  let webpackConfig = envConfig

  if (!_.isEmpty(blueConfigWebpack)) {
    webpackConfig = merge.smart({}, envConfig, blueConfigWebpack)
  }

  // some magic here!
  applyBlueProxyModifiers(blueConfig, webpackConfig)

  return {
    // Webpack only configurations
    // This object will be directly merged with webpack and it's a very strict
    // comparison. No other parameters are allowed
    webpack: webpackConfig,

    project: blueConfig.project,
    isConfigurationModified,
    versbose: blueConfig.webpackVerboseOutput
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
