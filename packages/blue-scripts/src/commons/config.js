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
const getBlueConfig = function () {
  try {
    return require(paths.appConfig)
  } catch (error) {
    console.log(chalk.red(messages.NO_BLUE_CONFIG_FOUND))
    process.exit(1)
  }
}

/**
 * Applies the modifiers for each proxy
 * @param  {Function} proxy
 * @param  {Array} data
 * @param  {Function} modifier
 * @return {Array}
 */
function webpackConfigModifierHandler (proxy, data, modifier) {
  // notify that configuration is changed
  isConfigurationModified = true

  const toArray = _.values
  const dataFromProxy = proxy({ map: modifier(), array: data }, toArray)

  return dataFromProxy.length ? dataFromProxy : toArray(dataFromProxy)
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

  if (pluginProxy) {
    webpack.plugins = webpackConfigModifierHandler(pluginProxy, webpack.plugins, function () {
      return _.keyBy(webpack.plugins, plugin => plugin.constructor.name)
    })
  }

  if (rulesProxy) {
    webpack.module.rules = webpackConfigModifierHandler(rulesProxy, webpack.module.rules, function () {
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
const get = function (nodeEnv = process.env.NODE_ENV) {
  const projectConfig = _.assignIn({}, {
    // create a mock of modifiers for the specific environment
    [nodeEnv]: modifiers
  }, getBlueConfig())

  const envConfig = require(`../webpack/env/${nodeEnv}`)
  const projectConfigWebpack = projectConfig.webpack || {}

  let webpackConfig = envConfig

  if (!_.isEmpty(projectConfigWebpack)) {
    webpackConfig = merge.smart({}, envConfig, projectConfigWebpack)
  }

  // some magic here!
  applyBlueProxyModifiers(projectConfig, webpackConfig)

  return {
    // Webpack only configurations
    // This object will be directly merged with webpack and it's a very strict
    // comparison. No other parameters are allowed
    webpack: webpackConfig,

    project: projectConfig.project,
    isConfigurationModified,
    versbose: projectConfig.webpackVerboseOutput
  }
}

const getPreProcessor = function () {
  const config = getBlueConfig()
  const project = config.project
  const hasValue = !!(project.css && project.css.preProcessor)

  return hasValue ? project.css.preProcessor : 'postcss'
}

module.exports = {
  get,
  getPreProcessor
}
