import React from 'react';
import classNames from 'classnames';
import Button from '../../../../../../../Button';
import footer from './styles.css';
import Locales from '../../../../../../../../strings';

const MyWorkFooter = (props) => {
    const btnClassNames = [
        'btn',
        'pointer',
        footer.button,
    ];

    const undoButton = props.showUndo && !props.addingProblem
        ? (
            <Button
                id="undoButton"
                className={btnClassNames}
                additionalStyles={['withRightMargin', 'undo']}
                content={Locales.strings.delete_step}
                icon="minus"
                title={Locales.strings.undo_last_action}
                onClick={props.undoLastActionCallback}
            />
        ) : null;

    const cancelButton = (
        <Button
            id="cancelButton"
            className={btnClassNames}
            additionalStyles={['withRightMargin', 'undo']}
            content={Locales.strings.cancel}
            icon="ban"
            title={Locales.strings.cancel_edit_step}
            onClick={props.cancelEditCallback}
        />
    );

    let confirmButton;
    if (props.editing) {
        confirmButton = (
            <Button
                id="addStep"
                className={btnClassNames}
                additionalStyles={['addStep']}
                toggle="tooltip"
                title={Locales.strings.update_step_button_title}
                content={Locales.strings.update_step}
                step="3"
                intro={Locales.strings.update_step_intro}
                icon="pencil"
                onClick={() => props.updateCallback()}
            />
        );
    } else if (props.editingProblem) {
        confirmButton = (
            <Button
                id="addStep"
                className={btnClassNames}
                additionalStyles={['addStep']}
                toggle="tooltip"
                title={Locales.strings.update_problem_button_title}
                content={Locales.strings.update_problem}
                step="3"
                intro={Locales.strings.update_problem_intro}
                icon="pencil"
                onClick={() => props.updateCallback()}
            />
        );
    } else {
        confirmButton = (
            <Button
                id="addStep"
                className={btnClassNames}
                additionalStyles={['addStep']}
                hide={props.editing}
                toggle="tooltip"
                title={props.addingProblem ? Locales.strings.add_problem_button_title
                    : Locales.strings.add_step_button_title}
                content={props.addLabel}
                step="3"
                intro={Locales.strings.add_step_intro}
                icon="plus"
                onClick={() => props.addStepCallback()}
            />
        );
    }

    return (
        <div
            id="control-buttons"
            className={
                classNames(
                    footer.footer,
                )
            }
        >
            {props.editing ? cancelButton : undoButton}
            {confirmButton}
        </div>
    );
};

export default MyWorkFooter;
