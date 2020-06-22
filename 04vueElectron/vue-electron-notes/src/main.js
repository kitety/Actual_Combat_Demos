import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/plugin/element-ui'
import '@/plugin/fortawesome'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
