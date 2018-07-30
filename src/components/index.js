import React, { Component } from 'react'
import Home from './Home'
import Editor from './Editor'
import { Switch, Route } from 'react-router-dom'
import example from '../data/example01.json';
import ReactGA from 'react-ga';
const mathLive = DEBUG_MODE ? require('../../mathlive/src/mathlive.js')
    : require('../lib/mathlivedist/mathlive.js');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: props.dataSets[0],
            saved: false
        }
    }

    getProblemById(problems, id) {
        const isProblem = p => p.metadata.id === id;
        return problems.find(isProblem);
    }

    render() {
        ReactGA.initialize(GA_ACCOUNT_ID);
        var data = this.state.dataSet.problems;
        if (!this.getProblemById(data, 'example')) {
            data.push(example);
        }
        return (
            <Switch>
                <Route exact path='/' render={p => <Home {...p} problems={data}
                    changeDataSet={id => {this.setState({dataSet: this.props.dataSets[id]},
                    mathLive.renderMathInDocument());
                }} saved={this.state.saved} dialogDisplayed={()=>this.setState({saved: false})}/>} />
                <Route exact path='/problem/:number' render={p =>
                    <Editor {...p} problems={data} allowedPalettes={this.state.dataSet.metadata.allowedPalettes}
                        savedProblem={()=>this.setState({saved: true})} />} />
            </Switch>
        )
    }
}
