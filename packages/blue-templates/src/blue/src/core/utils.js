import _ from 'lodash'

/**
 * Returns a resolved page component instance
 * @param  {String}  path
 * @param  {Boolean} [root=true]
 * @return {Component}
 */
export function pageLoader (path, root = true) {
  const name = root ? `${path}/${path}` : path
  return resolve => require([`page/${name}.vue`], resolve)
}

/**
 * Returns an object map of all json files in the /asset/lang folder
 * @return {Object}
 */
export function getTranslations () {
  const context = require.context('../asset/lang', true, /\.json$/)

  return _.reduce(context.keys(), (translations, language) => {
    const name = language.split('.')[1].replace('/', '')
    return { ...translations, [name]: context(language) }
  }, {})
}
