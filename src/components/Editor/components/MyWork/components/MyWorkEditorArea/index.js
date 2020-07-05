import React, { Component } from 'react';
import classNames from 'classnames';
import SpeechToTextButton from './components/SpeechToTextButton';
import editorArea from './styles.scss';
import Locales from '../../../../../../strings';
import { checkIfDescriptionIsRequired } from '../../../../stepsOperations';

const mathLive = process.env.MATHLIVE_DEBUG_MODE
    ? require('../../../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../../../../src/lib/mathlivedist/mathlive.js');

/* eslint-disable react/no-string-refs, no-tabs, max-len, no-useless-concat, no-undef, no-continue, no-unused-vars */
export default class MyWorkEditorArea extends Component {
    componentDidMount() {
        const mathField = this.getMathField();
        mathField.$latex(this.props.lastMathEquation);
        this.props.activateMathField(mathField);
        // const mathEditorActive = document.getElementById('mathEditorActive');
        // if (mathEditorActive) {
        //     mathEditorActive.focus();
        // }
    }

    getMathField() {
        return mathLive.makeMathField(
            this.refs.mathEditorActive,
            {
                commandbarToggle: 'hidden',
                virtualKeyboardMode: /android|ipad|ipod|iphone/i.test(navigator.userAgent) ? 'onfocus' : 'off',
                smartMode: true,
                smartFence: false,
                smartSuperscript: true,
                overrideDefaultInlineShortcuts: false,
                inlineShortcuts:
                {
                    '>-': '>-', // override builtin shortcut (\succ)
                    '<-': '<-', // override builtin shortcut (\leftarrow)
                    '<=': '\\leq', // use more familiar ≤
                    '>=': '\\geq', // use more familar ≥
                    // eslint-disable-next-line quote-props
                    '$': '\\$', // make it easy to type $
                    '%': '\\%', // make it easy to type %
                    '*': '\\times', // what most people want
                    '?=': '\\overset{?}{=}', // is equal to
                    sqrt: '\\sqrt{#0}', // square root (currently broken in mathlive)
                    squareroot: '\\sqrt{#0}', // square root (for consistency with 'cuberoot')
                    cbrt: '\\sqrt[3]{#0}', // cube root
                    cuberoot: '\\sqrt[3]{#0}', // cube root
                    root: '\\sqrt[{#?}]{#0}', // general root
                },
                removeExtraneousParentheses: false, // if typed, keep parens around
                onMoveOutOf: () => false,
                onKeystroke: (key) => {
                    if (key === 'Enter') {
                        this.props.theActiveMathField.$perform('complete');
                        this.props.theActiveMathField.commandMode = false;
                    } else if (key === 'Spacebar') {
                        if (this.props.theActiveMathField.commandMode) {
                            this.props.theActiveMathField.$perform('complete');
                        }
                        this.props.theActiveMathField.$insert('\\ ');
                        this.props.theActiveMathField.$insert('\\ ');
                        this.props.theActiveMathField.$perform('moveToNextChar');
                        this.props.theActiveMathField.$perform('moveToPreviousChar');
                        if (this.props.theActiveMathField.commandMode) {
                            this.props.theActiveMathField.$perform('enterCommandMode');
                            this.props.theActiveMathField.$insert('text{}');
                            this.props.theActiveMathField.$perform('moveToPreviousChar');
                        }
                        return false;
                    } else if (key === 'Esc') {
                        $('#mathAnnotationHeader').focus();
                        $('#mathEditorActive').find('span[aria-live]')[0].textContent = 'after application';
                        return false;
                    }
                    return true;
                },
                textToSpeechMarkup: 'ssml',
                textToSpeechRules: 'sre',
                textToSpeechRulesOptions: { domain: 'mathspeak', style: 'default', markup: 'ssml_step' },
                speechEngine: 'amazon',
            },
        );
    }

    setFocus = () => {
        if (this.props.theActiveMathField && this.props.theActiveMathField.$focus) {
            this.props.theActiveMathField.$focus();
        }
    }

