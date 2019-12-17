import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import { UncontrolledTooltip } from 'reactstrap';
import {
    setUserProfile,
    checkUserLogin,
} from '../../redux/userProfile/actions';
import { API_URL } from '../../config';
import Locales from '../../strings';
import logo from '../../../images/logo-black.png';
import googleLogo from '../../../images/google-logo.svg';
import microsoftLogo from '../../../images/microsoft-logo.svg';
import signIn from './styles.scss';
import { passEventForKeys } from '../../services/events';
import SkipContent from '../Home/components/SkipContent';

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
        toast.dismiss('login-alert');
    }

    onSuccess = (service, email, name, image) => {
        this.props.setUserProfile(email, name, image, service);
    };

    getPrev = (routerHistory) => {
        let path = '#/app';
        if (routerHistory.prev && routerHistory.prev !== '#/signIn' && routerHistory.prev !== '#/signUp') {
            path = routerHistory.prev;
        }
        return `${window.location.origin}/${path}`;
    }

    renderGoogleBtn = routerHistory => (
        <a
            id={this.GOOGLE_SIGN_IN}
            className={`${signIn.googleBtn} abcRioButton abcRioButtonBlue`}
            href={`${API_URL}/login/google?return=${encodeURIComponent(this.getPrev(routerHistory))}`}
        >
            <span className="abcRioButtonContentWrapper">
                <span className="abcRioButtonIcon" style={{ padding: 10 }}>
                    <span className="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18">
                        <img src={googleLogo} alt="" />
                    </span>
                </span>
                <span style={{ fontSize: 14, lineHeight: '38px' }} className="abcRioButtonContents">
                    <span id="not_signed_insn584fxcersa">{Locales.strings.google}</span>
                </span>
            </span>
        </a>
    );

    renderMicrosoftBtn = routerHistory => (
        <a
            id={this.MS_SIGN_IN}
            className={signIn.microsoftContainer}
            href={`${API_URL}/login/azuread-openidconnect?return=${encodeURIComponent(this.getPrev(routerHistory))}`}
        >
            <img src={microsoftLogo} alt="" />
            <span>{Locales.strings.ms}</span>
        </a>
    )

    goBack = () => {
        this.props.history.goBack();
    };

    render() {
        const { isSignUp, routerHistory, userProfile } = this.props;
        let mainText = Locales.strings.sign_in;
        if (isSignUp) {
            mainText = Locales.strings.sign_up;
        }
        if (userProfile.email) {
            return <Redirect to="/app" />;
        }
        return (
            <div className={signIn.container}>
                <SkipContent />
                <Helmet>
                    <title>
                        {`${mainText} - ${Locales.strings.mathshare_benetech}`}
                    </title>
                </Helmet>
                <div id="mainContainer" className={signIn.content}>
                    <div className={signIn.logo}>
                        <img src={logo} alt={Locales.strings.mathshare_logo} />
                    </div>
                    <h1 className={signIn.header} tabIndex={-1}>{mainText}</h1>
                    <h2 id="signInServices" className={signIn.text}>
                        {isSignUp ? Locales.strings.sign_up_using : Locales.strings.login_using}
                    </h2>
                    <ul className={signIn.buttonsContainer} aria-labelledby="signInServices">
                        <li>
                            {this.renderGoogleBtn(routerHistory)}
                            <UncontrolledTooltip placement="top" target={this.GOOGLE_SIGN_IN} />
                        </li>
                        <li>
                            {this.renderMicrosoftBtn(routerHistory)}
                            <UncontrolledTooltip placement="top" target={this.MS_SIGN_IN} />
                        </li>
                    </ul>
                    <button
                        id="goBack"
                        className={`${signIn.text} ${signIn.pointer} reset-btn`}
                        onClick={this.goBack}
                        onKeyPress={passEventForKeys(this.goBack)}
                        type="button"
                        role="link"
                    >
                        <u>
                            {isSignUp ? Locales.strings.continue_without_signing_up
                                : Locales.strings.continue_without_signing_in}
                        </u>
                    </button>
                    <UncontrolledTooltip placement="top" target="goBack" />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        routerHistory: state.routerHooks,
        userProfile: state.userProfile,
    }),
    {
        checkUserLogin,
        setUserProfile,
        push,
    },
)(SignIn);
