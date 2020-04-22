import { h } from "snabbdom";
import Vue from "../../../core/index";
import { patch } from "./patch";

/**
 * 导入 patch
 */
Vue.prototype.$mount = function (el) {
  const vnode = this.$options.render.call(this, h);
  return patch(document.querySelector(el), vnode);
};

export default Vue;
