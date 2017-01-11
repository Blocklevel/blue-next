/**
 * Routes
 */
import Home from './page/home/home.vue'
import { routeParser } from 'vue-i18n-manager'

export default routeParser([
  {
    name: 'home',
    path: '/',
    component: Home
  }
])
