import React from 'react'
import { applyMiddleware, createStore } from './redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Provider } from './react-redux'
import Child from './Child'


function mylogger () {
  return dispatch => action => {

    console.log(action.type, '执行了');
    return dispatch(action)
  }
}
function mythunk ({ getState }) {
  return dispatch => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    return dispatch(action)
  }
}
function reducer (state = 0, action) {
  switch (action.type) {
    case 'ADD':
      return state + 1
      break;
    case 'DESC':
      return state - 1

      break;

    default:
      return state

      break;
  }
}
const store = createStore(reducer, 1, applyMiddleware(mythunk, mylogger))
const App = () => {
  const [state, update] = React.useState(0)
  const forceUpdate = () => {
    update(state + 1)
  }
  store.subscribe(() => {
    console.log('subscribe');
    forceUpdate()
  })
  function asyncAdd () {
    store.dispatch((dispatch) => {
      setTimeout(() => {
        store.dispatch({ type: 'ADD' })
      }, 1000);
    })
  }
  function add () {
    store.dispatch({ type: 'ADD' })
  }
  function desc () {
    store.dispatch({ type: 'DESC' })
  }
  return (
    <Provider store={store}>
      <p>{store.getState()}</p>
      <button onClick={asyncAdd}>异步+</button>
      <button onClick={add}>+</button>
      <button onClick={desc}>-</button>
      <Child name="hello" />
    </Provider >
  )
}
export default App
