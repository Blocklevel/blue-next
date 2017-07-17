const path = require('path')

module.exports = {
  moduleFileExtensions: [
    'js',
    'vue'
  ],
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.js$': path.join(__dirname, 'jest.transform.js'),
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor'
  }
}
