import React, { Component } from 'react';
import Locales from '../../../../strings';
import Button from '../../../Button';
import styles from './styles.scss';

export default class CopyLink extends Component {
    constructor(props) {
        super(props);
        this.id = Math.round(Math.random() * 1000);
        this.state = {
            css: {},
        };
        this.updateScrollHeight();
    }

    selectTextInput = event => event.target.select();

    copyShareLink = () => {
        const currentActiveElement = document.activeElement;
        const copyText = document.getElementById(`copyUrl-${this.id}`);
        copyText.select();
        document.execCommand('copy');
        this.props.clearAriaLive();
        this.props.announceOnAriaLive(this.props.announceText);
        if (this.props.copyLinkCallback) {
            this.props.copyLinkCallback();
        }
        if (currentActiveElement) {
            currentActiveElement.focus();
        }
    }

    updateScrollHeight = () => {
        const textEle = document.getElementById(`copyUrl-${this.id}`);
        if (textEle) {
            const height = textEle.scrollHeight;
            this.setState({ css: { height: `${height}px` } }, () => {
                setTimeout(this.updateScrollHeight, 50);
            });
        } else {
            setTimeout(this.updateScrollHeight, 100);
        }
    }

    render() {
        return (
            <div className={styles.btnContainer}>
                <label htmlFor={`copyUrl-${this.id}`} className="sROnly">
                    {Locales.strings.work_link}
                </label>
                <textarea
                    id={`copyUrl-${this.id}`}
                    className={styles.textArea}
                    value={this.props.shareLink}
                    readOnly
                    onFocus={this.selectTextInput}
                    onClick={this.sendResumeLinkClickEvent}
                    style={this.state.css}
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
