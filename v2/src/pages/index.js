import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
    Switch, Route, withRouter,
} from 'react-router-dom';
import userProfileActions from '../redux/userProfile/actions';
import ariaLiveAnnouncerActions from '../redux/ariaLiveAnnouncer/actions';
import routerActions from '../redux/router/actions';
import uiActions from '../redux/ui/actions';
import './styles.scss';
import Welcome from './Welcome';
import NotFound from './NotFound';


class App extends Component {
    getClassFromUserConfig = () => '';

    getBodyClass = () => '';

    render() {
        return (
            <React.Fragment>
                <Helmet
                    onChangeClientState={(newState) => {
                        this.props.changeTitle(newState.title);
                    }}
                />
                <div id="contentContainer" className={this.getClassFromUserConfig()}>
                    <div className={`body-container ${this.getBodyClass()}`}>
                        <Switch>
                            <Route exact path="/" render={Welcome} />
                            <Route render={NotFound} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(connect(
    state => ({
        problemList: state.problemList,
        problemStore: state.problem,
        userProfile: state.userProfile,
        modal: state.modal,
        routerHooks: state.routerHooks,
    }),
    {
        ...userProfileActions,
        ...ariaLiveAnnouncerActions,
        ...routerActions,
        ...uiActions,
    },
)(App));
