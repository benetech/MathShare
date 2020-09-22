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
import Home from './Home';
import Dashboard from './Dashboard';
import NotFound from './NotFound';

import 'argon-design-system-react/src/assets/vendor/nucleo/css/nucleo.css';
import 'argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.min.css';
import '../assets/scss/argon-design-system-react.scss';
import 'argon-design-system-free/assets/js/core/bootstrap.min';
import 'argon-design-system-free/assets/js/core/jquery.min';
import 'argon-design-system-free/assets/js/core/popper.min';
import 'argon-design-system-free/assets/js/argon-design-system.min';
import Sidebar from '../components/Sidebar';

class App extends Component {
    getClassFromUserConfig = () => 'container-fluid';

    getBodyClass = () => 'flex-xl-nowrap row';

    render() {
        const { router } = this.props;
        return (
            <React.Fragment>
                <Helmet
                    onChangeClientState={(newState) => {
                        this.props.changeTitle(newState.title);
                    }}
                />
                <div id="contentContainer" className={this.getClassFromUserConfig()}>
                    <div className={`body-container ${this.getBodyClass()}`}>
                        <Sidebar router={router} />
                        <main className="py-md-3 pl-md-5 ct-content col-12 col-md-8 col-xl-9">
                            <Switch>
                                <Route exact path="/" component={withRouter(Home)} />
                                <Route exact path="/dash" component={withRouter(Dashboard)} />
                                <Route render={NotFound} />
                            </Switch>
                        </main>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(connect(
    state => ({
        userProfile: state.userProfile,
        routerHooks: state.routerHooks,
        router: state.router,
    }),
    {
        ...userProfileActions,
        ...ariaLiveAnnouncerActions,
        ...routerActions,
        ...uiActions,
    },
)(App));
