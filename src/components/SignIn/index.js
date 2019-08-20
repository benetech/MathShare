import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import msalConfig from '../../constants/msal';
import { setUserProfile, checkGoogleLogin, checkMsLogin } from '../../redux/userProfile/actions';
import logo from '../../../images/logo-black.png';
import googleLogo from '../../../images/google-logo.svg';
import microsoftLogo from '../../../images/microsoft-logo.svg';
// eslint-disable-next-line no-unused-vars
import signIn from './styles.scss';


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
        }).catch((error) => {
            console.log(error);
        });
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
                        <img src={googleLogo} alt="google logo" />
                    </div>
                </div>
                <span style={{ fontSize: 14, lineHeight: '38px' }} className="abcRioButtonContents">
                    <span id="not_signed_insn584fxcersa">Google</span>
                </span>
            </div>
        </div>
    );

    renderMicrosoftBtn = () => (
        <div
            id={this.MS_SIGN_IN}
            className={`abcRioButton abcRioButtonBlue ${signIn.microsoftContainer}`}
            role="button"
            onClick={this.startMicrosoftSignIn}
            onKeyPress={this.startMicrosoftSignIn}
            tabIndex={0}
        >
            <img src={microsoftLogo} alt="microsoft logo" />
        </div>
    )

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className={signIn.container}>
                <div className={signIn.content}>
                    <div className={signIn.logo}>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className={signIn.text}>Login using</div>
                    <div className={signIn.buttonsContainer}>
                        <div>{this.renderGoogleBtn()}</div>
                        <div>{this.renderMicrosoftBtn()}</div>
                    </div>
                    <UncontrolledTooltip placement="top" target={this.GOOGLE_SIGN_IN} />
                    <UncontrolledTooltip placement="top" target={this.MS_SIGN_IN} />
                    <div
                        id="goBack"
                        className={`${signIn.text} ${signIn.pointer}`}
                        onClick={this.goBack}
                        onKeyPress={this.goBack}
                        role="link"
                        tabIndex={0}
                    >
                        <u>Continue without signin in</u>
                    </div>
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