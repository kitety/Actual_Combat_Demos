import { h, init } from "snabbdom";
// init 方法用来创建patch函数
// require这些包才能监听事件
const patch = init([
  require("snabbdom/modules/class").default, // 切换class
  require("snabbdom/modules/props").default, //  设置dom属性
  require("snabbdom/modules/style").default, //  styles 支持动画
  require("snabbdom/modules/eventlisteners").default, //  事件监听
]);

function someFn() {
  console.log("got clicked");
}
// 两秒之后重现渲染
// setTimeout(()=>{
// // 数据变更，产出新的vnode
// const nextVnode=
// },2000)

function Vue(options) {
  // debugger;
  this._init(options);
}
// 获取属性
Vue.prototype._s = function (text) {
  return this[text];
};
// 初始化
Vue.prototype._init = function (options) {
  this.$options = options;
  initData(this);
  this.$mount(this.$options.el);
};

// 初始化数据
// 传入实例
function initData(vm) {
  let data = (vm._data = vm.$options.data);
  let keys = Object.keys(data);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    proxy(vm, "_data", key);
  }
}

function noop() {}

const sharePropertyDefinition = {
  enumerable: true,
  configurable: true,
  set: noop,
  get: noop,
};

function proxy(target, sourceKey, key) {
  sharePropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharePropertyDefinition.set = function proxyGetter(val) {
    return (this[sourceKey][key] = val);
  };
  Object.defineProperty(target, key, sharePropertyDefinition);
}

Vue.prototype.$mount = function (el) {
  const vnode = this.$options.render.call(this);
  debugger;
  patch(document.querySelector(el), vnode);
};

var vm = new Vue({
  el: "#app",
  data: {
    title: "prev",
  },
  render() {
    return h("button", { on: { click: someFn } }, this.title);
  },
});
