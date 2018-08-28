import React, { Component } from "react";
import editor from './styles.css';
import Locales from '../../strings';
import AriaModal from "react-aria-modal";
import Button from '../Button';
import classNames from "classnames";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class ShareModal extends Component {

    copyShareLink() {
        var copyText = document.getElementById("shareLink");
        copyText.select();
        document.execCommand("copy");
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
                    <input type="text" value={this.props.shareLink} id="shareLink" className={editor.shareLink}/>
                </div>
                <footer className={editor.modalFooter}>
                    <Button
                        className={classNames(bootstrap.btn, bootstrap['btn-primary'], editor.button)}
                        ariaHidden="false"
                        type="button"
                        icon="copy"
                        content={Locales.strings.copy}
                        onClick={() => this.copyShareLink()}/>
                    <Button
                        id="deactivate"
                        className={classNames(bootstrap.btn, bootstrap['btn-primary'])}
                        ariaHidden="false"
                        type="button"
                        icon="close"
                        content={Locales.strings.close}
                        onClick={this.props.deactivateModal}/>
                </footer>
                </div>
            </AriaModal>
        );
    }
}
