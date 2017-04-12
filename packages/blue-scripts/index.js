function getConfig () {
  return require('./commons/config').get().webpack
}

module.exports = {
  getConfig
}
