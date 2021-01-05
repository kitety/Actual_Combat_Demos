import effectRunnerMap from './effectRunnerMap'
/**
 * co 原理 自动运行我们的代器
 * @param {*} env
 * @param {*} iterator
 */
export default function proc(env, iterator) {
  function next(args) {
    let result
    result = iterator.next(args)
    //{done:false,value: take()的返回值}
    //{done:false,value: {type:'take',payload:{pattern:'ASYNCADD'}}}
    if (!result.done) {
      runEffect(result.value, next)
    }
  }
  /**
   *
   * @param {*} effect {type:'take',payload:{pattern:'ASYNCADD'}}
   * @param {*} next 下一个中间件或者dispatch
   */
  function runEffect(effect, next) {
    if (effect) {
      // 为了处理不同的effect走不同的执行流程
      const effectRunner = effectRunnerMap[effect.type]
      effectRunner(env, effect.payload, next)
    } else {
      // 执行到最后 effect是undefined
      next()
    }
  }
  next()
}
