const path = require('path')

module.exports = {
  moduleFileExtensions: [
    'js',
    'vue'
  ],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^store(.*)$': '<rootDir>/src/app/data/store$1',
    '^proxy(.*)$': '<rootDir>/src/app/data/proxy$1',
    '^component(.*)$': '<rootDir>/src/app/component$1',
    '^container(.*)$': '<rootDir>/src/app/container$1',
    '^page(.*)$': '<rootDir>/src/app/page$1',
    '^src(.*)$': '<rootDir>/src$1'
  },
  transform: {
    '^.+\\.js$': path.join(__dirname, 'jest.transform.js'),
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor'
  }
}
