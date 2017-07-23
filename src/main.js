
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import router from './router'

let vue = new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

export default vue
