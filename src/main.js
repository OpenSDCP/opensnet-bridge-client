// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import vMediaQuery from 'v-media-query'
import VueGridLayout from 'vue-grid-layout'

Vue.use(Vuetify)
Vue.use(vMediaQuery)
Vue.use(VueGridLayout)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
