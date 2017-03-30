const fs = require('fs')
const chalk = require('chalk')
const paths = require('./commons/paths')
const copy = require('graceful-copy')
const path = require('path')
const _ = require('lodash')
const execa = require('execa')
const del = require('del')

const blueScriptPackage = require('../package.json')
const projectPackage = require(paths.appPackageJSON)
const blueScriptSrcPath = path.resolve(__dirname, '../src')
const dir = `${paths.appDirectory}/config`

copy(blueScriptSrcPath, dir)
  .then(() => {
    // assign new scripts that point on the new config fodler
    projectPackage.scripts = { dev: 'node config/start.js', build: 'node config/build.js' }
    // no needs to move folders anymore!
    delete blueScriptPackage.dependencies['graceful-copy']
    // now all dependencies are added to the project itself
    delete projectPackage.devDependencies['blue-scripts']
    // add all blue-scripts dependencies to the devDependencies of the project
    projectPackage.devDependencies = _.merge({}, blueScriptPackage.dependencies, projectPackage.devDependencies)
    // stringify and apply indentetion to the new package.json file
    const newPackage = JSON.stringify(projectPackage, null, '\t')
    // remove blue-scripts from the project node_modules folder
    del.sync([paths.blueScripts])
    // write the new json file and boom boom boom!
    fs.writeFileSync(paths.appPackageJSON, newPackage)

    console.log('')
    console.log('   Ejected successfully!')
    console.log('')
  })
  .catch(error => {
    console.log(chalk.red(error.message))
    process.exit(1)
})
