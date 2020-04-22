import { noop } from "../util/index";
import { observe } from "../observe";
import Watcher from "../observe/watcher";
import Dep from "../observe/dep";


const computedWatcherOptions = { lazy: true }
const sharePropertyDefinition = {
  enumerable: true,
  configurable: true,
  set: noop,
  get: noop,
};

export function proxy (target, sourceKey, key) {
  sharePropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key];
  };
  sharePropertyDefinition.set = function proxyGetter (val) {
    return (this[sourceKey][key] = val);
  };
  Object.defineProperty(target, key, sharePropertyDefinition);
}
export function initState (vm) {
  vm.watchers = [];
  const opts = vm.$options;
  // methods
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  // computed
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  // data
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
function initData (vm) {
  let data = (vm._data = vm.$options.data);
  let keys = Object.keys(data);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    proxy(vm, "_data", key);
  }
  observe(data, true /* asRootData */);
}

function initMethods (vm, methods) {
  for (const key in methods) {
    vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm);
  }
}

function initComputed (vm, computed) {
  // 保存计算watcher
  vm._computedWatcher = Object.create(null)
  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    vm._computedWatcher[key] = new Watcher(vm, getter, computedWatcherOptions)
    defineComputed(vm, key, userDef)
  }
}

function defineComputed (target, key, userDef) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 兼容{}中get 的方式
      const watcher = this._computedWatcher && this._computedWatcher[key]
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate()
        }
        if (Dep.target) {
          watcher.depend()
        }
        return watcher.value
      }
    },
    set: noop
  })
}
function createComputedGetter (key) {
  return function computedGetter () {
  }
}
