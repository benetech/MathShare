import React, { Component } from "react";
import Button from "../../../../../../components/Button"
import classNames from "classnames";
import editorButtons from './styles.css';
import styles from '../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Painterro from '../../../../../../lib/painterro/painterro.commonjs2'
import MyWorkFooter from './components/MyWorkFooter'
import painterroConfiguration from './painterroConfiguration.json'
import createAlert from '../../../../../../scripts/alert';
import Locales from '../../../../../../strings'

export default class MyWorkEditorButtons extends Component {
    constructor(props) {
        super(props);
        this.scratchPadPainterro;
    }

    handleClick(scratchPadPainterro) {
        $('#scratch-pad-containter').slideToggle("fast", function () {
            if (scratchPadPainterro && $("#scratch-pad-containter").is(":visible")) {
                scratchPadPainterro.adjustSizeFull();
            }
        });
    }

    InitScratchPad() {
        this.scratchPadPainterro = Painterro(painterroConfiguration);

        this.scratchPadPainterro.show();
        $('#scratch-pad-containter').hide();

        $('#scratch-pad-containter-bar > div > span').first()
            .append('<button id="clear-button" type="button" class="ptro-icon-btn ptro-color-control" title='+ Locales.strings.clear_scratchpad + '><i class="ptro-icon ptro-icon-close"></i></button>');
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
        $('#undoAction').hide();
        try {
            this.InitScratchPad();
        } catch(e) {
            createAlert("warning", Locales.strings.sketchpad_loading_warning, "Warning");
        }
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
                            title={Locales.strings.display_hide_sketchpad}
                            onClick={() => this.handleClick(this.scratchPadPainterro)}
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
                            content={Locales.strings.add_step}
                            step="3"
                            intro={Locales.strings.add_step_intro}
                            icon="plus"
                            onClick={this.props.addStepCallback}
                            />
                        <div id="updateControls" style={this.props.editing ? {} : {display: 'none'}} >
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
                                title={Locales.strings.update_step_button_title}
                                content={Locales.strings.update_step}
                                step="3"
                                intro={Locales.strings.update_step_intro}
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
                <MyWorkFooter deleteStepsCallback={this.props.deleteStepsCallback} hide={this.props.editing} history={this.props.history}
                    savedProblem={() => this.props.savedProblem()}/>
            </div>
        );
    }
}
