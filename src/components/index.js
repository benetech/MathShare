import React, { Component } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSignature, faSquareRootAlt,
} from '@fortawesome/free-solid-svg-icons';
import PageIndex from './PageIndex';
import NotFound from './NotFound';
import Home from './Home';
import Editor from './Editor';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.initializeIcons();
    }

    initializeIcons = () => {
        library.add(faSignature, faSquareRootAlt);
    }

    render() {
        return (
            <Switch>
                <Route exact path="/app/problemSet/:action/:code" render={p => <Home {...p} />} />
                <Route exact path="/app/problem/:action/:code" render={p => <Editor {...p} />} />
                <Route exact path="/app/problem/example" render={p => <Editor example {...p} />} />
                <Route exact path="/app" render={p => <PageIndex {...p} />} />
                <Route exact path="/">
                    <Redirect to="/app" />
                </Route>
                <Route render={p => <NotFound {...p} />} />
            </Switch>
        );
    }
}
