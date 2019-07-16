import React from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import header from './styles.scss';
import Locales from '../../../../strings';
import {
    toggleModals,
} from '../../../../redux/problemList/actions';
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
    }

    logout = () => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        authInstance.signOut().then(() => {
            this.setState({
                profile: null,
                googleSignInInitialized: false,
            }, this.initializeGoogleSignIn);
        });
    }

    onClickGettingStarted = history => () => {
        googleAnalytics(Locales.strings.getting_started_title);
        history.push('/app/problem/example');
    }

    render() {
        const { props } = this;
        const { profile } = this.state;
        /* eslint-disable jsx-a11y/anchor-is-valid */

        const GettingStartedButton = withRouter(({ history }) => (
            <a
                className={classNames('nav-link', header.pointer)}
                onClick={this.onClickGettingStarted(history)}
                onKeyPress={this.onClickGettingStarted(history)}
                role="link"
                tabIndex="0"
            >
                {Locales.strings.getting_started_title}
            </a>
        ));

        const shareButton = props.editing && !props.notFound && props.action
            ? (
                <a
                    className={classNames('nav-link', header.pointer)}
                    onClick={() => props.toggleModals(['shareSet'])}
                    onKeyPress={() => props.toggleModals(['shareSet'])}
                    role="button"
                    tabIndex="0"
                >
                    {Locales.strings.share}
                </a>
            )
            : null;
        let link = null;
        if (props.notFound) {
            link = null;
        }

        const addProblemSetButton = !props.notFound ? (
            <a
                className={classNames('nav-link', header.pointer)}
                onClick={props.addProblemSetCallback}
                onKeyPress={props.addProblemSetCallback}
                role="button"
                tabIndex="0"
            >
                {Locales.strings.add_problem_set}
            </a>
        ) : null;

        return (
            <div id="topNavigationWrapper" className={header.header}>
                <header>
                    <nav
                        className={classNames(header.navbar, 'navbar-expand-lg', 'navbar')}
                        id="topNavigation"
                    >
                        <h2 id="topNavLabel" className="sROnly">{Locales.strings.header}</h2>
                        <a
                            className="navbar-brand"
                            href="#/"
                            onClick={() => {
                                googleAnalytics('clicked logo');
                            }}
                        >
                            <img src={logo} alt="Benetech Math Editor" height="37" />
                            <span className={header.beta}>beta</span>
                        </a>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarNav"
                        >
                            <div className={classNames('navbar-nav', 'mr-auto')} />
                            <ul aria-labelledby="topNavLabel" className={classNames('navbar-nav', header.navItem)}>
                                {props.action && (
                                    <li className="nav_item">
                                        <GettingStartedButton />
                                    </li>
                                )}
                                {props.action && (
                                    <li className="nav_item">
                                        {!props.action && addProblemSetButton}
                                    </li>
                                )}
                                {props.action && (
                                    <li className="nav_item">
                                        {!props.action && shareButton}
                                    </li>
                                )}
                                {props.action && (
                                    <li className="nav_item">
                                        {link}
                                    </li>
                                )}
                                {/*
                            <li className={classNames('nav-item', ['dropdown'])}>
                                <a
                                    className={classNames('nav-link', 'dropdown-toggle')}
                                    data-toggle="dropdown"
                                    href="#"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    {Locales.strings.problem_sets}
                                </a>
                                <Dropdown.Menu role="list" aria-label="Problem Sets">
                                    <MenuItem onClick={() => props.changeDataSet(0)}>
                                        {Locales.strings.problem_set_1}
                                    </MenuItem>
                                    <MenuItem onClick={() => props.changeDataSet(1)}>
                                        {Locales.strings.problem_set_2}
                                    </MenuItem>
                                    <MenuItem onClick={() => props.changeDataSet(2)}>
                                        {Locales.strings.problem_set_3}
                                    </MenuItem>
                                    {
                                    <MenuItem onClick={uploadProblemSet.bind(this)}>
                                        {Locales.strings.upload}
                                    </MenuItem>
                                     } <input
                                            ref="fileid"
                                            type="file"
                                            hidden
                                            onChange={readBlob.bind(this)}
                                            />
                                </Dropdown.Menu>
                            </li>
                            */}
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="https://docs.google.com/document/d/e/2PACX-1vQOx_2OGBBrG0AQkQC1Y9K2zUpjod-YKQvK5Z6_aCEdFgy2aINtBei5Xxm8pK-UinG0glY4C8aLVXKD/pub"
                                        onClick={() => {
                                            googleAnalytics('click help center');
                                        }}
                                    >
                                        {Locales.strings.help_center}
                                    </a>
                                </li>
                                {props.action && (
                                    <li className="nav-item">
                                        <a className="nav-link" href="mailto:info@diagramcenter.org">
                                            {Locales.strings.contact_us}
                                        </a>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <a
                                        href="http://www.surveygizmo.com/s3/4048161/Benetech-s-Math-Editor-Online-Feedback"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="nav-link"
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
                                </li>
                                {(props.action === 'new' || props.action === 'edit') && (
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Teachers
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
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
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="navbar-header pull-right">
                            <ul className="nav pull-left">
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
                                            id="navbarDropdownMenuLink-55"
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
                                            aria-labelledby="navbarDropdownMenuLink-55"
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
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                            <span className={`${header.navbarTogglerIcon} fa fa-bars fa-lg`} />
                        </button>
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
    },
)(MainPageHeader);
