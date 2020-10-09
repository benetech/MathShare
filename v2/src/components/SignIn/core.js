import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
    setUserProfile,
    checkUserLogin,
} from '../../redux/userProfile/actions';
import { API_URL } from '../../config';
import Locales from '../../strings';
import googleLogo from '../../../../images/google-logo.svg';
import microsoftLogo from '../../../../images/microsoft-logo.svg';
import signIn from './styles.scss';

class SignInCore extends Component {
    GOOGLE_SIGN_IN = 'googleSignIn';

    MS_SIGN_IN = 'msSignIn';

    componentDidMount() {
        this.props.checkUserLogin();
    }

    onSuccess = (service, email, name, image) => {
        this.props.setUserProfile(email, name, image, service);
        this.props.markUserResolved(true);
    };

    getReturnUrl = (routerHistory) => {
        let path = '/#/app';
        if (routerHistory.current !== '/#/signIn' && routerHistory.prev !== '/#/signUp') {
            path = routerHistory.current;
        } else if (
            routerHistory.prev && routerHistory.prev !== '/#/signIn'
            && routerHistory.prev !== '/#/signUp' && routerHistory.prev !== '/#/'
        ) {
            path = routerHistory.prev;
        }
        return `${window.location.origin}${path}`;
    }

    renderGoogleBtn = routerHistory => (
        <a
            id={this.GOOGLE_SIGN_IN}
            className={`${signIn.googleBtn} abcRioButton abcRioButtonBlue`}
            href={`${API_URL}/login/google?return=${encodeURIComponent(this.getReturnUrl(routerHistory))}`}
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
            href={`${API_URL}/login/azuread-openidconnect?return=${encodeURIComponent(this.getReturnUrl(routerHistory))}`}
        >
            <img src={microsoftLogo} alt="" />
            <span>{Locales.strings.ms}</span>
        </a>
    )

    render() {
        const {
            routerHistory, userProfile, header, benefitsText,
        } = this.props;

        if (userProfile.email) {
            return <p>Already logged in</p>;
        }
        return (
            <>
                <div className={signIn.logo}>
                    <img
                        src="https://mathshare-qa.diagramcenter.org/images/logo-black.png"
                        alt={Locales.strings.mathshare_logo}
                    />
                </div>
                <h1 id="signInServices" className={signIn.header} tabIndex={-1}>{header}</h1>
                <ul className={signIn.buttonsContainer} aria-labelledby="signInServices">
                    <li>
                        {this.renderGoogleBtn(routerHistory)}
                    </li>
                    <li>
                        {this.renderMicrosoftBtn(routerHistory)}
                    </li>
                </ul>
                <a className={signIn.benefitsLink} href="https://intercom.help/benetech/en/articles/3754980-benefits-of-having-a-user-account">
                    {benefitsText}
                </a>
                {this.props.children}
            </>
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
)(SignInCore);
