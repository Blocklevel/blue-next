'use strict'
const paths = require('../commons/paths')

module.exports = {
  root: paths.appSrc,
  extensions: ['', '.js', '.vue', '.css'],
  alias: {
    // Vue is installed in the project itself because it can't be coupled with the cli
    vue: 'vue/dist/vue.js',
    component: `${paths.appRoot}/component`,
    store: `${paths.appRoot}/store/modules`,
    page: `${paths.appRoot}/page`
  },
  modules: [
    paths.appDirectory,
    paths.appNodeModules,
    paths.cliNodeModules
  ]
}
