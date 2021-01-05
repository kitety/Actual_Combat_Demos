
// 发布订阅
export function stdChannel() {
  let currentTakers = []
  // 订阅
  /**
   *
   * @param {*} cb cb函数
   * @param {*} matcher 匹配器
   */
  function take(cb, matcher) {
    // 添加属性
    cb['MATCH'] = matcher
    cb.cancel = () => {
      currentTakers = currentTakers.filter(item => item !== cb)
    }
    currentTakers.push(cb)
    console.log('take currentTakers: ', currentTakers);
  }
  // 发布
  function put(input) {
    for (let i = 0; i < currentTakers.length; i++) {
      const taker = currentTakers[i];
      if (taker['MATCH'](input)) {
        // 从数组删除
        taker.cancel()
        taker(input)
        console.log('put currentTakers: ', currentTakers);
      }
    }

  }
  return { take, put }
}

// let channel = stdChannel()
// function next(input) {
//   console.log('next', input);
// }
// // 匹配器  看参数和我的是否匹配
// function matcher(action) {
//   return action.type === 'ASYNCADD'
// }
// function next2(input) {
//   console.log('next2', input);
// }
// // 匹配器  看参数和我的是否匹配
// function matcher2(action) {
//   return action.type === 'ADD'
// }
// channel.take(next, matcher)
// channel.take(next2, matcher2)
// channel.put({ type: 'ADD' })
// channel.put({ type: 'ADD' })
// channel.put({ type: 'ADD' })
