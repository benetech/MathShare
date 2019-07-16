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
                titleId="shareModal"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="demo-one-modal" className={editor.modal}>
                    <div className={editor.modalBody}>
                        <h3>
                            {Locales.strings.share_link}
                        </h3>
                        <input type="text" readOnly value={this.props.shareLink} id="shareLink" className={editor.shareLink} />
                        <div className={editor.modalMessage}>
                            <p>
                                Use this link to share your
                                {' '}
                                <b>finished</b>
                                {' '}
                                work
                            </p>
                            <p>
                                If you want to continue working on it later,
                                {' '}
                                use the &quot;Save&quot; button instead
                            </p>
                        </div>
                    </div>
                    <footer className={editor.modalFooter}>
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
                    </footer>
                </div>
            </AriaModal>
        );
    }
}
