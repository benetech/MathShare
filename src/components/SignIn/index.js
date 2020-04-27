import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import { UncontrolledTooltip } from 'reactstrap';
import Locales from '../../strings';
import signIn from './styles.scss';
import { passEventForKeys } from '../../services/events';
import SkipContent from '../Home/components/SkipContent';
import SignInCore from './core';

class SignIn extends Component {
    goBack = () => {
        this.props.history.goBack();
    };

    render() {
        const { isSignUp, userProfile } = this.props;
        let mainText = Locales.strings.sign_in;
        if (isSignUp) {
            mainText = Locales.strings.sign_up;
        }
        if (userProfile.email) {
            return <Redirect to="/app" />;
        }
        return (
            <main className={signIn.container}>
                <SkipContent />
                <Helmet>
                    <title>
                        {`${mainText} - ${Locales.strings.mathshare_benetech}`}
                    </title>
                </Helmet>
                <div id="mainContainer" className={signIn.content}>
                    <SignInCore
                        header={isSignUp ? Locales.strings.sign_up : Locales.strings.sign_in}
                        subHeader={
                            isSignUp ? Locales.strings.sign_up_using : Locales.strings.login_using
                        }
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
                        <UncontrolledTooltip placement="top" target="goBack" />
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
    }),
    {
        push,
    },
)(SignIn);
