// @remove-file-on-eject
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const _ = require('lodash')
const paths = require('../config/paths')
const blueScriptPackage = require('../package.json')
const projectPackage = require(paths.appPackageJSON)
const ownPath = path.resolve(__dirname, '..')
const dir = `${paths.appDirectory}/config`
const folders = [
  'commons', 'scripts', 'webpack', 'webpack/rules', 'webpack/style',
  'webpack/env', 'webpack/env/development', 'webpack/env/production'
]

// flatten the package folder structure
const files = folders.reduce((files, folder) => {
  return files.concat(
    fs
      .readdirSync(path.join(ownPath, folder))
      .map(file => path.join(ownPath, folder, file))
      .filter(file => fs.lstatSync(file).isFile())
  )
}, [])

fs.mkdirSync(dir)

folders.forEach(folder => {
  fs.mkdirSync(path.join(dir, folder))
})

files.forEach(file => {
  let content = fs.readFileSync(path.resolve(__dirname, file), 'utf8')

  // skip flagged file
  if (content.match(/\/\/ @remove-file-on-eject/)) {
    return
  }

  content = content
    // remove dead code
    .replace(/\/\/ @remove-on-eject-begin([\s\S]*?)\/\/ @remove-on-eject-end/mg, '')
    .trim()

  fs.writeFileSync(file.replace(ownPath, dir), content)
})

// create new package.json scripts that point on the new config fodler
projectPackage.scripts = { dev: 'node config/scripts/start.js', build: 'node config/scripts/build.js' }
// remove blue-scripts, now all dependencies are added to the project itself
delete projectPackage.dependencies['blue-scripts']
// add all blue-scripts dependencies to the devDependencies of the project
projectPackage.dependencies = _.merge({}, blueScriptPackage.dependencies, projectPackage.dependencies)

fs.writeFileSync(paths.appPackageJSON, JSON.stringify(projectPackage, null, '\t'))

console.log('')
console.log('   Ejected successfully!')
console.log('   Good luck!')
console.log('')
