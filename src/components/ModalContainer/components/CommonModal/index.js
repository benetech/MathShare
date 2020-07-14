import React from 'react';
import AriaModal from 'react-aria-modal';
import { commonElementFinder } from '../../../../services/misc';

const DEFAULT_HEADER = 'modalHeader';

export const CommonModalHeader = props => (
    <h1 {...props} id={props.id || DEFAULT_HEADER} tabIndex={-1}>{props.children}</h1>
);

const handleModalExit = props => () => {
    const focusElement = props.focusOnExit;
    props.deactivateModal();
    if (focusElement) {
        setImmediate(() => {
            commonElementFinder.tryToFind(focusElement);
        }, 0);
    }
};

const CommonModal = props => (
    <AriaModal
        titleId={props.modalHeader || DEFAULT_HEADER}
        initialFocus={props.initialFocus || `#${props.modalHeader || DEFAULT_HEADER}`}
        onExit={handleModalExit(props)}
        getApplicationNode={props.getApplicationNode}
        underlayStyle={{ paddingTop: '2em' }}
    >
        {props.children}
    </AriaModal>
);

export default CommonModal;
