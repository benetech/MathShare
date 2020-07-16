import React from 'react';
import classNames from 'classnames';
import modalStyles from './styles.scss';
import Button from '../../../Button';
import CommonModal, { CommonModalHeader, AriaModalDefaultProps } from '../CommonModal';

class ConfirmationModal extends CommonModal {
    render() {
        return (
            <AriaModalDefaultProps
                handleModalExit={this.handleModalExit}
                {...this.props}
            >
                <div id="confirmationModal" className={modalStyles.modal}>
                    <div className={modalStyles.modalHeader}>
                        <CommonModalHeader>
                            {this.props.title}
                        </CommonModalHeader>
                    </div>
                    <div className={modalStyles.modalFooter}>
                        <Button
                            id="discardButton"
                            className={classNames('btn', modalStyles.button, modalStyles.discardButton)}
                            ariaHidden="false"
                            type="button"
                            icon="times"
                            content={this.props.redButtonLabel}
                            onClick={this.handleModalExit(
                                this.props.redButtonCallback, this.props.dontToggleOnRed,
                            )}
                        />
                        <Button
                            id="deactivate"
                            className={classNames('btn', modalStyles.button, modalStyles.saveButton)}
                            ariaHidden="false"
                            type="button"
                            icon="save"
                            content={this.props.greenButtonLabel}
                            onClick={this.handleModalExit(this.props.greenButtonCallback, true)}
                        />
                    </div>
                </div>
            </AriaModalDefaultProps>
        );
    }
}

export default ConfirmationModal;
