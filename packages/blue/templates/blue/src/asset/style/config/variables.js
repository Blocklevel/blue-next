const merge = require('webpack-merge')
const fonts = require('./font')

/**
 * Settings
 */
const mobileFirst = false

/**
 * Paths
 */
const paths = {
  'page': '"postcss!style/compose/layout/page.css"',
  'heading': '"postcss!style/compose/type/heading.css"',
  'button': '"postcss!style/compose/ui/button.css"'
}

/**
 * Colors
 */
const colors = {
  'black': '#000'
}

/**
 * Sizes
 */
const sizes = {
  'site-width': '960px'
}

/**
 * Fonts
 */
const fontFace = {
  fonts
}

/**
 * Media queries
 */
let mediaQueries = {
  'xs': 'max-width: 480px',
  's': 'max-width: 768px',
  'm': 'max-width: 1024px',
  'l': 'min-width: 1025px',
  'xl': 'min-width: 1480px'
}

if (mobileFirst) {
  mediaQueries = {
    's': 'min-width: 481px',
    'm': 'min-width: 769px',
    'l': 'min-width: 1025px',
    'xl': 'min-width: 1480px'
  }
}

module.exports = merge(colors, mediaQueries, sizes, fontFace, paths)
