const _ = require('lodash')
const fs = require('fs')

/**
 * Checks if the platform is windows
 * @return {Boolean}
 */
const isWindows = function () {
  return !!(process.platform === 'win32')
}

/**
 * Returns an object with the host as value and a display name
 * This is mostly due to windows machines that don't map 0.0.0.0
 * by default
 * see https://github.com/Blocklevel/blue-next/issues/25
 * @param  {String} host
 * @return {Object}
 */
const getHost = function (host) {
  if (host === '0.0.0.0' && isWindows()) {
    return {
      display: 'localhost',
      value: host
    }
  }

  return {
    display: host,
    value: host
  }
}

/**
 * Require a list of files from a folder
 * @param  {String} folder
 * @return {Array<Object>}
 */
const requireFromFolder = function (folder) {
  const files = fs.readdirSync(folder)
  return _.map(files, file => {
    return require(`${folder}/${file}`)
  })
}

/**
 * HMR name replacer
 * The class removes the attached loader string and leaves only the actual file path
 * starting from Blue src folder
 * see https://github.com/webpack/webpack/issues/4452
 */
class HMRModuleName {
  apply(compiler) {
    compiler.plugin("compilation", (compilation) => {
      compilation.plugin("before-module-ids", (modules) => {
        modules.forEach((module) => {
          if(module.id === null && module.libIdent) {
            const name = module.libIdent({
              context: compiler.options.context
            })

            module.id = name.replace(/^\.\/.*!(.+.js)/i, '$1')
          }
        })
      })
    })
  }
}

module.exports = {
  requireFromFolder,
  isWindows,
  getHost,
  NamedModulesPlugin
}
