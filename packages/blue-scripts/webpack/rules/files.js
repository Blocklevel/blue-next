const paths = require('../../commons/paths')

module.exports = {
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
  loader: 'file-loader',
  options: {
    limit: 1,
    name: `${paths.appBuildHash}/asset/[name].[ext]`
  }
}
