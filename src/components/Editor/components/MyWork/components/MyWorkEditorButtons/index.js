import React, { Component } from "react";
import Button from "../../../../../../components/Button"
import classNames from "classnames";
import editorButtons from './styles.css';
import styles from '../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Painterro from 'painterro'
import painterroConfiguration from './painterroConfiguration.json'

export default class MyWorkEditorButtons extends Component {
    constructor(props) {
        super(props);
        this.scratchPadPainterro;
    }

    handleClick(scratchPadPainterro) {
        $('#scratch-pad-containter').slideToggle("fast", function () {
            if ($("#scratch-pad-containter").is(":visible")) {
                scratchPadPainterro.adjustSizeFull();
            }
        });
    }

    InitScratchPad() {
        this.scratchPadPainterro = Painterro(painterroConfiguration);

        this.scratchPadPainterro.show();
        $('#scratch-pad-containter').hide();

        $('#scratch-pad-containter-bar > div > span').first()
            .append('<button id="clear-button" type="button" class="ptro-icon-btn ptro-color-control" title="Clear the scratch pad"><i class="ptro-icon ptro-icon-close"></i></button>');
        $('#clear-button').click(() =>
            this.ClearAndResizeScrachPad(this.scratchPadPainterro)
        );
        $('.ptro-icon-btn').css('border-radius', '.25rem');
        $('.ptro-bordered-btn').css('border-radius', '.5rem');
        $('.ptro-info').hide();
    }

    ClearAndResizeScrachPad(scratchPadPainterro) {
        scratchPadPainterro.clear();
    }

    componentDidMount() {
        this.InitScratchPad();
    }

    render() {
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
                            title="Display/hide sketch pad"
                            onClick={() => this.handleClick(this.scratchPadPainterro)}
                        />
                    </div>
                    <div>
                        <Button
                            id="undoDelete"
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
                            title="Undo Last Delete"
                        //TODO onclick=UndoDeleteStep();
                        />
                        <br />
                        <h3 className={styles.sROnly}>Clean up and add new step</h3>
                        <Button
                            id="addStep"
                            className={[
                                bootstrap.btn,
                                bootstrap['btn-primary'],
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
                            <Button
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
                            <Button
                                id="cancelEdit"
                                className={[
                                    bootstrap.btn,
                                    styles.pointer,
                                    editorButtons.editorBtn
                                ]}
                                additionalStyles={['default']}
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
            </div>
        );
    }
}