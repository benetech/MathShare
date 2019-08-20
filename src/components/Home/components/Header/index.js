/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
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
import {
    logoutOfUserProfile,
} from '../../../../redux/userProfile/actions';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import logo from '../../../../../images/mathshare_logo_white.png';
import { stopEvent } from '../../../../services/events';


class MainPageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            googleInitialized: false,
        };
    }

    componentWillMount() {
        this.pollGoogleInitialization();
    }

    componentDidMount() {
        this.logoutClickHandler();
    }

    componentDidUpdate() {
        this.logoutClickHandler();
    }

    pollGoogleInitialization = () => {
        if (window.auth2Initialized) {
            this.setState({
                googleInitialized: true,
            });
        } else {
            setTimeout(this.pollGoogleInitialization, 100);
        }
    }

    logoutClickHandler = () => {
        document.querySelectorAll('li.avatar .dropdown-menu > *').forEach((node) => {
            node.addEventListener('click', e => stopEvent(e));
        });
        const logout = document.querySelector('li.avatar .dropdown-menu a.logout');
        if (logout) {
            logout.addEventListener('click', this.props.logoutOfUserProfile);
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

    render() {
        const { props } = this;
        const { userProfile } = props;
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
                                <img src={logo} alt="Benetech Mathshare" height="37" />
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
                                {(this.state.googleInitialized && !userProfile.service) && (
                                    <li>
                                        <a
                                            id="signIn"
                                            className={`nav-link btn ${header.signInLink}`}
                                            href="/#/signIn"
                                        >

                                            Sign In
                                            <FontAwesome
                                                size="lg"
                                                name="user-circle-o"
                                            />
                                        </a>
                                        <UncontrolledTooltip placement="top" target="signIn" />
                                    </li>
                                )}
                                {userProfile.service && (
                                    <li className="nav-item avatar dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            id="navbarDropdownMenuLink-avatar"
                                            data-toggle="dropdown"
                                        >
                                            <img
                                                src={userProfile.profileImage}
                                                className="rounded-circle z-depth-0"
                                                alt="avatar"
                                            />
                                        </a>
                                        <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-avatar" />
                                        {window.auth2Initialized && (
                                            <div
                                                className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                                                aria-labelledby="navbarDropdownMenuLink-avatar"
                                            >
                                                <div className="dropdown-header">{userProfile.name}</div>
                                                <div className={`dropdown-header ${header.email}`}>{userProfile.email}</div>
                                                <div className="dropdown-divider" />
                                                <a
                                                    className="dropdown-item logout"
                                                    onClick={this.props.logoutOfUserProfile}
                                                    onKeyPress={this.props.logoutOfUserProfile}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    Sign Out
                                                </a>
                                            </div>
                                        )}
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
    state => ({
        userProfile: state.userProfile,
    }),
    {
        toggleModals,
        openTour,
        logoutOfUserProfile,
    },
)(MainPageHeader);
