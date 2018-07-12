import React, { Component } from "react";
import Button from '../../.././../../Button';
import classNames from "classnames";
import editorArea from './styles.css';
import styles from '../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import mathLive from 'mathlive';

export default class MyWorkEditorArea extends Component {
    componentDidMount() {
        this.refs.mathEditorActive.onFocus = this.focusOnMathField();
    }

    focusOnMathField() {
        mathLive.makeMathField(
            this.refs.mathEditorActive,
            {
                commandbarToggle: 'hidden',
                overrideDefaultInlineShortcuts: false,
                inlineShortcuts:
                    {
                        '>-': '>-',			    // override builtin shortcut (\succ)
                        '<-': '<-',			    // override builtin shortcut (\leftarrow)
                        '<=': '\\leq',          // use more familiar ≤
                        '>=': '\\geq',          // use more familar ≥
                        '$': '\\$',			    // make it easy to type $
                        '%': '\\%',			    // make it easy to type %
                        '*': '\\times',		    // what most people want
                        '?=': '\\overset{?}{=}'	// is equal to
                    }
                    //onSelectionDidChange: UpdatePalette
            }
        ).focus();
    }

    render() {
        return (
            <div role="heading" aria-level="2">
                <div className={bootstrap.row}>
                    <div className={bootstrap['col-lg-12']}>
                        <div id="workArea"
                            className={
                                classNames(
                                    editorArea.workArea,
                                    bootstrap['d-flex'],
                                    bootstrap['flex-nowrap'],
                                    bootstrap['justify-content-between']
                                )
                            }
                            data-step="1"
                            data-position="top"
                            data-intro="Type or edit the equation using your keyboard and the math keys below. 
                                Try using the cross out, replace, and calc buttons to help show your work."
                        >
                            <h3 className={styles.sROnly}>Math editor</h3>
                            <section
                                aria-label="edit equation"
                                id='mathEditorActive'
                                ref="mathEditorActive"
                                tabIndex="0"
                                className={bootstrap['order-1']}
                                role="heading"
                                aria-label="type math here"
                            ></section>
                            <div
                                className={bootstrap['order-1']}
                                role="heading"
                                aria-level="3"
                            >
                                <h3
                                    id="mathAnnotationHeader"
                                    className={
                                        classNames(
                                            editorArea.annotationHeader,
                                            styles.sROnly
                                        )
                                    }
                                    tabIndex="-1"
                                >
                                    Describe your work
                                </h3>
                                <textarea
                                    id="mathAnnotation" 
                                    className={
                                        classNames(
                                            editorArea.annotation,
                                            editorArea.formControl
                                        )
                                    }
                                    placeholder="Use the microphone button or type to explain your work (required)"
                                    data-step="2"
                                    data-intro="Describe your work by typing directly 
                                        or using the microphone to record an explanation of your work (required)."
                                    aria-label="Use the microphone button or type to explain your work (required)">
                                </textarea>
                                <span className={editorArea.floatRight}>
                                    <Button
                                        id="start_button"
                                        className={
                                            classNames(
                                                bootstrap.btn,
                                                styles.pointer
                                            )
                                        }
                                        additionalStyles={['mic']}
                                        data-toggle="tooltip"
                                        content={
                                            <img
                                                id="mic_img"
                                                alt="Start Speaking"
                                                src="/images/mic.gif"
                                            />
                                        }
                                    //TODO onclick="GoogleAnalytics('S2T Clicked');"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
