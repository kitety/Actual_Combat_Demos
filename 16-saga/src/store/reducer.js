import * as actionTypes from './action-types'

// 状态处理函数
const reducer = (state = { number: 0 }, action) => {
  switch (action.type) {
    case actionTypes.ADD:
      return { ...state, number: state.number + 1 }

    default:
      return { ...state, }

  }
}
export default reducer
