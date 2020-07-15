import React from 'react';
import classNames from 'classnames';
import modalStyles from './styles.scss';
import Button from '../../../Button';
import CommonModal, { CommonModalHeader } from '../CommonModal';

const ConfirmationModal = props => (
    <CommonModal
        deactivateModal={props.deactivateModal}
        focusOnExit={props.focusOnExit}
    >
        <div id="confirmationModal" className={modalStyles.modal}>
            <div className={modalStyles.modalHeader}>
                <CommonModalHeader>
                    {props.title}
                </CommonModalHeader>
            </div>
            <div className={modalStyles.modalFooter}>
                <Button
                    id="discardButton"
                    className={classNames('btn', modalStyles.button, modalStyles.discardButton)}
                    ariaHidden="false"
                    type="button"
                    icon="times"
                    content={props.redButtonLabel}
                    onClick={props.redButtonCallback}
                />
                <Button
                    id="deactivate"
                    className={classNames('btn', modalStyles.button, modalStyles.saveButton)}
                    ariaHidden="false"
                    type="button"
                    icon="save"
                    content={props.greenButtonLabel}
                    onClick={props.greenButtonCallback}
                />
            </div>
        </div>
    </CommonModal>
);

export default ConfirmationModal;
