import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MyWorkEditorArea from './components/MyWorkEditorArea';
import MathPalette from './components/MathPalette';
import MyWorkEditorButtons from './components/MyWorkEditorButtons';
import myWork from './styles.scss';
import editor from '../../styles.scss';
import Locales from '../../../../strings';
import { sessionStore } from '../../../../scripts/storage';
import { updateWork } from '../../../../redux/problem/actions';
import Painterro from '../../../../lib/painterro/painterro.commonjs2';
import painterroConfiguration from './painterroConfiguration.json';
import TTSButton from '../../../TTSButton';
import { checkIfDescriptionIsRequired } from '../../stepsOperations';
import { latexToSpeakableText } from '../../../../services/speech';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../lib/mathlivedist/mathlive.js');

class MyWork extends Component {
    constructor(props) {
        super(props);
        // eslint-disable-next-line no-unused-expressions
        this.scratchPadPainterro;

        this.openScratchpad = this.openScratchpad.bind(this);
        this.hideScratchpad = this.hideScratchpad.bind(this);
        this.addStepCallback = this.addStepCallback.bind(this);
        this.updateCallback = this.updateCallback.bind(this);
        this.clearAndResizeScratchPad = this.clearAndResizeScratchPad.bind(this);
        this.scratchpadChangeHandler = this.scratchpadChangeHandler.bind(this);
        this.InitScratchPad = this.InitScratchPad.bind(this);
        this.displayScratchpadImage = this.displayScratchpadImage.bind(this);
        this.loadImage = this.loadImage.bind(this);
    }

    componentDidMount() {
        if (this.props.bindDisplayFunction) {
            this.props.bindDisplayFunction((scratchpadContent) => {
                this.props.updateWork({
                    scratchpadContent,
                    scratchPadPainterro: this.scratchPadPainterro,
                });
                this.displayScratchpadImage();
            });
        }
        document.getElementById('mathEditorActive').addEventListener('keydown', this.HandleKeyDown);
        const { problem } = this.props;
        const { scratchpadMode } = problem.work;
        if (scratchpadMode) {
            setTimeout(this.openScratchpad, 0);
        }
    }

