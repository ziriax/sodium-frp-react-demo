import *  as React from 'react'
import *  as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Root } from './containers/Root'

const render = (Component: React.ComponentClass | React.StatelessComponent) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Root)

namespace global {
  interface NodeModule {
    hot?: boolean
  }
}

if (module.hot) {
  module.hot.accept('./containers/Root', () => { render(Root) })
}
