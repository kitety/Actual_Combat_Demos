import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.isVue = true;
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      vm.$options = options;
    }
    vm._renderProxy = vm;
    initState(vm);
    vm.$mount(vm.$options.el);
  };
}
export function initInternalComponent(vm, options) {}
