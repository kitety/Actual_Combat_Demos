import React, { Component } from 'react'
import { connect } from './react-redux'

class Child extends Component {

  render () {
    console.log(111111, this.props);
    return (
      <div>
        <hr />
        <p>{this.props.state.count}</p>
        <button >异步+</button>
        <button onClick={this.props.add}>+</button>
        <button onClick={() => {
          this.props.dispatch({ type: 'ADD' })
        }}>+2</button>
        <button onClick={this.props.desc}>-</button>
      </div>
    )
  }
}
function mapStateToProps (state, ownProps) {
  console.log('state: ', state);
  console.log('ownProps: ', ownProps);
  // ownProps 本身的props 发生变化的话 mapStateToProps就会重新执行
  return { state }
}
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    add: () => {
      return dispatch({ type: 'ADD' })
    },
    desc: () => dispatch({ type: 'DESC' }),
    reset: () => dispatch({ type: 'sarsfe' })
  }
}
export default connect(mapStateToProps, mapDispatchToProps, (stateProps, dispatchProps, ownProps) => ({

  ...stateProps,
  ...dispatchProps,
  ...ownProps,

}))(Child)
