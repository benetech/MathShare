import React, { Component } from "react";
import SpeechToTextButton from "./components/SpeechToTextButton";
import classNames from "classnames";
import editorArea from './styles.css';
import Locales from '../../../../../../strings'

const mathLive = DEBUG_MODE ? require('../../../../../../../mathlive/src/mathlive.js')
    : require('../../../../../../../src/lib/mathlivedist/mathlive.js');

export default class MyWorkEditorArea extends Component {
    componentDidMount() {
        var mathField = this.getMathField();
        mathField.latex(this.props.lastMathEquation);
        this.props.activateMathField(mathField);
        this.refs.mathEditorActive.onFocus = mathField.focus();
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
        var tts_hint = this.props.addingProblem ? Locales.strings.tts_hint_add_problem : Locales.strings.tts_hint;
        var tts_intro = this.props.addingProblem ? Locales.strings.tts_intro_add_problem : Locales.strings.tts_intro;
        return (
            <div role="heading" aria-level="2">
                <div className={'row'}>
                    <div className={'col-lg-12'}>
                        <div id="workArea"
                            className={
                                classNames(
                                    editorArea.workArea,
                                    'd-flex',
                                    'flex-nowrap',
                                    'justify-content-between'
                                )
                            }
                            data-step="1"
                            data-position="top"
                            data-intro={Locales.strings.work_area_intro}
                        >
                            <h3 className={'sROnly'}>{Locales.strings.math_editor}</h3>
                            <section
                                aria-label={Locales.strings.edit_equation}
                                id="mathEditorActive"
                                ref="mathEditorActive"
                                tabIndex="0"
                                className={classNames('order-1', editorArea.mathEditorActive)}
                                role="heading"
                                aria-label={Locales.strings.type_math_here}
                            ></section>
                            <div
                                id="mathAnnotationContainer"
                                className={classNames(
                                    'order-2',
                                    editorArea.annotationContainer,
                                )}
                                role="heading"
                                aria-level="3"
                            >
                                <h3
                                    id="mathAnnotationHeader"
                                    className={
                                        classNames(
                                            editorArea.annotationHeader,
                                            'sROnly'
                                        )
                                    }
                                    tabIndex="-1"
                                >
                                    Describe your work
                                </h3>
                                <textarea
                                    id="mathAnnotation"
                                    ref="mathAnnotation"
                                    className={classNames(
                                        'form-control',
                                        editorArea.annotation,
                                    )}
                                    placeholder={tts_hint}
                                    data-step="2"
                                    data-intro={tts_intro}
                                    aria-label={tts_hint}
                                    value={this.props.textAreaValue}
                                    onChange={value => this.props.textAreaChanged(value.target.value)}
                                    >
                                </textarea>
                                <SpeechToTextButton textAreaValue={this.props.textAreaValue}
                                    setTextAreaValue={value => this.props.textAreaChanged(value)} />
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
