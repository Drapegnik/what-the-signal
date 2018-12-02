import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import Root from 'components/Root'
import configureStore from 'store/configureStore'
import {openBinaryFile} from 'store/actions'
import './app.global.css'

const store = configureStore()
store.dispatch(openBinaryFile('samples/10Hz.bin'))

render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextRoot = require('./components/Root')
    render(
      <AppContainer>
        <NextRoot store={store} />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
