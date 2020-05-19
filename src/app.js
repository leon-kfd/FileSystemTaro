import Vue from 'vue'
import store from './store'
import './app.scss'
import { instance } from './utils/fetch'
import Notify from './components/vant/notify/notify';
import Dialog from './components/vant/dialog/dialog'

// Vue.config.productionTip = false
Vue.prototype.$get = (url, data, options) => instance('get', url, data, options)
Vue.prototype.$post = (url, data, options) => instance('post', url, data, options)
Vue.prototype.$notify = Notify
Vue.prototype.$dialog = Dialog

const App = new Vue({
  store,
  onShow (options) {
  },
  render (h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
