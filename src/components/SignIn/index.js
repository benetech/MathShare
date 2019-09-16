import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import msalConfig from '../../constants/msal';
import Locales from '../../strings';
import { setUserProfile, checkGoogleLogin, checkMsLogin } from '../../redux/userProfile/actions';
import logo from '../../../images/logo-black.png';
import googleLogo from '../../../images/google-logo.svg';
import microsoftLogo from '../../../images/microsoft-logo.svg';
import signIn from './styles.scss';
import { passEventForKeys } from '../../services/events';


class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            googleSignInInitialized: false,
        };
        this.GOOGLE_SIGN_IN = 'googleSignIn';
        this.MS_SIGN_IN = 'msSignIn';
    }

    componentDidMount() {
        this.initializeGoogleSignIn();
        this.props.checkMsLogin();
    }

    startMicrosoftSignIn = () => {
        const myMSALObj = new UserAgentApplication(msalConfig);
        const requestObj = {
            scopes: ['user.read'],
        };

        myMSALObj.loginPopup(requestObj).then(() => {
            this.props.checkMsLogin(true);
        }).catch(() => { });
    }

    initializeGoogleSignIn = () => {
        if (!window.gapi
            || !window.gapi.signin2 || !window.gapi.auth2 || !window.auth2Initialized) {
            setTimeout(this.initializeGoogleSignIn, 500);
        } else if (!this.state.googleSignInInitialized) {
            this.setState({
                googleSignInInitialized: true,
                hideBtn: true,
            });
            const authInstance = window.gapi.auth2.getAuthInstance();
            authInstance.attachClickHandler(
                this.GOOGLE_SIGN_IN,
                {
                    scope: 'profile email',
                    theme: 'dark',
                    height: 40,
                },
                () => {
                    this.props.checkGoogleLogin(true);
                },
                () => { },
            );
            document.getElementById(this.GOOGLE_SIGN_IN).addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    authInstance.signIn();
                }
            });
        }
    }

    onSuccess = (service, email, name, image) => {
        this.props.setUserProfile(email, name, image, service);
    }

    renderGoogleBtn = () => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div id={this.GOOGLE_SIGN_IN} tabIndex={0} style={{ height: 40, width: 120 }} className="abcRioButton abcRioButtonBlue">
            <div className="abcRioButtonContentWrapper">
                <div className="abcRioButtonIcon" style={{ padding: 10 }}>
                    <div style={{ width: 18, height: 18 }} className="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18">
                        <img src={googleLogo} alt={Locales.strings.google_logo} />
                    </div>
                </div>
                <span style={{ fontSize: 14, lineHeight: '38px' }} className="abcRioButtonContents">
                    <span id="not_signed_insn584fxcersa">Google</span>
                </span>
            </div>
        </div>
    );

    renderMicrosoftBtn = () => (
        <button
            id={this.MS_SIGN_IN}
            className={`abcRioButton abcRioButtonBlue ${signIn.microsoftContainer}`}
            type="button"
            onClick={this.startMicrosoftSignIn}
            onKeyPress={passEventForKeys(this.startMicrosoftSignIn)}
        >
            <img src={microsoftLogo} alt={Locales.strings.ms_logo} />
        </button>
    )

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className={signIn.container}>
                <Helmet>
                    <title>
                        {Locales.strings.sign_in}
                        {' '}
                        -
                        {' '}
                        {Locales.strings.mathshare_benetech}
                    </title>
                </Helmet>
                <div className={signIn.content}>
                    <div className={signIn.logo}>
                        <img src={logo} alt={Locales.strings.logo} />
                    </div>
                    <div className={signIn.text}>{Locales.strings.login_using}</div>
                    <div className={signIn.buttonsContainer}>
                        <div>{this.renderGoogleBtn()}</div>
                        <div>{this.renderMicrosoftBtn()}</div>
                    </div>
                    <UncontrolledTooltip placement="top" target={this.GOOGLE_SIGN_IN} />
                    <UncontrolledTooltip placement="top" target={this.MS_SIGN_IN} />
                    <button
                        id="goBack"
                        className={`${signIn.text} ${signIn.pointer} reset-btn`}
                        onClick={this.goBack}
                        onKeyPress={this.goBack}
                        type="button"
                    >
                        <u>{Locales.strings.continue_without_signin_in}</u>
                    </button>
                    <UncontrolledTooltip placement="top" target="goBack" />
                </div>
            </div>
        );
    }
}

export default connect(
    () => ({}),
    {
        checkMsLogin,
        checkGoogleLogin,
        setUserProfile,
    },
)(SignIn);
