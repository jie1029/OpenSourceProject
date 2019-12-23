import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import io from "socket.io-client"
import { store } from './store/store'
import axios from 'axios'

Vue.prototype.$socket = io("https://774e5ee9.ngrok.io");

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.prototype.$http = axios


new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
