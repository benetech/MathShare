import React, { Component } from "react";
import MyWorkControlBtn from "../MyWorkControlBtn"
import classNames from "classnames";
import editorButtons from './styles.css';
import styles from '../../../../../../styles/styles.css';
import buttons from '../../../../../../styles/buttons.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyWorkEditorButtons extends Component {
    render() {
        return (
            <div
                id="editorButtons"
                className={
                    classNames(
                        bootstrap['d-flex'],
                        bootstrap['flex-nowrap'],
                        bootstrap['justify-content-between']
                    )
                }
            >
                <div>
                    <br />
                    <MyWorkControlBtn
                        id="scratch-pad-button"
                        className={[
                            bootstrap.btn,
                            buttons.scratch,
                            buttons.default,
                            buttons.background,
                            buttons.palette,
                            editorButtons.withBottomMargin
                        ]}
                        toggle="tooltip"
                        title="Display/hide sketch pad"
                    />
                </div>
                <div>
                    <MyWorkControlBtn
                        id="undoDelete"
                        className={[
                            bootstrap.btn,
                            bootstrap['pull-right'],
                            buttons.undo,
                            buttons.background,
                            buttons.palette,
                            editorButtons.withBottomMargin
                        ]}
                        toggle="tooltip"
                        title="Undo Last Delete"
                    //TODO onclick=UndoDeleteStep();
                    />
                    <br />
                    <h3 className={styles.sROnly}>Clean up and add new step</h3>
                    <MyWorkControlBtn
                        id="addStep"
                        className={[
                            bootstrap.btn,
                            bootstrap['btn-success'],
                            styles.pointer,
                            editorButtons.editorBtn
                        ]}
                        toggle="tooltip"
                        title="Clean up the cross outs and start a new step (⌨: shift+enter)"
                        content=" Add Step"
                        step="3"
                        intro="Clean-up your work and start a new step."
                        icon="plus"
                    //TODO onclick="AddStep();"
                    />
                    <div hidden id="updateControls">
                        <h3 className={styles.sROnly}>Update the step</h3>
                        <MyWorkControlBtn
                            id="updateStep"
                            className={[
                                bootstrap.btn,
                                bootstrap['btn-success'],
                                styles.pointer,
                                editorButtons.editorBtn
                            ]}
                            toggle="tooltip"
                            title="Update the step (⌨: shift+enter)"
                            content=" Update Step"
                            step="3"
                            intro="Update the step."
                            icon="pencil"
                        />
                        <br />
                        <h3 className={styles.sROnly}>Cancel edit</h3>
                        <MyWorkControlBtn
                            id="cancelEdit"
                            className={[
                                bootstrap.btn,
                                buttons.default,
                                styles.pointer,
                                editorButtons.editorBtn
                            ]}
                            toggle="tooltip"
                            title="Cancel edit"
                            content=" Cancel edit"
                            step="3"
                            intro="Cancel edit."
                            icon="ban"
                        //TODO onclick="ExitUpdate();"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
