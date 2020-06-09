import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import classNames from 'classnames';
import modalStyles from './styles.scss';
import Button from '../../../Button';

export default class ConfirmationModal extends Component {
    render() {
        return (
            <AriaModal
                titleId="modalHeader"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
                focusDialog
            >
                <div id="confirmationModal" className={modalStyles.modal}>
                    <div className={modalStyles.modalHeader}>
                        <h1 id="modalHeader">
                            {this.props.title}
                        </h1>
                    </div>
                    <div className={modalStyles.modalFooter}>
                        <Button
                            id="discardButton"
                            className={classNames('btn', modalStyles.button, modalStyles.discardButton)}
                            ariaHidden="false"
                            type="button"
                            icon="times"
                            content={this.props.redButtonLabel}
                            onClick={this.props.redButtonCallback}
                        />
                        <Button
                            id="deactivate"
                            className={classNames('btn', modalStyles.button, modalStyles.saveButton)}
                            ariaHidden="false"
                            type="button"
                            icon="save"
                            content={this.props.greenButtonLabel}
                            onClick={this.props.greenButtonCallback}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}