    getScratchPadValue = () => {
        const { problem } = this.props;
        let { scratchPadValue, height, width } = problem.work;

        if (problem.work.isScratchpadUsed) {
            scratchPadValue = this.scratchPadPainterro.imageSaver.asDataURL();
            height = this.scratchPadPainterro.canvas.height;
            width = this.scratchPadPainterro.canvas.width;
        }

        if (scratchPadValue) {
            const blank = document.createElement('canvas');
            blank.width = width;
            blank.height = height;
            const ctx = blank.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);

            if (scratchPadValue !== blank.toDataURL()) {
                return scratchPadValue;
            }
        }
        return undefined;
    }

    HandleKeyDown = (event) => {
        const { problem, problemList } = this.props;
        const keyShortcuts = new Map(JSON.parse(sessionStore.getItem('keyShortcuts')));
        if (event.shiftKey && this.props.theActiveMathField.$selectionIsCollapsed()) {
            // if an insertion cursor, extend the selection unless we are at an edge
            if (event.key === 'Backspace' && !this.props.theActiveMathField.$selectionAtStart()) {
                this.props.theActiveMathField.$perform('extendToPreviousChar');
            } else if (event.key === 'Delete' && !this.props.theActiveMathField.$selectionAtEnd()) {
                this.props.theActiveMathField.$perform('extendToNextChar');
            }
        }
        if (event.shiftKey && event.key === 'Enter' && ($('#mathAnnotation').val() !== '' || !checkIfDescriptionIsRequired(problem, problemList))) {
            event.preventDefault();
            if (this.props.editing || this.props.editingProblem) {
                this.updateCallback();
            } else {
                this.addStepCallback();
            }
        }
        if (event.shiftKey && event.key === 'Backspace' && this.props.showDelete && !this.props.addingProblem) {
            event.preventDefault();
            this.props.undoLastActionCallback();
        }

        const keys = [];
        if (event.shiftKey) {
            keys.push('Shift');
        }
        if (event.altKey) {
            keys.push('Alt');
        }
        if (event.metaKey) {
            keys.push('Cmd');
        }
        if (event.ctrlKey) {
            keys.push('Ctrl');
            if (event.key === ' ') {
                // eslint-disable-next-line no-useless-escape
                this.props.theActiveMathField.$perform(['insert', '\\\ ']);
            }
        }
        keys.push(event.key);
        const id = keyShortcuts.get(keys.sort().join(''));
        if (id) {
            $(`#${id}`).click();
        }
    }

    getSpeakableText = () => {
        let math = '';
        const mathField = document.getElementById('mathEditorActive');
        if (mathField) {
            math = latexToSpeakableText(mathField.mathfield.$latex());
        }
        return [math, this.props.textAreaValue].filter(value => value.trim() !== '').join('. ');
    };

    scratchpadChangeHandler() {
        const { problem } = this.props;
        if (!problem.work.isScratchpadUsed) {
            this.props.updateWork({
                isScratchpadUsed: true,
                scratchPadPainterro: this.scratchPadPainterro,
            });
        }
    }

    InitScratchPad() {
        painterroConfiguration.onChange = this.scratchpadChangeHandler;
        this.scratchPadPainterro = Painterro(painterroConfiguration);
        this.scratchPadPainterro.show();
        /* eslint-disable no-useless-concat */
        $('#scratch-pad-containter-bar > div > span').first()
            .append(`${'<button id="clear-button" type="button" class="ptro-icon-btn ptro-color-control" title='
                + '"'}${Locales.strings.clear_sketchpad}"` + '><i class="ptro-icon ptro-icon-close"></i></button>');
        $('#clear-button').click(() => this.clearAndResizeScratchPad());

        $('#scratch-pad-containter-bar > div > span').first()
            .append(`${'<input ref="imageInput" id="open-image" hidden type="file"></input>'
                + '<button id="open-image-btn" type="button" class="ptro-icon-btn ptro-color-control" title='
                + '"'}${Locales.strings.open_image}"` + '><i class="ptro-icon ptro-icon-open"></i></button>');
        $('#open-image-btn').click(() => $('#open-image').trigger('click'));
        $('#open-image').change(e => this.loadImage(e));

        $('.ptro-icon-btn').css('border-radius', '.25rem');
        $('.ptro-bordered-btn').css('border-radius', '.5rem');
        $('.ptro-info').hide();

        this.props.updateWork({
            isScratchpadUsed: false,
            scratchPadPainterro: this.scratchPadPainterro,
        });
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const scratchpadContent = e.target.result;
            this.props.updateWork({
                scratchpadContent,
                scratchPadPainterro: this.scratchPadPainterro,
            });
            this.scratchPadPainterro.show(scratchpadContent);
        };
        reader.readAsDataURL(file);
    }

    displayScratchpadImage() {
        const { work } = this.props.problem;
        if (work.scratchpadMode) {
            this.clearAndResizeScratchPad(work.scratchpadContent);
            this.scratchPadPainterro.show(work.scratchpadContent);
        }
    }

    clearAndResizeScratchPad(content) {
        const { work } = this.props.problem;
        if (work.scratchpadMode) {
            this.scratchPadPainterro.clear();
            this.props.updateWork({
                isScratchpadUsed: false,
                scratchpadContent: content,
                scratchPadPainterro: this.scratchPadPainterro,
            });
        }
    }

    openScratchpad() {
        this.props.updateWork({
            scratchpadMode: true,
            scratchPadPainterro: this.scratchPadPainterro,
        });
        $('#scratch-pad-containter').show();
        this.displayScratchpadImage();
    }

    hideScratchpad() {
        this.props.updateWork({
            scratchpadMode: false,
            scratchpadContent: this.scratchPadPainterro.imageSaver.asDataURL(),
            scratchpadHeight: this.scratchPadPainterro.canvas.height,
            scratchpadWidth: this.scratchPadPainterro.canvas.width,
        });
        $('#scratch-pad-containter').hide();
        mathLive.renderMathInDocument();
    }

    addStepCallback() {
        const isAdded = this.props.addStepCallback(
            this.getScratchPadValue(), this.props.textAreaValue,
        );
        if (isAdded) {
            this.clearAndResizeScratchPad();
        }
    }

    updateCallback() {
        this.props.updateCallback(this.getScratchPadValue(), this.props.textAreaValue);
    }

    render() {
        const { problem } = this.props;
        return (
            <div id="EditorArea" className={myWork.editorArea}>
                <div className={myWork.myWorkArea}>
                    <div id="historyWorkSeparator" className={myWork.historyWorkSeparator}>
                        <h2
                            className={classNames(
                                editor.modalAreaHeading,
                                myWork.marginTop,
                            )}
                        >
                            {this.props.title || Locales.strings.mathshare_benetech}
                        </h2>
                        <TTSButton
                            id="tts-work-area"
                            spanStyle={myWork.ttsSpan}
                            additionalClass={editor.ttsButton}
                            text={this.getSpeakableText}
                            ariaLabelSuffix={this.props.title || Locales.strings.current_problem}
                        />
                    </div>
                    <div className={myWork.editorWrapper}>
                        <MyWorkEditorArea {...this.props} />
                        <div
                            className={classNames(
                                'd-flex',
                                'flex-nowrap',
                                'justify-content-between',
                                'pt-2',
                            )}
                        >
                            <MathPalette {...this} {...this.props} {...problem.work} />
                            <MyWorkEditorButtons
                                {...this}
                                {...this.props}
                                {...problem.work}
                                addStepCallback={this.addStepCallback}
                                updateCallback={this.updateCallback}
                                openScratchpad={this.openScratchpad}
                                className="d-flex flex-nowrap justify-content-between"
                            />
                        </div>
                        <div
                            className={classNames(
                                'd-flex',
                                'flex-nowrap',
                                'justify-content-between',
                                'pt-2',
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        problem: state.problem,
        problemList: state.problemList,
    }),
    {
        updateWork,
    },
)(MyWork);
