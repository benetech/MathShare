import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
    Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import { Layout } from 'antd';
import userProfileActions from '../redux/userProfile/actions';
import ariaLiveAnnouncerActions from '../redux/ariaLiveAnnouncer/actions';
import routerActions from '../redux/router/actions';
import uiActions from '../redux/ui/actions';
import './styles.scss';
import 'antd/dist/antd.less';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import Header from './Header';
import Problem from './Problem';
import ProblemSet from './ProblemSet';
import SignIn from '../components/SignIn';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

class App extends Component {
    componentDidMount() {
        this.props.checkUserLogin();
    }

    getClassFromUserConfig = () => 'container-fluid';

    getBodyClass = () => 'flex-xl-nowrap row';

    userIsLoggedIn = () => !!this.props.userProfile.email

    shouldRenderCommonComponents = () => {
        const { router } = this.props;
        const pathName = router.location.pathname.toLowerCase();
        if (pathName === '/login' || pathName === '/signup') {
            return false;
        }
        return true;
    }

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
                    {this.shouldRenderCommonComponents() && (
                        <Header />
                    )}
                    <Layout className={`body-container ${this.getBodyClass()}`}>
                        {this.shouldRenderCommonComponents() && <Sidebar router={router} />}
                        <Layout>
                            <Content>
                                <Switch>
                                    <Route exact path="/">
                                        <Redirect to="/app" />
                                    </Route>
                                    <Route exact path="/app/problemSet/:action/:code" component={withRouter(ProblemSet)} />
                                    <Route exact path="/app/problem/:action/:code" component={withRouter(Problem)} />
                                    <Route exact path="/app" component={withRouter(Dashboard)} />
                                    <Route exact path="/signUp" component={withRouter(SignIn)} />
                                    <Route exact path="/login" component={withRouter(SignIn)} />
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
