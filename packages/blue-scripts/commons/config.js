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
 * Returns all helpers from the configuration object
 * @param  {Object} config
 * @param  {String} type
 * @param  {String} [nodeEnv=getNodeEnv()]
 * @return {Object}
 */
function getHelpers (config, type, nodeEnv = getNodeEnv()) {
  const envConfig = config[nodeEnv] || {}
  // get helpers for each environment
  const helpers = [config, envConfig].map(currConfig => _.get(currConfig, type))
  // remove undefined values
  return _.compact(helpers)
}

/**
 * Modifies the webpack configuration
 * @param  {Object} config
 * @param  {Object} webpack
 * @return {Object}
 */
function applyWebpackConfigModifiers (config, webpackConfig) {
  const webpackHelpers = getHelpers(config, 'webpack')
  const plugins = getHelpers(config, 'webpackHelper.plugins')
  const rules = getHelpers(config, 'webpackHelper.rules')

  // notify if webpack changed via blue.config.js
  isConfigurationModified = [].concat(plugins, rules, webpackHelpers).length > 0

  plugins.forEach(helper => {
    // generates a constructor name based map
    webpackConfig.plugins = webpackConfigModifierHandler(helper, webpackConfig.plugins, function () {
      return  _.keyBy(webpackConfig.plugins, plugin => plugin.constructor.name)
    })
  })

  rules.forEach(helper => {
    // generates a file name based map
    webpackConfig.module.rules = webpackConfigModifierHandler(helper, webpackConfig.module.rules, function () {
      return fs.readdirSync(paths.webpackRules).reduce((prop, filename) => {
        const name = filename.replace('.js', '')
        return _.assignIn(prop, {
          [name]: require(`${paths.webpackRules}/${filename}`)
        })
      }, {})
    })
  })

  webpackHelpers.forEach(helper => {
    // directly change webpack configuration object
    webpackMerge.smart(helper(webpackConfig), webpackConfig)
  })
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
