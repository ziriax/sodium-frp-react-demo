import *  as React from 'react'
import *  as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { App } from './containers/App'

const render = () => {
  console.info("Rendering app...");
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  )
}

render()

namespace global {
  interface NodeModule {
    hot?: boolean
  }
}

if (module.hot) {
  module.hot.accept(); //'.', render);
}
