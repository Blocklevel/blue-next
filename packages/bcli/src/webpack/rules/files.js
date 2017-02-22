module.exports = {
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
  loader: 'file-loader',
  options: {
    name: 'static/[name].[ext]'
  }
}
