module.exports = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules|build/,
  options: {
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-2')
    ],
    plugins: [
      require.resolve('babel-plugin-transform-regenerator')
    ]
  }
}
