import { h } from "snabbdom";
import { noop } from "../util/index";
import Watcher from "../observe/watcher";
import { patch } from "../../platforms/web/runtime/patch";

export function mountComponent (vm, el) {
  vm.$el = el
  let updateComponent = () => {
    // 渲染
    // const vnode = vm.$options.render.call(vm, h);
    // if (vm._vnode) {
    //   patch(vm._vnode, vnode);
    // } else {
    //   patch(document.querySelector(el), vnode);
    // }
    // vm._vnode = vnode;
    const vnode = vm._render()
    vm.update(vnode)
  };
  new Watcher(vm, updateComponent, noop);
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    if (vm._vnode) {
      patch(vm._vnode, vnode)
    } else {
      patch(document.querySelector(vm.$el), vnode)
    }
    vm._vnode = vnode
  }
}
