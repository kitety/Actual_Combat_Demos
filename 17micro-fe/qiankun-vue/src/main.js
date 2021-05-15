import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Vue.config.productionTip = false

let instance = null;
function render(props) {
  console.log(props);

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app"); // 这里还是自己的html  基座或拿到挂在好的html插入禁区
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
} else {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export async function bootstrap() {}
export async function mount(props) {
  console.log(props);
  render(props);
}
export async function unmount(props) {
  console.log(props);
  instance.$destroy();
}
