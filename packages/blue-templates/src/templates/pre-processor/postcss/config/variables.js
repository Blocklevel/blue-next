const utils = require('./utils')
const fontList = require('./font')

const colors = {
  'black': '#000',
  'white': '#fff'
}

const sizes = {
  'site-width': '960px'
}

const paths = {
  'layout': utils.getComposeFile('layout.css'),
  'ui': utils.getComposeFile('ui.css'),
  'form': utils.getComposeFile('form.css'),
  'typography': utils.getComposeFile('typography.css')
}

const fonts = {
  fonts: fontList
}

const mediaQueries = require('./media-queries')

module.exports = Object.assign({}, colors, paths, sizes, mediaQueries, fonts)
