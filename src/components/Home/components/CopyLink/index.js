import React, { Component } from 'react';
import Locales from '../../../../strings';
import Button from '../../../Button';

export default class CopyLink extends Component {
    constructor(props) {
        super(props);
        this.id = Math.round(Math.random() * 1000);
        this.containerId = this.injectionContainer || `CopyLinkContainer-${this.id}`;
    }

    copyShareLink = () => {
        const currentActiveElement = document.activeElement;
        if (this.props.shareLinkId) {
            const copyText = document.getElementById(this.props.shareLinkId);
            copyText.select();
            document.execCommand('copy');
        } else {
            const copyText = document.createElement('textarea');
            copyText.textContent = this.props.shareLink;
            copyText.setAttribute('readonly', '');
            document.getElementById('ProblemSetShareModal').appendChild(copyText);
            copyText.select();
            document.execCommand('copy');
            document.getElementById('ProblemSetShareModal').removeChild(copyText);
        }
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
            <>
                <span id={this.containerId} />
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
            </>
        );
    }
}
