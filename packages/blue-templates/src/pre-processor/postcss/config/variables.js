const utils = require('./utils')

const colors = {
  'black': '#000000',
  'red': '#ff0000'
}

const paths = {
  'page': utils.getComposeFile('layout/page.css'),
  'button': utils.getComposeFile('ui/button.css')
}

const sizes = {
  'site-width': '960px'
}

const mediaQueries = require('./mediaQueries')

module.exports = Object.assign({}, colors, paths, sizes, mediaQueries)
