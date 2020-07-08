import React, { Component } from 'react';
import Locales from '../../../../strings';
import Button from '../../../Button';
import { alertSuccess } from '../../../../scripts/alert';
import styles from './styles.scss';

export default class CopyLink extends Component {
    constructor(props) {
        super(props);
        this.id = Math.round(Math.random() * 1000);
    }

    copyShareLink = () => {
        const currentActiveElement = document.activeElement;
        const copyText = document.getElementById('copyUrl');
        copyText.select();
        document.execCommand('copy');
        alertSuccess(this.props.announceText, Locales.strings.success, undefined, true);
        this.props.clearAriaLive();
        this.props.announceOnAriaLive(this.props.announceText);
        if (this.props.copyLinkCallback) {
            this.props.copyLinkCallback();
        }
        if (currentActiveElement) {
            currentActiveElement.focus();
        }
    }

    render() {
        return (
            <div className={styles.btnContainer}>
                <label htmlFor="copyUrl" className="sROnly">
                    {Locales.strings.work_link}
                </label>
                <textarea
                    id="copyUrl"
                    className={styles.textArea}
                    value={this.props.shareLink}
                    readOnly
                    onFocus={this.selectTextInput}
                    onClick={this.sendResumeLinkClickEvent}
                />
                <Button
                    id={this.props.id || `copy_button-${this.id}`}
                    icon={this.props.icon || 'link'}
                    iconSize={this.props.iconSize}
                    className={this.props.className}
                    ariaHidden="false"
                    type="button"
                    content={this.props.copyText || Locales.strings.copy_link_url}
                    onClick={() => this.copyShareLink()}
                />
            </div>
        );
    }
}
