const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')

const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) {}
}

module.exports = function createDevServer (app, callback) {
  let bundle, clientManifest
  let resolve
  /* eslint-disable */
  const readyPromise = new Promise(r => { resolve = r })
  /* eslint-enable */
  const ready = (...args) => {
    resolve()
    callback(...args)
  }

  clientConfig.entry.app.unshift('webpack-hot-middleware/client')
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })

  app.use(devMiddleware)

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()

    /* eslint-disable */
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    /* eslint-enable */

    if (stats.errors.length) {
      return
    }

    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      '../dist/vue-ssr-client-manifest.json'
    ))

    if (bundle) {
      ready(bundle, {
        clientManifest
      })
    }
  })

  app.use(require('webpack-hot-middleware')(clientCompiler))

  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()

  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err
    }

    stats = stats.toJson()

    if (stats.errors.length) {
      return
    }

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))

    if (clientManifest) {
      ready(bundle, {
        clientManifest
      })
    }
  })

  return readyPromise
}
