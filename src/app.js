import Vue from 'vue'
import store from './store'
import './app.scss'
import { instance, baseURL } from './utils/fetch'
import Notify from './components/vant/notify/notify'
import Dialog from './components/vant/dialog/dialog'
import Toast from './components/vant/toast/toast'

// Vue.config.productionTip = false
Vue.prototype.$get = (url, data, options) => instance('get', url, data, options)
Vue.prototype.$post = (url, data, options) => instance('post', url, data, options)
Vue.prototype.$baseURL = baseURL
Vue.prototype.$notify = Notify
Vue.prototype.$dialog = Dialog
Vue.prototype.$toast = Toast


Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

const App = new Vue({
  store,
  onShow (options) {
  },
  render (h) {
    return h('block', this.$slots.default)
  }
})

export default App
