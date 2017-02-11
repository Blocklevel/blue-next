module.exports = {
  test: /\.js$/,
  enforce: 'pre',
  loader: 'eslint-loader',
  exclude: /node_modules/,
  options: {
    configFile: require.resolve('eslint-config-blocklevel')
  }
}
