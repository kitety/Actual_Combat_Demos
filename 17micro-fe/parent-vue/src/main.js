import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { registerApplication, start } from "single-spa";

Vue.config.productionTip = false;

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
registerApplication(
  "my-vue-app",
  async () => {
    // systemJS
    console.log("jiazaimokuai");
    // 先加载公共的  再加载app
    await loadScript("http://localhost:9999/js/chunk-vendors.js");
    await loadScript("http://localhost:9999/js/app.js");
    return window.singleVue;
  },
  // location /vue 开头的时候
  // 切换到/vue 需要加载
  (location) => location.pathname.startsWith("/vue"),
  { a: 1, b: 2 }
);
start();

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
/**
 * 父应用
 * single spa缺点
 * 不够灵活 不能动态加载js 样式隔离 全局对象 没有js沙箱
 *
 * 沙箱 互不影响 切换的时候丢弃属性和恢复属性
 * 快照沙箱  保存区别 应用区别
 *
 */
