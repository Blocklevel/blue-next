module.exports = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules|build/,
  options: {
    // every blue preset is maintaned directly in the custom blue preset
    // https://github.com/Blocklevel/blue-next/tree/master/packages/babel-preset-blue
    presets: [require.resolve('babel-preset-blue')],
    // no needs to look for a babelrc file in the root folder
    babelrc: false,
    // you might want to disable cacheDirectory during development
    cacheDirectory: true
  }
}
