import { routeParser } from 'vue-i18n-manager'

/**
 * Pages
 */
const home = resolve => require(['./page/home/home.vue'], resolve)

export default routeParser([
  {
    name: 'home',
    path: '/',
    component: home
  }
])
