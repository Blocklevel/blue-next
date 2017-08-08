const homedir = require('homedir')
const path = require('path')
const fs = require('fs')

const info = require('../package.json')

const configFilePath = path.resolve(homedir(), '.bluerc')
const projectConfigFilePath = path.resolve(process.cwd(), 'blue.config.js')
const configExists = fs.existsSync(configFilePath)
const isBlue = fs.existsSync(projectConfigFilePath)

if (!configExists) {
  fs.writeFileSync(
    configFilePath, JSON.stringify({ version: info.version }, null, 1)
  )
}

const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
const projecCommandPackage = path.resolve(process.cwd(), './node_modules/blue-commands')
const commands = require(
  path.resolve(isBlue ? projecCommandPackage : config.commands)
)

// boom boom boom!
commands.register(configFilePath)
