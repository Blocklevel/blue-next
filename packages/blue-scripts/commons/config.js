const paths = require('./paths')
const webpackMerge = require('webpack-merge')
const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs')

let isConfigurationModified = false

const blueConfigDefaults = {
  name: 'my-project'
}

/**
 * Returns bcli.config.js content
 * @return {Object}
 */
const getBlueConfig = function () {
  return fs.existsSync(paths.appConfig) ? require(paths.appConfig) : {}
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
  const envPluginsHelper = _.get(envConfig, 'webpackHelper.plugins')
  const envRulesHelper = _.get(envConfig, 'webpackHelper.rules')
  const rulesHelper = _.get(config, 'webpackHelper.rules')
  const pluginsHelper = _.get(config, 'webpackHelper.plugins')
  const envWenpackModifier = envConfig.webpack
  const webpackModifier = config.webpack

  _.compact([pluginsHelper, envPluginsHelper]).forEach(helper => {
    isConfigurationModified = true

    webpackConfig.plugins = webpackConfigModifierHandler(
      helper,
      webpackConfig.plugins,
      // generates a constructor name based map
      () => _.keyBy(webpackConfig.plugins, plugin => plugin.constructor.name)
    )
  })

  _.compact([rulesHelper, envRulesHelper]).forEach(helper => {
    isConfigurationModified = true

    webpackConfig.module.rules = webpackConfigModifierHandler(
      helper,
      webpackConfig.module.rules,
      function () {
        // TODO find a better way to map it
        const rulesMap = {}
        const files = fs.readdirSync(paths.webpackRules)

        files.forEach(file => {
          const filename = file.replace('.js', '')
          rulesMap[filename] = require(`${paths.webpackRules}/${file}`)
        })

        return rulesMap
      }
    )
  })

  _.compact([webpackModifier, envWenpackModifier]).forEach(helper => {
    // notify that configuration is changed
    isConfigurationModified = true
    // directly change webpack configuration object
    webpackConfig = webpackMerge.smart(helper(webpackConfig), webpackConfig)
  })

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
    // share the name of the project
    projectName: blueConfig.name,
    // verbose output during compilation
    versbose: blueConfig.webpackVerboseOutput,
    // nofity if webpack configuration has been changed
    // in the blue.config.js file
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
