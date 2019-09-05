import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { UncontrolledTooltip } from 'reactstrap';
import {
    setUserProfile,
    checkUserLogin,
} from '../../redux/userProfile/actions';
import { API_URL } from '../../config';
import logo from '../../../images/logo-black.png';
import googleLogo from '../../../images/google-logo.svg';
import microsoftLogo from '../../../images/microsoft-logo.svg';
// eslint-disable-next-line no-unused-vars
import signIn from './styles.scss';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            googleSignInInitialized: true,
        };
        this.GOOGLE_SIGN_IN = 'googleSignIn';
        this.MS_SIGN_IN = 'msSignIn';
    }

    componentDidMount() {
        this.props.checkUserLogin();
    }

    startMicrosoftSignIn = () => {
        const { routerHistory } = this.props;
        window.location.assign(
            `${API_URL}/login/azuread-openidconnect?return=${encodeURIComponent(routerHistory.prev)}`,
        );
    };

    startGoogleSignIn = () => {
        const { routerHistory } = this.props;
        window.location.assign(
            `${API_URL}/login/google?return=${encodeURIComponent(routerHistory.prev)}`,
        );
    }

    onSuccess = (service, email, name, image) => {
        this.props.setUserProfile(email, name, image, service);
    };

    renderGoogleBtn = () => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div
            id={this.GOOGLE_SIGN_IN}
            tabIndex={0}
            role="button"
            style={{ height: 40, width: 120 }}
            className="abcRioButton abcRioButtonBlue"
            onClick={this.startGoogleSignIn}
            onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    this.startGoogleSignIn();
                }
            }}
        >
            <div className="abcRioButtonContentWrapper">
                <div className="abcRioButtonIcon" style={{ padding: 10 }}>
                    <div
                        style={{ width: 18, height: 18 }}
                        className="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18"
                    >
                        <img src={googleLogo} alt="google logo" />
                    </div>
                </div>
                <span
                    style={{ fontSize: 14, lineHeight: '38px' }}
                    className="abcRioButtonContents"
                >
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
            onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    this.startMicrosoftSignIn();
                }
            }}
            tabIndex={0}
        >
            <img src={microsoftLogo} alt="microsoft logo" />
        </div>
    );

    goBack = () => {
        this.props.history.goBack();
    };

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
    state => ({
        routerHistory: state.routerHooks,
    }),
    {
        checkUserLogin,
        setUserProfile,
        push,
    },
)(SignIn);
