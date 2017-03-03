module.exports = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets: [
      'es2015', 'stage-2'
    ],
    plugins: [
      'transform-regenerator'
    ]
  }
}
