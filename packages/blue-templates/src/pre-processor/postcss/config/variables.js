const utils = require('./utils')
const fontList = require('./font')

const colors = {
  'black': '#000',
  'white': '#fff'
}

const paths = {
  'common': utils.getComposeFile('common.css'),
  'page': utils.getComposeFile('layout/page.css'),
  'grid': utils.getComposeFile('layout/grid.css'),
  'visibility': utils.getComposeFile('layout/visibility.css'),
  'button': utils.getComposeFile('ui/button.css'),
  'list': utils.getComposeFile('ui/list.css'),
  'icon': utils.getComposeFile('ui/icon.css'),
  'typography': utils.getComposeFile('type/typography.css'),
  'heading': utils.getComposeFile('type/heading.css'),
  'type': utils.getComposeFile('type/type.css')
}

const sizes = {
  'site-width': '960px'
}

const fonts = {
  fonts: fontList
}

const mediaQueries = require('./media-queries')

module.exports = Object.assign({}, colors, paths, sizes, mediaQueries, fonts)
