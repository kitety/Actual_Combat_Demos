// store createStore reducer action
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import createSageMiddleWare from '../redux-saga'
import { rootSaga } from './saga'
// saga是一个generator

let sageMiddleWare = createSageMiddleWare()
// let store = createStore(reducer)
let store = applyMiddleware(sageMiddleWare)(createStore)(reducer)
// 负责执行saga  遇到yield停止
sageMiddleWare.run(rootSaga)
// getState subscribe状态变更订阅 dispatch
export default store
