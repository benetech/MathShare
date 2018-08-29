import React, { Component } from 'react';
import Index from './Index';
import Home from './Home';
import Editor from './Editor';
import { Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: {
                problems: []
            },
            problem: {}
        }
    }

    render() {
        ReactGA.initialize(GA_ACCOUNT_ID);
        return (
            <Switch>
                <Route exact path='/problemSet/:editCode' render={p => <Home {...p}/> } />
                <Route exact path='/problemSet/:editCode/revision/:shareCode' render={p => <Home {...p}/> } />
                <Route exact path='/problem/:editCode' render={p => <Editor {...p}/> } />
                <Route exact path='/problem/:editCode/revision/:shareCode' render={p => <Editor {...p}/> } />
                <Route exact path='/' render={p => <Index {...p} />} />
            </Switch>
        )
    }
}
