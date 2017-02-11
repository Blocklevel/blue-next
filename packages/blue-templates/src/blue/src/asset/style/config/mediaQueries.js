const mobileFirst = true

let mediaQueries = {
  'xs': 'max-width: 480px',
  's': 'max-width: 768px',
  'm': 'max-width: 1024px',
  'l': 'min-width: 1025px',
  'xl': 'min-width: 1480px'
}

if (mobileFirst) {
  mediaQueries = {
    'xs': 'min-width: 469px',
    's': 'min-width: 769px',
    'm': 'min-width: 1025px',
    'l': 'min-width: 1201px',
    'xl': 'min-width: 1440px'
  }
}

module.exports = mediaQueries
