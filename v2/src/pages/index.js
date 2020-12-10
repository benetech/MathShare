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
import Header from './Header';
import NotFound from './NotFound';
import Problem from './Problem';
import ProblemSet from './ProblemSet';
import UserDetails from './UserDetails';
import SignIn from '../components/SignIn';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

class App extends Component {
    componentDidMount() {
        this.props.checkUserLogin();
        this.setCurrentHeight();
        this.setCurrentFocusedElement();
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

    setCurrentHeight = () => {
        const { ui } = this.props;
        if (ui.currentHeight !== window.innerHeight) {
            this.props.setCurrentHeight(window.innerHeight);
        }
        setTimeout(this.setCurrentHeight, 300);
    }

    setCurrentFocusedElement = () => {
        const { ui } = this.props;
        const activeElement = document.activeElement;
        if (!activeElement) {
            this.props.blurFocusedElement();
        } else {
            const attributes = {};
            activeElement.getAttributeNames().forEach((name) => {
                attributes[name] = activeElement.getAttribute(name);
            });
            const focused = {
                id: activeElement.id,
                className: activeElement.className,
                tag: activeElement.tagName,
                attributes,
            };
            if (JSON.stringify(ui.focused) !== JSON.stringify(focused)) {
                this.props.setFocusedElement(focused);
            }
        }
        setTimeout(this.setCurrentFocusedElement, 300);
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
                                    <Route exact path="/app/problemSet/:action/:code" component={ProblemSet} />
                                    <Route exact path="/app/problem/:action/:code" component={Problem} />
                                    <Route exact path="/app" component={Dashboard} />
                                    <Route exact path="/login" component={SignIn} />
                                    <Route exact path="/signUp" component={SignIn} />
                                    <Route exact path="/userDetails" component={UserDetails} />
                                    <Route exact path="/userDetailsEdit" component={UserDetails} />
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
        ui: state.ui,
    }),
    {
        ...userProfileActions,
        ...ariaLiveAnnouncerActions,
        ...routerActions,
        ...uiActions,
    },
)(App));
