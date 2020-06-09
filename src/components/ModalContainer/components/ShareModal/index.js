import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import { IntercomAPI } from 'react-intercom';
import editor from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';
import googleAnalytics from '../../../../scripts/googleAnalytics';

export default class ShareModal extends Component {
    componentWillMount() {
        const { shareLink } = this.props;
        if (shareLink) {
            googleAnalytics(Locales.strings.share_problem_set);
            IntercomAPI('trackEvent', 'submit-problem-set-link');
        }
    }

    copyShareLink = () => {
        const copyText = document.getElementById('shareLink');
        copyText.select();
        document.execCommand('copy');
    }

    render() {
        return (
            <AriaModal
                titleId="shareModalHeader"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="shareModal" className={editor.modal}>
                    <div className={editor.modalBody}>
                        <h1 id="shareModalHeader">
                            {Locales.strings.share_link}
                        </h1>
                        <input type="text" readOnly value={this.props.shareLink} id="shareLink" className={editor.shareLink} />
                        <div className={editor.modalMessage}>
                            <p>
                                {Locales.strings.use_this_link_share}
                                {' '}
                                <b>{Locales.strings.finished}</b>
                                {' '}
                                {Locales.strings.work}
                            </p>
                            <p>{Locales.strings.if_you_want_to_continue}</p>
                        </div>
                    </div>
                    <div className={editor.modalFooter}>
                        <Button
                            id="copy_button"
                            className={classNames('btn', 'btn-primary', editor.button)}
                            ariaHidden="false"
                            type="button"
                            icon="copy"
                            content={Locales.strings.copy}
                            onClick={() => this.copyShareLink()}
                        />
                        <Button
                            id="deactivate"
                            className={classNames('btn', 'btn-primary')}
                            ariaHidden="false"
                            type="button"
                            icon="times"
                            content={Locales.strings.close}
                            onClick={this.props.deactivateModal}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}
