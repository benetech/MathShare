import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import { commonElementFinder } from '../../../../services/misc';

const DEFAULT_HEADER = 'modalHeader';

export const CommonModalHeader = props => (
    <h1 {...props} id={props.id || DEFAULT_HEADER} tabIndex={-1}>{props.children}</h1>
);

export const AriaModalDefaultProps = props => (
    <AriaModal
        titleId={props.modalHeader || DEFAULT_HEADER}
        initialFocus={props.initialFocus || `#${props.modalHeader || DEFAULT_HEADER}`}
        onExit={props.handleModalExit()}
        getApplicationNode={props.getApplicationNode}
        underlayStyle={{ paddingTop: '2em' }}
    >
        {props.children}
    </AriaModal>
);

export default class CommonModal extends Component {
    deactivateModal = () => {
        this.props.toggleModals([this.props.modalId]);
    }

    handleModalExit = (callback, dontToggle) => () => {
        const { focusOnExit, modalId } = this.props;
        if (!dontToggle) {
            this.props.toggleModals([modalId]);
        }
        if (callback) {
            callback();
        }
        if (focusOnExit) {
            setImmediate(() => {
                commonElementFinder.tryToFind(focusOnExit);
            }, 0);
        }
    };
}
