import React from 'react'
import Home from './Home'
import Problem from './Editor'
import { Switch, Route } from 'react-router-dom'

const App = () => (
    <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/problem/:number' component={Problem} />
    </Switch>
)

export default App
