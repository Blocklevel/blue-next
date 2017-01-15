module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: 'standard',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true,
    module: true
  },
  settings: {
    'import/resolver': 'webpack',
  },
  plugins: ['vue'],
  env: {
    browser: true
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 1,
    'no-debugger': 1,
    'no-use-before-define': 1,
    'max-len': [2, { 'code': 100, 'ignoreUrls': true }],
    'vue/jsx-uses-vars': 2
  }
}
