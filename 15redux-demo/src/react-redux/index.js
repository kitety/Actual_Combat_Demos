import React, { Component } from 'react'

const { Provider: Pro, Consumer } = React.createContext()

export class Provider extends Component {
  render () {
    const store = this.props.store
    return <Pro value={store}>
      {this.props.children}
    </Pro>
  }
}
export const connect = (mapStateToProps = () => { }, mapDispatchToProps = {}, mergePropsFun = (a, b, c) => ({ ...a, ...b, ...c })) => WrapperComponent => {
  console.log(); return class extends Component {
    render () {
      return (
        <Consumer>
          {s => {
            s.subscribe(() => {
              this.setState({ num: Math.random() })
            })
            const store = s.getState()
            console.log('store: ', store);
            const dispatch = s.dispatch
            const stateProps = mapStateToProps(store, this.props)
            let disPatchProps
            if (typeof disPatchProps === 'function') {
              disPatchProps = mapDispatchToProps(dispatch, this.props)
            } else {
              disPatchProps = mapDispatchToProps

            }
            const mergeProps = mergePropsFun(stateProps, disPatchProps, this.props)
            return <WrapperComponent {...{ ...mergeProps, dispatch }} />
          }}
        </Consumer>
      )
    }
  }

}
function bindActionCreatorsInter (creator, dispatch) {
  return (...args) => dispatch(creator(...args))

}
export function bindActionCreators (creators, dispatch) {
  const obj = {}
  for (const key in creators) {
    if (creators.hasOwnProperty(key)) {
      const element = creators[key];
      obj[key] = bindActionCreatorsInter(element, dispatch)
    }
  }
  return obj
}
