const jest = require('jest')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

jest.runCLI({
  // sometimes we need to clear the cache so we can pass a --no-cache options
  // when we run the command
  cache: typeof argv.cache === 'undefined' ? true : argv.cache,
  config: require('blue-jest')
}, [
  process.cwd()
])
