module.exports = {
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  query: {
    limit: 10000,
    name: 'dist/image/[name].[hash:7].[ext]'
  }
}
