module.exports = {
  presets: [
    [require.resolve('babel-preset-env'), {
      'targets': {
        'browsers': ['last 3 iOS versions', 'last 3 versions', 'ie >= 9'],
        'uglify': true,
      },
      'modules': false,
      'useBuiltIns': true
    }],
    require.resolve('babel-preset-stage-2')
  ],
  plugins: [
    require.resolve('babel-plugin-transform-regenerator')
  ]
}
