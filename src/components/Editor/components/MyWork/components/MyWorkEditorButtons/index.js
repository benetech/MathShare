import React, { Component } from "react";
import Button from "../../../../../../components/Button";
import classNames from "classnames";
import editorButtons from './styles.css';
import styles from '../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import MyWorkFooter from './components/MyWorkFooter';
import Locales from '../../../../../../strings';

export default class MyWorkEditorButtons extends Component {
    constructor(props) {
        super(props);

        this.addStep = this.addStep.bind(this);
    }

    componentDidMount() {
        $('#undoAction').hide();
    }

    addStep() {
        this.props.addStepCallback();
        if (this.props.textAreaValue != "") {
            this.props.clearAndResizeScratchPad();
        }
    }

    render() {
        var addLabel = this.props.addingProblem ? Locales.strings.add_problem : Locales.strings.add_step;
        return (
            <div
                id="editorButtons"
                className={
                    classNames(
                        bootstrap['d-flex'],
                        bootstrap['flex-column'],
                        bootstrap['flex-nowrap'],
                        bootstrap['justify-content-between'],
                        editorButtons.editorButtons
                    )
                }
            >
                <div className={
                    classNames(
                        bootstrap['d-flex'],
                        bootstrap['flex-nowrap'],
                        bootstrap['justify-content-between']
                    )
                }>
                    <div>
                        <br />
                        <Button
                            id="scratch-pad-button"
                            className={[
                                bootstrap.btn,
                                editorButtons.withBottomMargin
                            ]}
                            additionalStyles={[
                                'scratch',
                                'default',
                                'background',
                                'palette'
                            ]}
                            toggle="tooltip"
                            title={Locales.strings.display_hide_sketchpad}
                            onClick={() => this.props.openScratchpad()}
                        />
                    </div>
                    <div>
                        <Button
                            id="undoAction"
                            className={[
                                bootstrap.btn,
                                editorButtons.floatRight,
                                editorButtons.withBottomMargin
                            ]}
                            additionalStyles={[
                                'undo',
                                'background',
                                'palette'
                            ]}
                            toggle="tooltip"
                            title={Locales.strings.undo_last_action}
                            onClick={this.props.undoLastActionCallback}
                        />
                        <br />
                        <h3 className={styles.sROnly}>{Locales.strings.clean_up_and_add_step}</h3>
                        <Button
                            id="addStep"
                            className={[
                                bootstrap.btn,
                                bootstrap['btn-primary'],
                                styles.pointer,
                                editorButtons.editorBtn
                            ]}
                            hide={this.props.editing}
                            toggle="tooltip"
                            title={Locales.strings.clean_up_button_title}
                            content={addLabel}
                            step="3"
                            intro={Locales.strings.add_step_intro}
                            icon="plus"
                            onClick={() => this.addStep()}
                            />
                        <div id="updateControls" style={this.props.editing ? {} : {display: 'none'}} >
                            <h3 className={styles.sROnly}>{Locales.strings.update_step_intro}</h3>
                            <Button
                                id="updateStep"
                                className={[
                                    bootstrap.btn,
                                    bootstrap['btn-success'],
                                    styles.pointer,
                                    editorButtons.editorBtn
                                ]}
                                toggle="tooltip"
                                title={Locales.strings.update_step_button_title}
                                content={Locales.strings.update_step}
                                step="3"
                                intro={Locales.strings.update_step_intro}
                                icon="pencil"
                            />
                            <br />
                            <h3 className={styles.sROnly}>{Locales.strings.cancel_edit_step}</h3>
                            <Button
                                id="cancelEdit"
                                className={[
                                    bootstrap.btn,
                                    styles.pointer,
                                    editorButtons.editorBtn
                                ]}
                                additionalStyles={['default']}
                                toggle="tooltip"
                                title={Locales.strings.cancel_edit_button_title}
                                content={Locales.strings.cancel_edit_step}
                                step="3"
                                intro={Locales.strings.cancel_edit_step_intro}
                                icon="ban"
                                onClick={this.props.cancelEditCallback}
                            />
                        </div>
                    </div>
                </div>
                <MyWorkFooter
                    deleteStepsCallback={this.props.deleteStepsCallback}
                    hide={this.props.editing}
                    history={this.props.history}
                    solution={this.props.solution}
                    addingProblem={this.props.addingProblem}
                    cancelCallback={this.props.cancelCallback}
                    saveCallback={this.props.saveCallback} />
            </div>
        );
    }
}
