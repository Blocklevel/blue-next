'use strict'
const webpack = require('webpack')
const co = require('co')
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora()
const blueConfig = require('./commons/config')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const paths = require('./commons/paths')

module.exports = co.wrap(function * (options) {
  const config = blueConfig.get()

  console.log('') // extra space
  spinner.text = `Building ${chalk.bold.yellow(config.project.title)} project`
  spinner.start()

  // FaviconsWebpackPlugin needs to be added at the end so we can overwrite
  // options with blue.config.js file
  config.webpack.plugins.push(
    new FaviconsWebpackPlugin({
      logo: `${paths.appStatic}/image/favicon.png`,
      prefix: `static/favicon/`,
      emitStats: true,
      statsFilename: 'iconstats.json',
      persistentCache: false,
      inject: true,
      background: '#fff',
      title: config.project.title,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true
      }
    })
  )

  webpack(config.webpack, function (error, stats) {
    if (error) {
      spinner.fail()
      console.log('')
      console.log(chalk.red(error))
      console.log('')
      process.exit(1)
    }

    spinner.succeed()
    console.log('')

    process.stdout.write(stats.toString({
      colors: true,
      modules: true,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
})
