const CLIEngine = require("eslint").CLIEngine
const config = require('eslint-config-blue')

const cli = new CLIEngine(config)
const report = cli.executeOnFiles([`${process.cwd()}/src/**/*.js`])
const formatter = cli.getFormatter()
const hasErrors = (report.errorCount > 0)

console.log(formatter(report.results))

process.exit(hasErrors ? 1 : 0)
