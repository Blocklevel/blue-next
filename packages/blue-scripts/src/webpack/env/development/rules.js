const babel = require('../../rules/babel')

babel.options.plugins = [require.resolve('babel-plugin-transform-flow-strip-types')]

module.exports = [babel]
