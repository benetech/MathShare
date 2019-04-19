import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import editor from './styles.css';
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
                titleId="saveModal"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div id="demo-one-modal" className={editor.modal}>
                    <div className={editor.modalBody}>
                        <h3>
                            {Locales.strings.save_text}
                        </h3>
                        <input type="text" readOnly value={this.props.editLink} id="saveLink" className={editor.saveLink} />
                        <div className={editor.modalMessage}>
                            <p>
                                Use this link to save your work and return to it later
                            </p>
                            <p>
                                If you want a link to submit your finished work,
                                {' '}
                                use the &quot;Share&quot; button instead.
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
                    </footer>
                </div>
            </AriaModal>
        );
    }
}
