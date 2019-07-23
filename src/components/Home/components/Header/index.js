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
import logo from '../../../../../images/mathshare_logo_white.png';

import googleAnalytics from '../../../../scripts/googleAnalytics';


const GOOGLE_SIGN_IN = 'googleSignIn';

/*
this may be needed in future
function uploadProblemSet() {
    this.refs.fileid.click();
}

function readBlob(optStartByte, optStopByte) {

    const files = this.refs.fileid.files;
    console.log(files);
    if (!files.length) {
        NotificationManager.warning(Locales.strings.upload_no_file_warning, 'Warning');
        return;
    }

    const file = files[0];
    console.log('file:');
    console.log(file);
    const start = parseInt(optStartByte, 10) || 0;
    console.log(`start:${start}`);
    const stop = parseInt(optStopByte, 10) || file.size - 1;
    console.log(`stop:${stop}`);

    const reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
            const uploadedString = evt.target.result;
            const parsedUploadedString = JSON.parse(uploadedString);
            console.log(parsedUploadedString);
            ReadFileFinish(parsedUploadedString);
        }
    };

    const blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
} */

const openNewProblemSet = () => {
    window.open('/#/app/problemSet/new', '_blank');
};

const renderGoogleBtn = () => (
    <div style={{ height: 40, width: 120 }} className="abcRioButton abcRioButtonBlue">
        <div className="abcRioButtonContentWrapper">
            <div className="abcRioButtonIcon" style={{ padding: 10 }}>
                <div style={{ width: 18, height: 18 }} className="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" className="abcRioButtonSvg">
                        <g>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </g>
                    </svg>
                </div>
            </div>
            <span style={{ fontSize: 14, lineHeight: '38px' }} className="abcRioButtonContents">
                <span id="not_signed_insn584fxcersa">Sign in</span>
                <span id="connectedsn584fxcersa" style={{ display: 'none' }}>Signed in</span>
            </span>
        </div>
    </div>
);


class MainPageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            googleSignInInitialized: false,
            profile: null,
        };
    }

    componentDidMount() {
        this.initializeGoogleSignIn();
    }

    initializeGoogleSignIn = () => {
        if (!window.gapi || !window.gapi.signin2) {
            setTimeout(this.initializeGoogleSignIn, 500);
        } else if (!this.state.googleSignInInitialized) {
            this.setState({
                googleSignInInitialized: true,
                hideBtn: true,
            });
            const authInstance = window.gapi.auth2.getAuthInstance();
            authInstance.attachClickHandler(
                GOOGLE_SIGN_IN,
                {
                    scope: 'profile email',
                    theme: 'dark',
                    height: 40,
                    onsuccess: this.onSuccess,
                },
                this.onSuccess,
                () => { },
            );
            document.getElementById(GOOGLE_SIGN_IN).addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    authInstance.signIn();
                }
            });
        }
    }

    onSuccess = (googleUser) => {
        const profile = googleUser.getBasicProfile();
        this.setState({
            profile,
        }, () => {
            setTimeout(() => {
                document.querySelectorAll('li.avatar .dropdown-menu > *').forEach((node) => {
                    node.addEventListener('click', (e) => {
                        e.stopPropagation();
                        return false;
                    });
                });
                document.querySelector('li.avatar .dropdown-menu a.logout').addEventListener('click', this.logout);
            }, 100);
        });
        IntercomAPI('update', {
            user_id: profile.getEmail(),
            email: profile.getEmail(),
            name: profile.getName(),
        });
    }

    logout = () => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        authInstance.signOut().then(() => {
            this.setState({
                profile: null,
                googleSignInInitialized: false,
            }, this.initializeGoogleSignIn);
            IntercomAPI('shutdown');
            IntercomAPI('boot', {
                app_id: process.env.INTERCOM_APP_ID,
            });
        });
    }

    onClickTutorial = () => {
        googleAnalytics(Locales.strings.tutorial);
        setTimeout(() => {
            this.props.openTour();
        }, 100);
    }

    render() {
        const { props } = this;
        const { profile } = this.state;
        /* eslint-disable jsx-a11y/anchor-is-valid */

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
                                    <button
                                        className={`nav-link dropdown-toggle btn ${header.dropDownMenu}`}
                                        id="navbarDropdownMenuLink-dropdown"
                                        data-toggle="dropdown"
                                        type="button"
                                        // eslint-disable-next-line max-len
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                                        tabIndex={0}
                                    >
                                        <FontAwesome
                                            size="lg"
                                            name="question"
                                        />
                                    </button>
                                    <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-dropdown" />
                                    <div
                                        className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                                        aria-labelledby="navbarDropdownMenuLink-dropdown"
                                    >
                                        {/* {props.action && (
                                            <GettingStartedButton />
                                        )} */}
                                        {(props.action === 'new' || props.action === 'edit') && (
                                            <React.Fragment>
                                                <a
                                                    className="dropdown-item"
                                                    onClick={openNewProblemSet}
                                                    onKeyPress={openNewProblemSet}
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
                                            href="http://www.surveygizmo.com/s3/4048161/Benetech-s-Math-Editor-Online-Feedback"
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
                                        <span className="">
                                            <div
                                                id={GOOGLE_SIGN_IN}
                                                className={header.googleSignInContainer}
                                                tabIndex={0}
                                            >
                                                {renderGoogleBtn()}
                                            </div>
                                            <UncontrolledTooltip placement="top" target={GOOGLE_SIGN_IN} />
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
                                                src={profile.getImageUrl()}
                                                className="rounded-circle z-depth-0"
                                                alt="avatar"
                                            />
                                        </a>
                                        <UncontrolledTooltip placement="top" target="navbarDropdownMenuLink-avatar" />
                                        <div
                                            className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                                            aria-labelledby="navbarDropdownMenuLink-avatar"
                                        >
                                            <div className="dropdown-header">{profile.getName()}</div>
                                            <div className={`dropdown-header ${header.email}`}>{profile.getEmail()}</div>
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
