import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import editor from './styles.scss';
import Locales from '../../../../strings';
import Button from '../../../Button';

export default class SaveModal extends Component {
    copySaveLink = () => {
        const copyText = document.getElementById('saveLink');
        copyText.select();
        document.execCommand('copy');
    }

    render() {
        return (
            <AriaModal
                titleId="saveModalHeader"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="saveModal" className={editor.modal}>
                    <div className={editor.modalBody}>
                        <h1 id="saveModalHeader">
                            {Locales.strings.save_text}
                        </h1>
                        <input type="text" readOnly value={this.props.editLink} id="saveLink" className={editor.saveLink} />
                        <div className={editor.modalMessage}>
                            <p>
                                {Locales.strings.use_this_link}
                            </p>
                            <p>
                                {Locales.strings.if_you_want_a_link}
                            </p>
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
                            onClick={() => this.copySaveLink()}
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
