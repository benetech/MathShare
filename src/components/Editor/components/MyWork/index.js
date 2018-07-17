import React, { Component } from "react";
import MyWorkEditorArea from './components/MyWorkEditorArea';
import MathPalette from './components/MathPalette';
import MyWorkEditorButtons from './components/MyWorkEditorButtons';
import MyWorkFooter from './components/MyWorkFooter';
import classNames from "classnames";
import myWork from './styles.css';
import editor from '../../styles.css';
import styles from '../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

export default class MyWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theActiveMathField: null
        };
    }

    render() {
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
                                aria-hidden="true"
                            >
                                My Work
                            </span>
                            <br/>
                            <span className={styles.sROnly}>My Work</span>
                        </h2>
                    </div>
                    <div className={myWork.editorWrapper}>
                        <MyWorkEditorArea activateMathField={theActiveMathField => this.setState({theActiveMathField})}
                            lastStepEquation={this.props.lastStepEquation} />
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
                            <MathPalette
                                theActiveMathField={this.state.theActiveMathField}
                                allowedPalettes={this.props.allowedPalettes}
                            />
                            <MyWorkEditorButtons />
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
                            <div id="scratch-pad-containter" className={bootstrap['order-0']}></div>
                        </div>
                    </div>
                    <MyWorkFooter/>
                </div>
            </div>
        );
    }
}