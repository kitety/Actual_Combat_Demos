// 指令对象
import * as effectTypes from './effectTypes'

// 纯对象
const makeEffect = (type, payload) => {
  return { type, payload }
}
/**
 *
 * @param {*} pattern 动作类型
 */
export function take(pattern) {
  //  return { type:'TAKE', payload:{pattern:'ASYNCADD'} }
  return makeEffect(effectTypes.TAKE, { pattern })
}
export function put(action) {
  //  return { type:'PUT', action:{pattern:'ADD'} }
  return makeEffect(effectTypes.PUT, { action })
}
