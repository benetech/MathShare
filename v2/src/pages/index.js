import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
    Switch, Route, withRouter,
} from 'react-router-dom';
import { Layout } from 'antd';
import userProfileActions from '../redux/userProfile/actions';
import ariaLiveAnnouncerActions from '../redux/ariaLiveAnnouncer/actions';
import routerActions from '../redux/router/actions';
import uiActions from '../redux/ui/actions';
import './styles.scss';
import 'antd/dist/antd.less';
import Home from './Home';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import NotLoggedIn from './NotLoggedIn';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

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
                    <NotLoggedIn />
                    <Layout className={`body-container ${this.getBodyClass()}`}>
                        <Sidebar router={router} />
                        <Layout>
                            <Content style={{ padding: '25px' }}>
                                <Switch>
                                    <Route exact path="/" component={withRouter(Home)} />
                                    <Route exact path="/dash" component={withRouter(Dashboard)} />
                                    <Route render={NotFound} />
                                </Switch>
                            </Content>
                        </Layout>
                    </Layout>
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
