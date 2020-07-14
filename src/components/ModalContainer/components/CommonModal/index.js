import React from 'react';
import AriaModal from 'react-aria-modal';

const DEFAULT_HEADER = 'modalHeader';

export const CommonModalHeader = props => (
    <h1 {...props} id={props.id || DEFAULT_HEADER} tabIndex={-1}>{props.children}</h1>
);

const CommonModal = props => (
    <AriaModal
        titleId={props.modalHeader || DEFAULT_HEADER}
        initialFocus={props.initialFocus || `#${props.modalHeader || DEFAULT_HEADER}`}
        onExit={props.deactivateModal}
        getApplicationNode={props.getApplicationNode}
        underlayStyle={{ paddingTop: '2em' }}
    >
        {props.children}
    </AriaModal>
);

export default CommonModal;
