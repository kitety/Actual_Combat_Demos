import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { registerMicroApps, start } from "qiankun";

const apps = [
  {
    name: "vueApp",
    entry: "//localhost:10001", //默认加载这个html 解析js 动态执行  子应用支持跨越 fetch，
    container: "#vue",
    activeRule: "/vue",
  },
  {
    name: "reactApp",
    entry: "//localhost:20000", //默认加载这个html 解析js 动态执行  子应用支持跨越 fetch，
    container: "#react",
    activeRule: "/react",
  },
];
registerMicroApps(apps);
start();

Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
