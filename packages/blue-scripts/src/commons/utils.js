const _ = require('lodash')
const fs = require('fs')

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

module.exports = {
  requireFromFolder
}
