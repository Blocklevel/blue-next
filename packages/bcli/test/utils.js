const fs = require('fs')
const _ = require('lodash')

/**
 * Returns a mock of the folder structure using mock-fs documentation as reference
 * a folder needs to be an object and a file needs to be a string
 * @param  {String} url
 * @return {Object}
 */
const mockFolder = function (url) {
  const folderStructure = fs.readdirSync(url)
  const mockEmptyFolder = _.map(folderStructure, file => {
    return file.split('.').length > 1 ? '' : {}
  })
  return _.zipObject(folderStructure, mockEmptyFolder)
}

module.exports = {
  mockFolder
}
