import { initState } from "./state";
import { initRender } from "./render";

let uid = 0
export function initMixin (Vue) {
  // 初始化 初始化数据
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.isVue = true;
    vm._uid = uid++;
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      vm.$options = options;
    }
    vm._renderProxy = vm;
    initRender(vm);
    initState(vm);
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
export function initInternalComponent (vm, options) { }
