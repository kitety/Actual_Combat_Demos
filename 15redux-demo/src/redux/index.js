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
