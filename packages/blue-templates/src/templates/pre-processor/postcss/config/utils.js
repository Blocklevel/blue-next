/**
 * Returns the path to the file used to compose classes
 * @param  {String} file
 * @return {String}
 */
const getComposeFile = function (file) {
  return JSON.stringify(`postcss-loader!src/asset/style/compose/${file}`)
}

module.exports = {
  getComposeFile
}
