import Vue from 'vue'
// import api from '@/api'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMoment from 'vue-moment';
import Vuelidate from 'vuelidate'

// plugin za validaciju
Vue.use(Vuelidate)
// plugin za datum
Vue.use(VueMoment);

export const bus = new Vue();

Vue.config.productionTip = false

// Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
