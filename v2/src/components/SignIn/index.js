import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import Locales from '../../strings';
import signIn from './styles.scss';
import { passEventForKeys } from '../../services/events';
import SignInCore from './core';

class SignIn extends Component {
    goBack = () => {
        const { routerHistory } = this.props;
        if (routerHistory.prev === '/#/' || routerHistory.prev === `/${window.location.hash}`) {
            this.props.history.push('app');
        } else {
            this.props.history.goBack();
        }
    };

    render() {
        const { router, userProfile } = this.props;
        const isSignUp = router.location.pathname.toLowerCase() === '/signup';
        let mainText = Locales.strings.sign_in;
        let header = Locales.strings.login_using;
        let benefitsText = Locales.strings.benefits_of_logging_in;
        if (isSignUp) {
            mainText = Locales.strings.sign_up;
            header = Locales.strings.sign_up_using;
            benefitsText = Locales.strings.benefits_of_signing_up;
        }
        if (userProfile.email) {
            return <Redirect to="/" />;
        }
        return (
            <main className={signIn.container}>
                <Helmet>
                    <title>
                        {`${mainText} - ${Locales.strings.mathshare_benetech}`}
                    </title>
                </Helmet>
                <div id="mainContainer" className={signIn.content}>
                    <SignInCore
                        header={header}
                        benefitsText={benefitsText}
                    >
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
                    </SignInCore>
                </div>
            </main>
        );
    }
}

export default connect(
    state => ({
        routerHistory: state.routerHooks,
        userProfile: state.userProfile,
        router: state.router,
    }),
    {
        push,
    },
)(SignIn);
