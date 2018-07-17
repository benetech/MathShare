import React, { Component } from "react";
import Button from '../../.././../../Button';
import classNames from "classnames";
import editorArea from './styles.css';
import styles from '../../../../../../styles/styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import mathLive from '../../../../../../lib/mathlivedist/mathlive.js';

export default class MyWorkEditorArea extends Component {
    componentDidMount() {
        var mathField = this.getMathField();
        this.props.activateMathField(mathField);
        this.refs.mathEditorActive.onFocus = mathField.focus();
        mathField.insert(this.props.lastStepEquation);
    }

    getMathField() {
        return mathLive.makeMathField(
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
        );
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
                                                src="src/images/mic.gif"
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

//***************************************************************************************************************************************************
// Update the palette with the current selection for the active math editor
// Reset the palette when the selection is just an insertion cursor
// @param mathField -- the active math editor called on 'onSelectionDidChange'
function UpdatePalette(mathField) {
    if (mathField.mathlist) {
        let origSelection = mathField.selectedText('latex')
        let cleanedSelection = CleanUpCrossouts( origSelection, {erase:true} );	// selection without crossouts (pre-compute)

        // probably only one palette, but future-proof and handle all
        // for every button in all the palettes...
        //   substitute in the latex for the black square and use that for the rendering
        // this could be more efficient by not making a change if the selection didn't change,
        //   but this seems efficient enough. It could be that mathlive already does this optimization
        // Note: the original value remains stored in a data attr and that value works
        //   regardless of the selection because the 'insert' command replaces the selection
        let templates = $('.paletteButton');
        for (let iTemplate=0; iTemplate<templates.length; iTemplate++) {
            let elem = templates[iTemplate];
            const mathstyle = elem.getAttribute('data-' + /*options.namespace +(*/ 'mathstyle') || 'displaystyle';
            try {
                let newContents = MathLive.getOriginalContent(elem);
                if (!newContents)
                    continue;
                newContents = newContents.replace(/\$\$/g,'')	// remove $$'s

                if (origSelection) {
                    // we have latex for the selection, so substitute it in
                    // if both have cross outs, remove them from the selection
                    // this matches the behavior on activation
                    let selection = newContents.includes(CrossoutTeXString) ? cleanedSelection : origSelection;
                    newContents = newContents.replace('\\blacksquare', selection);
                }
                elem.innerHTML = MathLive.latexToMarkup(newContents, mathstyle);
            } catch (e) {
                console.error(
                    "Could not parse'" +
                    MathLive.getOriginalContent(elem).
                        replace(/\$\$/g,'').
                        replace('\\blacksquare',selection) + "'"
                );
            }
        }
    }
}