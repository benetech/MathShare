import React, { Component } from 'react'
import Index from './Index'
import Home from './Home'
import Editor from './Editor'
import { Switch, Route } from 'react-router-dom'
import ReactGA from 'react-ga';
const mathLive = DEBUG_MODE ? require('../../mathlive/src/mathlive.js')
    : require('../lib/mathlivedist/mathlive.js');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: {
                problems: []
            },
            saved: false,
            problem: {}
        }
    }

    getProblemById(problems, id) {
        const isProblem = p => p.id === id;
        return problems.find(isProblem);
    }

    render() {
        ReactGA.initialize(GA_ACCOUNT_ID);
        return (
            <Switch>
                <Route exact path='/set/view/:code' render={p => <Home {...p}
                    saved={this.state.saved}
                    dialogDisplayed={()=>this.setState({saved: false})} />} />
                <Route exact path='/problem/view/:code' render={p => <Editor {...p}
                    savedProblem={()=>this.setState({saved: true})} />} />
                <Route exact path='/' render={p => <Index {...p} />} />
            </Switch>
        )
    }
}