    render() {
        let ttsHint = Locales.strings.tts_hint_add_problem;
        if (!this.props.addingProblem) {
            let required = '';
            const { problem, problemList } = this.props;
            if (checkIfDescriptionIsRequired(problem, problemList)) {
                required = ` (${Locales.strings.required})`;
            }
            ttsHint = `${Locales.strings.tts_hint}${required}`;
        }
        const ttsIntro = this.props.addingProblem ? Locales.strings.tts_intro_add_problem : Locales.strings.tts_intro;
        return (
            <section aria-labelledby="workarea-header">
                <h2
                    id="workarea-header"
                    className="sROnly"
                    tabIndex={-1}
                >
                    {Locales.strings.work_area_intro}
                </h2>
                <div className="row col-lg-12">
                    <div
                        id="workArea"
                        className={
                            classNames(
                                editorArea.workArea,
                                'd-flex',
                                'flex-nowrap',
                                'justify-content-between',
                            )
                        }
                        data-step="1"
                        data-position="top"
                        data-intro={Locales.strings.work_area_intro}
                    >
                        <h2 className="sROnly">{Locales.strings.math_editor}</h2>
                        <div
                            aria-label={Locales.strings.edit_equation}
                            id="mathEditorActive"
                            ref="mathEditorActive"
                            className={classNames('order-1', editorArea.mathEditorActive)}
                            role="application"
                            tabIndex={-1}
                            onFocus={this.setFocus}
                        />
                        <div
                            id="mathAnnotationContainer"
                            className={classNames(
                                'order-2',
                                editorArea.annotationContainer,
                            )}
                        >
                            <h2
                                id="mathAnnotationHeader"
                                className={
                                    classNames(
                                        editorArea.annotationHeader,
                                        'sROnly',
                                    )
                                }
                                tabIndex="-1"
                            >
                                {Locales.strings.describe_your_work}
                            </h2>
                            <textarea
                                id="mathAnnotation"
                                data-toggle="tooltip"
                                title={Locales.strings.no_description_warning}
                                ref="mathAnnotation"
                                className={classNames(
                                    'form-control',
                                    editorArea.annotation,
                                )}
                                placeholder={ttsHint}
                                data-step="2"
                                data-intro={ttsIntro}
                                aria-label={ttsHint}
                                value={this.props.textAreaValue}
                                onChange={
                                    value => this.props.textAreaChanged(value.target.value)}
                            />
                            <SpeechToTextButton
                                textAreaValue={this.props.textAreaValue}
                                setTextAreaValue={value => this.props.textAreaChanged(value)}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

//* ***********************************************************************************************
// Update the palette with the current selection for the active math editor
// Reset the palette when the selection is just an insertion cursor
// @param mathField -- the active math editor called on 'onSelectionDidChange'

function UpdatePalette(mathField) {
    if (mathField.mathlist) {
        const origSelection = mathField.$selectedText('latex');
        const cleanedSelection = CleanUpCrossouts(origSelection, { erase: true });	// selection without crossouts (pre-compute)

        // probably only one palette, but future-proof and handle all
        // for every button in all the palettes...
        //   substitute in the latex for the black square and use that for the rendering
        // this could be more efficient by not making a change if the selection didn't change,
        //   but this seems efficient enough. It could be that mathlive already does this optimization
        // Note: the original value remains stored in a data attr and that value works
        //   regardless of the selection because the 'insert' command replaces the selection
        const templates = $('.paletteButton');
        for (let iTemplate = 0; iTemplate < templates.length; iTemplate += 1) {
            const elem = templates[iTemplate];
            const mathstyle = elem.getAttribute('data-' + /* options.namespace +( */ 'mathstyle') || 'displaystyle';
            try {
                let newContents = MathLive.getOriginalContent(elem);
                if (!newContents) continue;
                newContents = newContents.replace(/\$\$/g, '');	// remove $$'s

                if (origSelection) {
                    // we have latex for the selection, so substitute it in
                    // if both have cross outs, remove them from the selection
                    // this matches the behavior on activation
                    const selection = newContents.includes(CrossoutTeXString) ? cleanedSelection : origSelection;
                    newContents = newContents.replace('\\blacksquare', selection);
                }
                elem.innerHTML = MathLive.latexToMarkup(newContents, mathstyle);
            } catch (e) {
                throw (new Error(
                    `Could not parse'${
                        MathLive.getOriginalContent(elem)
                            .replace(/\$\$/g, '')
                            .replace('\\blacksquare', selection)}'`,
                ));
            }
        }
    }
}
