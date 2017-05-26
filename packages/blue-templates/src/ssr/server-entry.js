import 'babel-polyfill'
import createApp from 'core/create-app'

export default function (context) {
  return new Promise(function (resolve, reject) {
    const { app, router, store } = createApp()

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        reject({ code: 404 })
      }

      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      }))
      .then(() => {
        context.state = store.state
        resolve(app)
      })
      .catch(reject)
    }, reject)
  })
}
