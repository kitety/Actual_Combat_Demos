
import proc from './proc'
export function runSaga({ channel, dispatch, getState }, saga) {
  // 执行生成器，返回迭代器
  let iterator = saga()
  const env = { channel, dispatch, getState }
  // 真正执行迭代器的方法
  proc(env, iterator)
}
