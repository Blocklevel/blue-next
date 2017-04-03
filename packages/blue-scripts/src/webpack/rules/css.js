module.exports = {
  test: /\.css$/,
  exclude: [/node_modules/],
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader'
    }
  ]
}
