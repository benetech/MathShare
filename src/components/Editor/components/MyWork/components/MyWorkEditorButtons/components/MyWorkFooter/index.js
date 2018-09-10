import React, { Component } from "react";
import Button from "../../../../../../../../components/Button";
import classNames from "classnames";
import footer from './styles.css';
import styles from '../../../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../../../../../strings';

export default class MyWorkFooter extends Component {

    render() {
        const btnClassNames = [
            bootstrap.btn,
            styles.pointer,
            footer.btn
        ];

        const undoButton = this.props.undoButton && !this.props.addingProblem ?
            <Button
                className={btnClassNames}
                additionalStyles={['withRightMargin', 'undo']}
                content={Locales.strings.undo}
                icon="reply"
                title={Locales.strings.undo_last_action}
                onClick={this.props.undoLastActionCallback}
            /> : null;

            const cancelButton =
            <Button
                    className={btnClassNames}
                    additionalStyles={['withRightMargin', 'undo']}
                    content={Locales.strings.cancel}
                    icon="ban"
                    title={Locales.strings.cancel_edit_step}
                    onClick={this.props.cancelEditCallback}
            />

        var confirmButton;
        if (this.props.editing){ 
            confirmButton = <Button	
                className={btnClassNames}
                additionalStyles={['addStep']}
                toggle="tooltip"
                title={Locales.strings.update_step_button_title}
                content={Locales.strings.update_step}
                step="3"
                intro={Locales.strings.update_step_intro}
                icon="pencil"
                onClick={() => this.props.updateCallback()} />
        } else if(this.props.editingProblem) {
            confirmButton =  <Button
                className={btnClassNames}
                additionalStyles={['addStep']}
                toggle="tooltip"
                title={Locales.strings.clean_up_button_title}
                content={Locales.strings.update_problem}
                step="3"
                intro={Locales.strings.update_problem_intro}
                icon="pencil"
                onClick={() => this.props.updateCallback()} />
        } else {
            confirmButton =  <Button
                className={btnClassNames}
                additionalStyles={['addStep']}
                hide={this.props.editing}
                toggle="tooltip"
                title={this.props.addingProblem ? Locales.strings.add_problem_button_title : Locales.strings.add_step_button_title}
                content={this.props.addLabel}
                step="3"
                intro={Locales.strings.add_step_intro}
                icon="plus"
                onClick={() => this.props.addStep()} />
        }

        return (
            <div
                id="control-buttons"
                className={
                    classNames(
                        footer.footer
                    )
                }
            >
                {this.props.editing ? cancelButton : undoButton}
                {confirmButton}
            </div>
        );
    }
}
