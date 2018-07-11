import React from 'react'
import Home from './Home'
import Editor from './Editor'
import { Switch, Route } from 'react-router-dom'

const App = (props) => (
    <Switch>
        <Route exact path='/' render={p => <Home dataSet={props.dataSet} />} />
        {/*TODO: get problems by id, not always problems[0]*/}
        <Route exact path='/problem/:number' render={p => <Editor problem={props.dataSet.problems[0]} />} />
    </Switch>
)

export default App
