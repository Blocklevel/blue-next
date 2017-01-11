const path = require('path')
const fs = require('fs')

const fontDir = path.join(__dirname, '../../font')
const exps = [
  'woff2',
  'woff',
  'ttf',
  'eot'
]

let fonts = []

fs.readdirSync(fontDir).forEach((file) => {
  let fontName = file.replace(/\.[^/.]+$/, '')
  let ext = file.split('.').pop()

  if (exps.indexOf(ext) === -1 || fonts.indexOf(fontName) > -1) {
    return
  }

  fonts.push(fontName)
})

module.exports = fonts.toString()
