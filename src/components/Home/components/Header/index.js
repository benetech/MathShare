/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import ReactGA from 'react-ga';
import { UserAgentApplication } from 'msal';
import { IntercomAPI } from 'react-intercom';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import header from './styles.scss';
import Locales from '../../../../strings';
import {
    toggleModals,
} from '../../../../redux/problemList/actions';
import {
    openTour,
} from '../../../../redux/problem/actions';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import logo from '../../../../../images/mathshare_logo_white.png';
import googleLogo from '../../../../../images/google-logo.svg';
import microsoftLogo from '../../../../../images/microsoft-logo.svg';
import msalConfig from '../../../../constants/msal';


class MainPageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            googleSignInInitialized: false,
            profile: null,
        };
        this.GOOGLE_SIGN_IN = 'googleSignIn';
        this.MS_SIGN_IN = 'msSignIn';
    }

    componentDidMount() {
        this.initializeGoogleSignIn();
        this.checkMicrosoftLogin();
    }

    startMicrosoftSignIn = () => {
        const myMSALObj = new UserAgentApplication(msalConfig);
        const requestObj = {
            scopes: ['user.read', 'User.ReadBasic.All', 'profile'],
        };

        myMSALObj.loginPopup(requestObj).then(() => {
            this.checkMicrosoftLogin();
        }).catch((error) => {
            console.log(error);
        });
    }

    initializeGoogleSignIn = () => {
        if (!window.gapi || !window.gapi.signin2 || !window.gapi.auth2) {
            setTimeout(this.initializeGoogleSignIn, 500);
        } else if (!this.state.googleSignInInitialized) {
            this.setState({
                googleSignInInitialized: true,
                hideBtn: true,
            });
            const authInstance = window.gapi.auth2.getAuthInstance();
            const user = authInstance.currentUser.get();
            if (user && user.isSignedIn() && user.getBasicProfile()) {
                this.checkGoogleLogin(user);
            }
            authInstance.attachClickHandler(
                this.GOOGLE_SIGN_IN,
                {
                    scope: 'profile email',
                    theme: 'dark',
                    height: 40,
                    onsuccess: this.onSuccess,
                },
                this.checkGoogleLogin,
                () => { },
            );
            document.getElementById(this.GOOGLE_SIGN_IN).addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    authInstance.signIn();
                }
            });
        }
    }

    accountDropdownCallback = () => {
        document.querySelectorAll('li.avatar .dropdown-menu > *').forEach((node) => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                return false;
            });
        });
        const logout = document.querySelector('li.avatar .dropdown-menu a.logout');
        if (logout) {
            logout.addEventListener('click', this.logout);
        }
    }

    checkGoogleLogin = (googleUser) => {
        const profile = googleUser.getBasicProfile();
        if (profile) {
            const email = profile.getEmail();
            const name = profile.getName();
            this.onSuccess('google', email, name, profile.getImageUrl(), this.accountDropdownCallback);
        }
    }

    checkMicrosoftLogin = () => {
        const myMSALObj = new UserAgentApplication(msalConfig);
        const microsoftAccount = myMSALObj.getAccount();
        if (microsoftAccount) {
            const { name, userName } = microsoftAccount;
            const profileImage = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=256&name=${encodeURIComponent(name)}&rounded=true&length=1`;
            this.onSuccess('ms', userName, name, profileImage, this.accountDropdownCallback);
        }
    }

    onSuccess = (service, email, name, image, callback) => {
        this.setState({
            profile: {
                email,
                name,
                image,
                service,
            },
        }, () => {
            if (callback) {
                setTimeout(callback, 100);
            }
        });
        IntercomAPI('update', {
            user_id: email,
            email,
            name,
        });
        ReactGA.set({
            email,
        });
    }

    logout = () => {
        const { profile } = this.state;
        if (!profile) {
            return;
        }
        const { service } = profile;
        let promise = null;
        if (service === 'google') {
            const authInstance = window.gapi.auth2.getAuthInstance();
            promise = authInstance.signOut();
        } else if (service === 'ms') {
            promise = new Promise((resolve) => {
                resolve();
            });
        }
        if (promise) {
            promise.then(() => {
                this.setState({
                    profile: null,
                    googleSignInInitialized: false,
                }, this.initializeGoogleSignIn);
                IntercomAPI('shutdown');
                IntercomAPI('boot', {
                    app_id: process.env.INTERCOM_APP_ID,
                });
                if (service === 'ms') {
                    const myMSALObj = new UserAgentApplication(msalConfig);
                    myMSALObj.logout();
                }
            });
        }
    }

    onClickTutorial = () => {
        googleAnalytics(Locales.strings.tutorial);
        setTimeout(() => {
            this.props.openTour();
        }, 100);
    }

    clickOnQuestion = () => {
        googleAnalytics('clicked help center');
        IntercomAPI('trackEvent', 'clicked-help-center');
    }

    openNewProblemSet = () => {
        window.open('/#/app/problemSet/new', '_blank');
    };

    renderGoogleBtn = () => (
        <div style={{ height: 40, width: 120 }} className="abcRioButton abcRioButtonBlue">
            <div className="abcRioButtonContentWrapper">
                <div className="abcRioButtonIcon" style={{ padding: 10 }}>
                    <div style={{ width: 18, height: 18 }} className="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18">
                        <img src={googleLogo} alt="google logo" />
                    </div>
                </div>
                <span style={{ fontSize: 14, lineHeight: '38px' }} className="abcRioButtonContents">
                    <span id="not_signed_insn584fxcersa">Sign in</span>
                </span>
            </div>
        </div>
    );

    render() {
        const { props } = this;
        const { profile } = this.state;
        /* eslint-disable jsx-a11y/anchor-is-valid */
        const questionBtnId = 'navbarDropdownMenuLink-dropdown';

        return (
            <div id="topNavigationWrapper" className={header.header}>
                <header>
                    <nav
                        className={classNames(header.navbar, 'navbar-expand-lg', 'navbar')}
                        id="topNavigation"
                    >
                        <h2 id="topNavLabel" className="sROnly">{Locales.strings.header}</h2>
                        <div className={header.navbarBrandContainer}>
                            <a
                                className="navbar-brand"
                                href="#/app"
                                onClick={() => {
                                    googleAnalytics('clicked logo');
                                }}
                            >
                                <img src={logo} alt="Benetech Math Editor" height="37" />
                                <span className={header.beta}>beta</span>
                            </a>
                        </div>
                        <div className="navbar-header pull-right">
                            <ul className="nav pull-left">
                                <li className="nav-item dropdown">
                                    <span id={`${questionBtnId}-label`} className="sROnly">{Locales.strings.help_center}</span>
                                    <button
                                        className={`nav-link dropdown-toggle btn ${header.dropDownMenu}`}
                                        id={questionBtnId}
                                        data-toggle="dropdown"
                                        type="button"
                                        tabIndex={0}
                                        aria-labelledby={`${questionBtnId}-label`}
                                        onClick={this.clickOnQuestion}
                                        onKeyPress={this.clickOnQuestion}
                                    >
                                        <FontAwesome
                                            size="lg"
                                            name="question"
                                        />
                                    </button>
                                    <UncontrolledTooltip placement="top" target={questionBtnId} />
                                    <div
                                        className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                                        aria-labelledby={`${questionBtnId}-label`}
                                    >
                                        {/* {props.action && (
                                            <GettingStartedButton />
                                        )} */}
                                        {(props.action === 'new' || props.action === 'edit') && (
                                            <React.Fragment>
                                                <a
                                                    className="dropdown-item"
                                                    onClick={this.openNewProblemSet}
                                                    onKeyPress={this.openNewProblemSet}
                                                    role="link"
                                                    tabIndex="0"
                                                >
                                                    <FontAwesome
                                                        size="lg"
                                                        name="plus"
                                                    />
                                                    {` ${Locales.strings.add_problem_set}`}
                                                </a>
                                            </React.Fragment>
                                        )}
                                        <a
                                            className="dropdown-item"
                                            href="/#/app/problem/example"
                                            onClick={this.onClickTutorial}
                                            onKeyPress={this.onClickTutorial}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <FontAwesome
                                                className="super-crazy-colors"
                                                name="hand-o-up"
                                                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                            />
                                            {Locales.strings.tutorial}
                                        </a>
                                        <a
                                            className="dropdown-item"
                                            href="https://intercom.help/benetech/en"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                googleAnalytics('click help center');
                                            }}
                                        >
                                            <FontAwesome
                                                className="super-crazy-colors"
                                                name="comment"
                                                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                            />
                                            {Locales.strings.help_center}
                                        </a>
                                        <a
                                            href="https://docs.google.com/forms/d/e/1FAIpQLScSZJo47vQM_5ci2MOgBbJW7WM6FbEi2xABR5qSZd8oD2RZEg/viewform?usp=sf_link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="dropdown-item"
                                            onClick={() => {
                                                googleAnalytics('click feedback');
                                            }}
                                        >
                                            <FontAwesome
                                                className="super-crazy-colors"
                                                name="arrow-circle-right"
                                                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                            />
                                            {Locales.strings.provide_feedback}
                                        </a>
                                    </div>
                                </li>
                                {!profile && (
                                    <li>
                                        <span>
                                            <div
                                                id={this.MS_SIGN_IN}
                                                className={`${header.googleSignInContainer} ${header.microsoftContainer}`}
                                                role="button"
                                                onClick={this.startMicrosoftSignIn}
                                                onKeyPress={this.startMicrosoftSignIn}
                                                tabIndex={0}
                                            >
                                                <img src={microsoftLogo} alt="microsoft logo" />
                                            </div>
                                            <UncontrolledTooltip placement="top" target={this.MS_SIGN_IN} />
                                        </span>
                                    </li>
                                )}
                                {!profile && (
                                    <li>
                                        <span className="">
                                            <div
                                                id={this.GOOGLE_SIGN_IN}
                                                className={header.googleSignInContainer}
                                                tabIndex={0}
                                            >
                                                {this.renderGoogleBtn()}
                                            </div>
                                            <UncontrolledTooltip placement="top" target={this.GOOGLE_SIGN_IN} />
                                        </span>
                                    </li>
                                )}
                                {profile && (
                                    <li className="nav-item avatar dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            id="navbarDropdownMenuLink-avatar"
                                            data-toggle="dropdown"
                                        >
                                            <img
                                                src={profile.image}
                                                className="rounded-circle z-depth-0"
                                                alt="avatar"
                                            />
                                        </a>
                                        <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-avatar" />
                                        <div
                                            className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                                            aria-labelledby="navbarDropdownMenuLink-avatar"
                                        >
                                            <div className="dropdown-header">{profile.name}</div>
                                            <div className={`dropdown-header ${header.email}`}>{profile.email}</div>
                                            <div className="dropdown-divider" />
                                            <a
                                                className="dropdown-item logout"
                                                onClick={this.logout}
                                                onKeyPress={this.logout}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                Sign Out
                                            </a>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>
            /* eslint-enable jsx-a11y/anchor-is-valid */
        );
    }
}

export default connect(
    () => ({}),
    {
        toggleModals,
        openTour,
    },
)(MainPageHeader);
