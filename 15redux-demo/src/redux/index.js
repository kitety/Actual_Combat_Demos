export function createStore (reducer, initState, enhancer) {

  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  // 没有中间件
  let currentState = initState
  let currentListeners = []
  function getState () {
    console.log('currentState: ', currentState);
    return currentState
  }
  function dispatch (action) {
    currentState = reducer(
      currentState, action
    )
    currentListeners.forEach(item => {
      item()
    })
  }
  function subscribe (listener) {
    currentListeners.push(listener)
  }
  // 初始化
  dispatch({ type: '@INIT/REDUX' })

  return {
    getState, dispatch, subscribe,

  }
}

function compose (...funcs) {
  if (funcs.length === 0) {
    return a => a
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// middleware 返回函数的函数
export function applyMiddleware (...middleware) {
  // 
  return createStore => (...reducers) => {
    const store = createStore(...reducers)
    // 给middleWare给参数
    const middleApi = {
      getState: store.getState,
      dispatch: store.dispatch,
    }
    // 函数的数组
    const middlewareChain = middleware.map(middle => {
      return middle(middleApi)
    })

    // compose
    // 赋值第一个dispatch
    const dispatch = compose(...middlewareChain)(store.dispatch)
    return { ...store, dispatch }
  }
}

export function combineReducer (reducers) {
  // 第一个只是先过滤一遍 把非function的reducer过滤掉
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  reducerKeys.forEach((key) => {
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  })
  const finalReducersKeys = Object.keys(finalReducers)
  // 第二步比较重要 就是将所有reducer合在一起
  // 根据key调用每个reducer，将他们的值合并在一起
  let hasChange = false;
  const nextState = {};
  return function combine (state = {}, action) {
    finalReducersKeys.forEach((key) => {
      // 第一步先获取目前的state[key]，所以说传入reducer的key === store的key
      const previousValue = state[key];
      // 就用reducer[key]来处理，得到下一个状态
      const nextValue = reducers[key](previousValue, action);
      // 根据key更新store的值
      nextState[key] = nextValue;
      hasChange = hasChange || previousValue !== nextValue
    })
    // 如果整个循环都没有被更新过，返回state
    return hasChange ? nextState : state;
  }
}
