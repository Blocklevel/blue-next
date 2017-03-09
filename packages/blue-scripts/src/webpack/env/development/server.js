module.exports = {
  port: 8080,
  host: '0.0.0.0',
  compress: true,
  quiet: true,
  hot: true,
  inline: false,
  clientLogLevel: 'info',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  historyApiFallback: true,
  publicPath: '/',
  stats: {
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    noInfo: true,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: false,
    errorDetails: false,
    warnings: false,
    publicPath: false,
    colors: true,
    module: false
  }
}
