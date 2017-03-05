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
    'import/ignore': [
      'node_modules'
    ],
    'import/resolver': 'webpack',
    'import/extensions': ['.js']
  },
  plugins: ['vue'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
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
