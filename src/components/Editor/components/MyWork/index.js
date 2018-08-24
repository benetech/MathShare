import React, { Component } from "react";
import MyWorkEditorArea from './components/MyWorkEditorArea';
import MathPalette from './components/MathPalette';
import MyWorkEditorButtons from './components/MyWorkEditorButtons';
import classNames from "classnames";
import myWork from './styles.css';
import editor from '../../styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import Locales from '../../../../strings'

export default class MyWork extends Component {
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
                            <MathPalette theActiveMathField={this.props.theActiveMathField} allowedPalettes={this.props.allowedPalettes}/>
                            <MyWorkEditorButtons className="d-flex flex-nowrap justify-content-between" addStepCallback={this.props.addStepCallback} 
                                undoLastActionCallback={this.props.undoLastActionCallback}  cancelEditCallback={this.props.cancelEditCallback}
                                deleteStepsCallback={this.props.deleteStepsCallback} editing={this.props.editing} history={this.props.history}
                                solution={this.props.solution} addingProblem={this.props.addingProblem}  cancelCallback={this.props.cancelCallback}
                                saveCallback={this.props.saveCallback}/>
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
