import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
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
                <Route exact path="/problemSet/:action/:code" render={p => <Home {...p} />} />
                <Route exact path="/problem/:action/:code" render={p => <Editor {...p} />} />
                <Route exact path="/problem/example" render={p => <Editor example {...p} />} />
                <Route exact path="/" render={p => <PageIndex {...p} />} />
                <Route render={p => <NotFound {...p} />} />
            </Switch>
        );
    }
}
