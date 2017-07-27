const jest = require('jest')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

delete argv._

jest.runCLI(Object.assign(argv, {
  config: require('blue-jest')
}), [ process.cwd() ])
