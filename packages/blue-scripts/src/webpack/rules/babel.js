module.exports = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules|build/,
  options: {
    presets: [require.resolve('babel-preset-blue')],
    babelrc: false,
    cacheDirectory: true
  }
}
