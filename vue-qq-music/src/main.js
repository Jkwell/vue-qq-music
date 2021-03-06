// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import fastclick from 'fastclick'
import lazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
Vue.config.productionTip = false

fastclick.attach(document.body)
/* eslint-disable */
// import VConsole from 'vconsole'
// var vConsole = new VConsole()
// console.log('test')
// lazy
Vue.use(lazyLoad, {
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
