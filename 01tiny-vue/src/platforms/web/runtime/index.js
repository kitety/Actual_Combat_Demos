import { h } from "snabbdom";
import Vue from "../../../core/index";
import { patch } from "./patch";
import { mountComponent } from "../../../core/instance/lifescycle";

/**
 * 导入 patch
 */
// 挂载方法
Vue.prototype.$mount = function (el) {
  // const vnode = this.$options.render.call(this, h);
  // return patch(document.querySelector(el), vnode);
  mountComponent(this,el);
};

export default Vue;
