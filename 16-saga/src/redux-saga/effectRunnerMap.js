// map 映射
import * as effectTypes from './effectTypes'

function runTakeEffect(env, payload, next) {
  // 订阅
  const matcher = action => action.type === payload.pattern//ASYNCADD
  env.channel.take(next, matcher)
}

function runPutEffect(env, payload, next) {
  // dispatch  经过中间件改造的dispatch
  env.dispatch(payload.action);
  next()
}

const effectRunnerMap = {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.PUT]: runPutEffect
}
export default effectRunnerMap;
