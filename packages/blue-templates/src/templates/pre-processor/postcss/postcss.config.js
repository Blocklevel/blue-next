const variables = require('./config/variables.js')

module.exports = {
  plugins: require('postcss-blue-plugins')(variables)
}
