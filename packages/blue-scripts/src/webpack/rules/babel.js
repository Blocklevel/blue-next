module.exports = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules|build/,
  options: {
    presets: ['blue'],
    babelrc: false,
    cacheDirectory: true
  }
}
