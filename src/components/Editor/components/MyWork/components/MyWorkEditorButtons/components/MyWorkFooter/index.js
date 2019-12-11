import React from 'react';
import classNames from 'classnames';
import Button from '../../../../../../../Button';
import footer from './styles.scss';
import Locales from '../../../../../../../../strings';

const MyWorkFooter = (props) => {
    const btnClassNames = [
        'btn',
        'pointer',
        footer.button,
    ];

    const deleteButton = props.showDelete && !props.addingProblem
        ? (
            <Button
                id="deleteButton"
                className={btnClassNames}
                spanStyle="order-2"
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
            spanStyle="order-2"
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
                spanStyle="order-1"
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
                spanStyle="order-1"
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
                spanStyle="order-1"
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

    const undoButton = (
        <Button
            id="undoStep"
            className={btnClassNames}
            spanStyle="order-0"
            additionalStyles={['undo']}
            toggle="tooltip"
            title={Locales.strings.undo_step}
            content={Locales.strings.undo_step}
            step="3"
            intro={Locales.strings.undo_step}
            icon="undo"
            onClick={() => {
                const editor = document.getElementById('mathEditorActive');
                if (editor && editor.mathfield) {
                    const { undoManager } = editor.mathfield;
                    if (undoManager) {
                        if (undoManager.index > 1) {
                            editor.mathfield.$perform('undo');
                            return;
                        }
                    }
                }
                document.execCommand('undo', false, null);
            }}
        />
    );

    return (
        <section
            id="control-buttons"
            className={
                classNames(
                    footer.footer,
                    'flex-wrap-reverse',
                )
            }
            aria-label={Locales.strings.editor_actions}
        >
            {undoButton}
            {confirmButton}
            {props.editing ? cancelButton : deleteButton}
        </section>
    );
};

export default MyWorkFooter;
