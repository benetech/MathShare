import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import signInModal from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';
import SignInCore from '../../../SignIn/core';

export default class SignInModal extends Component {
    render() {
        return (
            <AriaModal
                titleId="SignInModal"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div className={signInModal.modal}>
                    <div className={signInModal.content}>
                        <SignInCore
                            header={Locales.strings.login_using}
                        />
                    </div>
                    <footer className={signInModal.modalFooter}>
                        <Button
                            id="deactivate"
                            className={classNames('btn', signInModal.dismissBtn)}
                            ariaHidden="false"
                            type="button"
                            content={Locales.strings.continue_without_signing_in}
                            onClick={this.props.deactivateModal}
                        />
                    </footer>
                </div>
            </AriaModal>
        );
    }
}
