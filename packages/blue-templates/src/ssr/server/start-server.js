const fs = require('fs')
const path = require('path')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')

process.on('unhandledRejection', err => {
  throw err
})

const createServer = require('./create-server')
const serverConfig = require('./webpack.server.config')

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const app = express()
const template = fs.readFileSync(resolve('../index.html'), 'utf-8')

const baseDir = serverConfig.output.path

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    baseDir,
    runInNewContext: false
  }))
}

let renderer
let readyPromise

if (isProd) {
  const bundle = require(`../dist/vue-ssr-server-bundle.json`)
  const clientManifest = require(`../dist/vue-ssr-client-manifest.json`)

  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  readyPromise = createServer(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

app.use('/dist', serve('../dist', true))

function render (req, res) {
  const context = {
    title: 'ssr title',
    url: req.url
  }

  renderer.renderToString(context, (error, html) => {
    if (error) {
      /* eslint-disable */
      console.error(`Error during render: ${res.url}`)
      /* eslint-enable */
      res.status(error.code).end(error.message)
      return
    }

    res.end(html)
  })
}

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 8080
app.listen(port, function () {
  /* eslint-disable */
  console.log(`server started at http://localhost:${port}`)
  /* eslint-enable */
})
