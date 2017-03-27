const babel = {
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    plugins: [require.resolve('babel-plugin-transform-flow-comments')]
  }
}

module.exports = [babel]
