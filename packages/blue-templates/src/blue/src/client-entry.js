import 'babel-polyfill'
import Vue from 'vue'
import VueFire from 'vuefire'

import getTitle from 'lib/get-title'

import createApp from 'core/create-app'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

Vue.use(VueFire)

Vue.mixin({
  ...getTitle,
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options

    if (asyncData) {
      asyncData({ store: this.$store, route: to }).then(next).catch(next)
      return
    }

    next()
  }
})

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    let diff = false
    const activated = matched.filter((component, i) => {
      return diff || (diff = (prevMatched[i] !== component))
    })

    if (!activated.length) {
      return next()
    }

    Promise.all(activated.map(component => {
      if (component.asyncData) {
        return component.asyncData({ store, route: to })
      }
    }))
    .then(next)
    .catch(next)
  })

  app.$mount('#app')
})
