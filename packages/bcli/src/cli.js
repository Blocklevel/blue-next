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

// we need to check if it's a blue project or if the blue-commands exists or both, because if it
// doesn't exist but it's a blue project it means that it's an old template without blue-commands
// and we need to install it manually for compatibility

// we need to install blue-commands if there's no project or it's symlinked

const commands = require(
  path.resolve(isBlue ? projecCommandPackage : config.commands)
)

// boom boom boom!
commands.register(configFilePath)
