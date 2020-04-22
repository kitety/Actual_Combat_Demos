import { noop } from "../util/index";
import { observe } from "../observe";

const sharePropertyDefinition = {
  enumerable: true,
  configurable: true,
  set: noop,
  get: noop,
};

export function proxy(target, sourceKey, key) {
  sharePropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharePropertyDefinition.set = function proxyGetter(val) {
    return (this[sourceKey][key] = val);
  };
  Object.defineProperty(target, key, sharePropertyDefinition);
}
export function initState(vm) {
  vm.watchers = [];
  const opts = vm.$options;
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
}
/**
 * 把data代理到——data
 * @param {} vm
 */
function initData(vm) {
  let data = (vm._data = vm.$options.data);
  let keys = Object.keys(data);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    proxy(vm, "_data", key);
  }
  observe(data, true /* asRootData */);
}

function initMethods(vm, methods) {
  for (const key in methods) {
    vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm);
  }
}
