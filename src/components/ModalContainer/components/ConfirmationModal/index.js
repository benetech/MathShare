import React, { Component } from "react";
import modalStyles from './styles.css';
import AriaModal from "react-aria-modal";
import Button from '../../../Button';
import classNames from "classnames";

export default class ConfirmationModal extends Component {

    render() {
        return (
            <AriaModal
                titleId="confirmationModal"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
                focusDialog={true}
                >
                <div id="demo-one-modal" className={modalStyles.modal}>
                <div className={modalStyles.modalHeader}>
                    <h3>
                        {this.props.title}
                    </h3>
                </div>
                <footer className={modalStyles.modalFooter}>
                    <Button
                        className={classNames('btn', modalStyles.button, modalStyles.discardButton)}
                        ariaHidden="false"
                        type="button"
                        icon="times"
                        content={this.props.redButtonLabel}
                        onClick={this.props.redButtonCallback}/>
                    <Button
                        id="deactivate"
                        className={classNames('btn', modalStyles.button, modalStyles.saveButton)}
                        ariaHidden="false"
                        type="button"
                        icon="save"
                        content={this.props.greenButtonLabel}
                        onClick={this.props.greenButtonCallback}/>
                </footer>
                </div>
            </AriaModal>
        );
    }
}
