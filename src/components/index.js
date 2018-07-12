import React from 'react'
import Home from './Home'
import Editor from './Editor'
import { Switch, Route } from 'react-router-dom'

const App = (props) => (
    <Switch>
        <Route exact path='/' render={p => <Home dataSet={props.dataSet} />} />
        <Route exact path='/problem/:number' render={p => <Editor {...p} problems={props.dataSet.problems} />} />
    </Switch>
)

export default App
