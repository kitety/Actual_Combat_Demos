import { stdChannel } from './channel'
import { runSaga } from './runSaga'
// 中间件 其实是对store dispatch的增强
// 调用返回中间件
function sagaMiddlewareFactory() {
  const channel = stdChannel()
  let boundRunSaga;// 开始执行saga
  // store 中间件基本架构
  function sagaMiddleware({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, { channel, dispatch, getState })
    return function (next) { // 调用下一个中间件 如果只有一个中间件 那么就指向store.dispatch
      // 返回的函数接受action
      return function (action) { // 下一个action
        let result = next(action)
        // 对老的dispatch增强。以后调用dispatch都会调用channel put方法
        channel.put(action)
        return result
      }
    }
  }
  sagaMiddleware.run = (rootSaga) => {
    boundRunSaga(rootSaga)
  }
  return sagaMiddleware
}
export default sagaMiddlewareFactory;
/**
 function sagaMiddleware({getState,dispatch}) {
return function(next){
  // next 调用下一个中间件
    // 返回的函数接受action
      return function (action) { // 下一个action
        let result = store.originDispatch(action)
        return result
      }
  }
 */
