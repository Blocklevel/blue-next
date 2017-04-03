const path = require('path')
const variables = path.resolve(__dirname, './config/variables.js')

module.exports = require('postcss-blue-plugins')(variables)
