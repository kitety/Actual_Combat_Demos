import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import singleSpaVue from "single-spa-vue";

Vue.config.productionTip = false;

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')

/**
 * 需要父应用加载子应用
 * bootstrap mount unmount
 * single-spa single-spa-vue single-spa-react
 */

const appOptions = {
  // 挂在到父亲应用的那个标签上
  el: "#vue",
  router,
  render: (h) => h(App),
};
// 包装后的生命周期
// bootstrap mount unmount
const VueLifeCycle = singleSpaVue({ appOptions, Vue });

/**
 * 如果是父应用引用我 我就有这样一个属性
 */

if (window.singleSpaNavigate) {
  __webpack_public_path__ = "http://localhost:9999/";
} else {
  delete appOptions.el;
  new Vue(appOptions).$mount("#app");
}

// 协议接入
export const bootstrap = VueLifeCycle.bootstrap;
export const mount = VueLifeCycle.mount;
export const unmount = VueLifeCycle.unmount;
/**
 * 父应用加载子应用，将子应用打包成一个个的lib 给父应用使用
 */
