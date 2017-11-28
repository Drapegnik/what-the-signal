import React from 'react'
import {Switch, Route} from 'react-router'

import Main from './pages/Main'

const App = () => (
  <Switch>
    <Route path="/" component={Main} />
  </Switch>
)

export default App
