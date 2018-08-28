import React, { Component } from "react";
import MyWorkEditorArea from './components/MyWorkEditorArea';
import MathPalette from './components/MathPalette';
import MyWorkEditorButtons from './components/MyWorkEditorButtons';
import classNames from "classnames";
import myWork from './styles.css';
import editor from '../../styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../strings';
import Painterro from '../../../../lib/painterro/painterro.commonjs2';
import painterroConfiguration from './painterroConfiguration.json';
import createAlert from '../../../../scripts/alert';

export default class MyWork extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isScratchpadUsed: false
        }

        this.scratchPadPainterro;

        this.openScratchpad = this.openScratchpad.bind(this);
        this.addStep = this.addStep.bind(this);
        this.clearAndResizeScratchPad = this.clearAndResizeScratchPad.bind(this);
        this.scratchpadChangeHandler = this.scratchpadChangeHandler.bind(this);
    }

    clearScrachPad() {
       this.scratchPadPainterro.clearBackground();
       this.scratchPadPainterro.worklog.current = null;
        // it is because Painterro displays a modal if we want to replace an existing ScratchPad content
       this.scratchPadPainterro.worklog.clean = true;
    }

    componentDidMount() {
        try {
            this.InitScratchPad();
        } catch(e) {
            createAlert("warning", Locales.strings.sketchpad_loading_warning, "Warning");
        }
    }

    scratchpadChangeHandler() {
        if (!this.state.isScratchpadUsed) {
            this.setState({isScratchpadUsed: true});
        }
    }

    InitScratchPad() {
        painterroConfiguration.changeHandler = this.scratchpadChangeHandler;
        this.scratchPadPainterro = Painterro(painterroConfiguration);

        this.scratchPadPainterro.show();
        $('#scratch-pad-containter').hide();

        $('#scratch-pad-containter-bar > div > span').first()
            .append('<button id="clear-button" type="button" class="ptro-icon-btn ptro-color-control" title='+ Locales.strings.clear_scratchpad + '><i class="ptro-icon ptro-icon-close"></i></button>');
        $('#clear-button').click(() =>
            this.clearAndResizeScratchPad()
        );
        $('.ptro-icon-btn').css('border-radius', '.25rem');
        $('.ptro-bordered-btn').css('border-radius', '.5rem');
        $('.ptro-info').hide();
        this.setState({isScratchpadUsed: false});
    }

    clearAndResizeScratchPad() {
        if (this.state.isScratchpadUsed) {
            this.setState({isScratchpadUsed: false});
            this.scratchPadPainterro.clear();
        }
    }

    openScratchpad() {
        this.setState({isScratchpadUsed: true});
        $('#scratch-pad-containter').slideToggle("fast", function () {
            if (this.scratchPadPainterro && $("#scratch-pad-containter").is(":visible")) {
                this.scratchPadPainterro.adjustSizeFull();
            }
        });
    }

    addStep() {
        this.props.addStepCallback(this.state.isScratchpadUsed ? this.scratchPadPainterro.imageSaver.asDataURL() : null);
    }

    render() {
        var title = this.props.addingProblem ? Locales.strings.add_problems : Locales.strings.my_work;
        return (
            <div id="EditorArea" className={myWork.editorArea}>
                <div className={myWork.myWorkArea}>
                    <div id="historyWorkSeparator" className={myWork.historyWorkSeparator}>
                        <h2>
                            <span
                                className={
                                    classNames(
                                        editor.modalAreaHeading,
                                        myWork.marginTop
                                    )
                                }
                                aria-hidden="true">
                                {title}
                            </span>
                            <br/>
                            <span className={styles.sROnly}>{Locales.strings.my_work}</span>
                        </h2>
                    </div>
                    <div className={myWork.editorWrapper}>
                        <MyWorkEditorArea activateMathField={this.props.activateMathField} lastMathEquation={this.props.lastMathEquation}
                            textAreaChanged={this.props.textAreaChanged} textAreaValue={this.props.textAreaValue} addingProblem={this.props.addingProblem}/>
                        <div
                            className={
                                classNames(
                                    bootstrap['d-flex'],
                                    bootstrap['flex-nowrap'],
                                    bootstrap['justify-content-between'],
                                    bootstrap['pt-2']
                                )
                            }
                        >
                            <MathPalette theActiveMathField={this.props.theActiveMathField} allowedPalettes={this.props.allowedPalettes} />
                            <MyWorkEditorButtons className="d-flex flex-nowrap justify-content-between" addStepCallback={this.addStep} 
                                undoLastActionCallback={this.props.undoLastActionCallback}  cancelEditCallback={this.props.cancelEditCallback}
                                deleteStepsCallback={this.props.deleteStepsCallback} editing={this.props.editing} history={this.props.history}
                                solution={this.props.solution} addingProblem={this.props.addingProblem} cancelCallback={this.props.cancelCallback}
                                saveCallback={this.props.saveCallback} openScratchpad={this.openScratchpad} clearAndResizeScratchPad={this.clearAndResizeScratchPad} />
                        </div>
                        <div
                            className={
                                classNames(
                                    bootstrap['d-flex'],
                                    bootstrap['flex-nowrap'],
                                    bootstrap['justify-content-between'],
                                    bootstrap['pt-2']
                                )
                            }
                        >
                            <div id="scratch-pad-containter" 
                                className={
                                    classNames(
                                        bootstrap['order-0'],
                                        myWork.scratchPadContainter
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
