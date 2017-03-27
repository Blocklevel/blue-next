const env = process.env.NODE_ENV

/**
 * Applies severity based on the NODE_ENV value
 * @param  {Number} [severity=1] eslint severity index
 * @return {Number}
 */
const applyDevSeverity = function (severity = 1) {
  return env === 'development' ? 0 : severity
}

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
  plugins: ['vue', 'flowtype'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  rules: {
    // console.log and debugger are used in development so the level of
    // severity is 0, but on build goes to 1 because the final product
    // shouldn't have any console statements.
    'no-console': applyDevSeverity(),
    'no-debugger': applyDevSeverity(),

    'no-unused-vars': 1,
    'no-use-before-define': 1,
    'max-len': [2, { 'code': 130, 'ignoreUrls': true }],
    'vue/jsx-uses-vars': 2
  }
}
