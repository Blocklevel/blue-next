const CLIEngine = require("eslint").CLIEngine
const config = require('eslint-config-blue')

const cli = new CLIEngine(config)
const report = cli.executeOnFiles([`${process.cwd()}/src/**/*.js`])
const formatter = cli.getFormatter()

console.log(formatter(report.results))
