import { ASSET_TYPES } from '../../shared/constants'
import { defineComputed, proxy } from '../instance/state'
export function initExtend (Vue) {
  /**
   * *每个实例构造函数，包括Vue，都有一个惟一的* cid。这使我们能够为原型继承创建包装的“子*构造函数”并缓存它们。
   */
  Vue.cid = 0;
  let cid = 1
  // class 继承
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.container = Sub

    Sub.cid = cid++
    // 合并策略，简单起见，直接用子覆盖父，特别注意：Vue不是这样实现的！！！
    Sub.options = Object.assign({}, Super.options, extendOptions)
    Sub['super'] = Super

    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }
    ASSET_TYPES.forEach(type => {
      Sub[type] = Super[type]
    });
    if (name) {
      Sub.options.components[name] = Sub
    }
    Sub.superOptions = Super.options
    Sub.extendOption = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, '_props', key)
  }
}
function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
