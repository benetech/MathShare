import React, { Component } from 'react'
import Home from './Home'
import Editor from './Editor'
import { Switch, Route } from 'react-router-dom'
import example from '../data/example01.json';
import ReactGA from 'react-ga';

export default class App extends Component {
    getProblemById(problems, id) {
        const isProblem = p => p.metadata.id === id;
        return problems.find(isProblem);
    }

    render() {
        ReactGA.initialize(GA_ACCOUNT_ID);
        var data = this.props.dataSet.problems;
        if (this.getProblemById(data, 'example1') == undefined) {
            data.push(example);
        }
        return (
            <Switch>
                <Route exact path='/' render={p => <Home dataSet={this.props.dataSet} />} />
                <Route exact path='/problem/:number' render={p =>
                    <Editor {...p} problems={data} allowedPalettes={this.props.dataSet.metadata.allowedPalettes} />} />
            </Switch>
        )
    }
}
