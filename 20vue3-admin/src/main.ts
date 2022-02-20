import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import store from "./store";
import router from "./route";
import "element-plus/dist/index.css";
// 初始化css 重置css默认样式
import "normalize.css/normalize.css";
// 全局 css
import "@/styles/index.scss";

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount("#app");
