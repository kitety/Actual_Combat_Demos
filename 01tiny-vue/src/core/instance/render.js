import { h } from "snabbdom";
let cacheComp = {}

export function initRender (vm) {
  vm._c = (tag, options) => {
    var Ctor = vm.constructor.options['components'][tag]
    var sub
    // 缓存组件，避免已经初始化的组件被重新初始化
    if (cacheComp[tag]) {
      sub = cacheComp[tag]
    } else {
      sub = cacheComp[tag] = new Ctor(Ctor.options)
    }
    return Ctor.options.render.call(sub, h)
  }
}
function createComponent (Ctor) {

}
export function renderMixin (Vue) {
  Vue.prototype._render = function () {
    const vm = this
    const { render, _parentNode } = vm.$options
    vm.$vnode = _parentNode
    let vnode
    vnode = render.call(vm, h)
    vnode.parent = _parentNode
    return vnode
  }
}
