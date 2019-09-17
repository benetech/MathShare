import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import editor from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';
import googleAnalytics from '../../../../scripts/googleAnalytics';

export default class NewProblemSetShareModal extends Component {
    componentWillMount() {
        const { shareLink } = this.props;
        if (shareLink) {
            googleAnalytics(Locales.strings.share_problem_set);
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
                            {Locales.strings.share_permalink}
                            :
                            {'\u00A0'}
                        </h3>
                        <div className={editor.modalMessage}>
                            <p>{Locales.strings.copy_this_link}</p>
                        </div>
                        <input type="text" readOnly value={this.props.shareLink} id="shareLink" className={editor.shareLink} />
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
