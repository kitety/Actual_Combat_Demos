import * as actionTypes from './action-types'
import { put, take } from '../redux-saga/effect'

export function* rootSaga() {
  for (let i = 0; i < 3; i++) {
    console.log(`等待${actionTypes.ASYNCADD}动作`);
    // 在这里卡主，我要等人向我发一个ASYNCADD的动作指令，我才会接着往后走
    const action = yield take(actionTypes.ASYNCADD)
    console.log('等到了: ', action);
    yield put({ type: actionTypes.ADD })// store.dispatch

    console.log('继续向下执行');
  }
  console.log('for结束');
}
/**
 * saga 三种generator =sage
 * 1.根saga 他是入口 大门
 * 2.watcher sage 监听者  服务员
 * 3.worker saga 工作者 大厨
 * effects 指令对象，告诉监听saga做啥工作  菜谱
 * take 接受，put 真正发送
 */
