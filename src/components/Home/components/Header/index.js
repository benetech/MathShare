import React from 'react';
import { IntercomAPI } from 'react-intercom';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
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

const shareOnTwitter = () => {
    window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${Locales.strings.share_with_teachers_text} ${window.location.href}`)}`, '_blank',
    );
};

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
            window.gapi.signin2.render(
                GOOGLE_SIGN_IN,
                {
                    scope: 'profile email',
                    theme: 'dark',
                    height: 40,
                    onsuccess: this.onSuccess,
                },
            );
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
        this.props.openTour();
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
                                    <a
                                        className={`nav-link dropdown-toggle btn ${header.dropDownMenu}`}
                                        id="navbarDropdownMenuLink-dropdown"
                                        data-toggle="dropdown"
                                    >
                                        <FontAwesome
                                            size="lg"
                                            name="question"
                                        />
                                    </a>
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
                                                {props.action === 'edit' && (
                                                    <React.Fragment>
                                                        <a
                                                            className="dropdown-item"
                                                            onClick={props.duplicateProblemSet}
                                                            onKeyPress={props.duplicateProblemSet}
                                                            role="link"
                                                            tabIndex="0"
                                                        >
                                                            <FontAwesome
                                                                size="lg"
                                                                name="copy"
                                                            />
                                                            {` ${Locales.strings.duplicate_set}`}
                                                        </a>
                                                        <a
                                                            className="dropdown-item"
                                                            onClick={shareOnTwitter}
                                                            onKeyPress={shareOnTwitter}
                                                            role="link"
                                                            tabIndex="0"
                                                        >
                                                            <FontAwesome
                                                                size="lg"
                                                                name="twitter"
                                                            />
                                                            {` ${Locales.strings.share_with_teachers}`}
                                                        </a>
                                                    </React.Fragment>
                                                )}
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
                                        <div
                                            id={GOOGLE_SIGN_IN}
                                            className={header.googleSignInContainer}
                                        />
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
