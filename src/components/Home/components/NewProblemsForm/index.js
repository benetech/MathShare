import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import { arrayMove } from 'react-sortable-hoc';
import * as dayjs from 'dayjs';
import { IntercomAPI } from 'react-intercom';
import Locales from '../../../../strings';
import styles from './styles.scss';
import MyWork from '../../../Editor/components/MyWork';
import showImage from '../../../../scripts/showImage';
import Button from '../../../Button';
import parseMathLive from '../../../../scripts/parseMathLive';
import scrollTo from '../../../../scripts/scrollTo';
import googleAnalytics from '../../../../scripts/googleAnalytics';
import { passEventForKeys, stopEvent } from '../../../../services/events';
import TTSButton from '../../../TTSButton';
import { latexToSpeakableText } from '../../../../services/speech';
import CommonModal, { CommonModalHeader } from '../../../ModalContainer/components/CommonModal';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class NewProblemsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: [],
            displayScratchpad: null,
            title: `${Locales.strings.new_problem_set} ${dayjs().format('MM-DD-YYYY')}`,
        };

        setImmediate(() => {
            mathLive.renderMathInDocument();
        }, 0);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            problems: newProps.problems,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        mathLive.renderMathInDocument();
        if (prevState.problems.length !== this.state.problems.length) {
            this.scrollToBottom();
        }
        if (this.state.displayScratchpad && this.props.problemToEdit) {
            googleAnalytics('Open Sketch Tab');
            this.state.displayScratchpad(this.props.problemToEdit.scratchpad);
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ displayScratchpad: null });
            IntercomAPI('trackEvent', 'sketch');
        }
    }

    onImgClick = (img) => {
        showImage(img);
    }

    getApplicationNode = () => document.getElementById('contentContainer');

    scrollToBottom = () => {
        scrollTo('container', 'myWorkFooter');
    }

    textAreaChanged = (text) => {
        this.props.updateProblemStore({ textAreaValue: text });
    }

    reorder = (oldIndex, newIndex) => {
        this.setState((prevState) => {
            let problems = prevState.problems;
            problems[oldIndex].position = newIndex;
            problems[newIndex].position = oldIndex;
            problems = arrayMove(problems, oldIndex, newIndex);
            return { problems };
        }, () => {
            if (!this.props.newProblemSet) {
                this.props.saveCallback(this.state.problems);
            } else {
                this.props.updateTempSet({
                    problems: this.state.problems,
                });
            }
            mathLive.renderMathInDocument();
        });
    }

    update = (imageData, title) => {
        this.props.editProblemCallback(imageData, title);
    }

    addProblem = (imageData, text) => this.props.addProblemCallback(
        imageData, text, this.state.problems.length, this.props.newProblemSet,
    )

    save = () => {
        this.props.saveCallback(this.state.problems, this.state.title);
    }

    pressMoveBtn = (index, problem, isUp) => (e) => {
        let newIndex = index;
        if (isUp) {
            if (index > 0) {
                newIndex = problem.position - 1;
            }
        } else if (index < this.state.problems.length - 1) {
            newIndex = problem.position + 1;
        }
        if (index !== newIndex) {
            this.reorder(problem.position, newIndex);
            setTimeout(() => {
                const id = `${isUp ? 'moveUp' : 'moveDown'}-${newIndex}`;
                const element = document.getElementById(id);
                if (element) {
                    element.focus();
                }
            }, 250);
        }

        return stopEvent(e);
    }

    getSpeakableTextForStep = (stepNo, problem) => (
        Locales.strings.step_tts_text
            .replace('{stepNo}', stepNo)
            .replace('{mathEquation}', latexToSpeakableText(problem.text))
            .replace('{explanation}', problem.title)
    );

    getSpeakableTextForCurrentProblem = () => {
        let math = '';
        if (this.props.theActiveMathField) {
            math = this.props.theActiveMathField.$latex();
            if (math) {
                math = latexToSpeakableText(math);
            }
        }
        return [math, this.props.textAreaValue].filter(val => val.trim() !== '').join(' .');
    }

    render() {
        const problems = this.state.problems.map((problem, i) => {
            const img = problem.scratchpad
                ? (
                    <button
                        className="reset-btn"
                        type="button"
                        onClick={() => this.onImgClick(problem.scratchpad)}
                        onKeyPress={passEventForKeys(() => this.onImgClick(problem.scratchpad))}
                    >
                        <span className="sROnly">
                            {Locales.strings.view_sketch.replace('{no}', i + 1)}
                            {'\u00A0'}
                            {Locales.strings.opens_in_new_tab}
                        </span>
                        <FontAwesome
                            size="2x"
                            className={styles.img}
                            name="image"
                        />
                    </button>
                ) : null;

            const moveUpBtn = (
                <button
                    id={`moveUp-${i}`}
                    className="reset-btn"
                    type="button"
                    onClick={this.pressMoveBtn(i, problem, true)}
                    onKeyPress={passEventForKeys(this.pressMoveBtn(i, problem, true))}
                >
                    <FontAwesome
                        size="lg"
                        className={i === 0 ? styles.disabled : null}
                        name="caret-up"
                    />
                </button>

            );
            const moveDownBtn = (
                <button
                    id={`moveDown-${i}`}
                    className="reset-btn"
                    type="button"
                    onClick={this.pressMoveBtn(i, problem, false)}
                    onKeyPress={passEventForKeys(this.pressMoveBtn(i, problem, false))}
                >
                    <FontAwesome
                        size="lg"
                        className={i === this.state.problems.length - 1 ? styles.disabled : null}
                        name="caret-down"
                    />
                </button>
            );

            return (
                <tr className={styles.row} key={problem.id}>
                    <th scope="row" className={styles.ordinal}>
                        {i + 1}
                        .
                    </th>
                    <td className={styles.cell}>
                        {`$$${problem.text}$$`}
                    </td>
                    <td className={`${styles.cell} ${styles.titleCell}`}>
                        {`$$${parseMathLive(problem.title)}}$$`}
                    </td>
                    <td className={styles.rowControl}>
                        <TTSButton
                            id={`tts-step-${i}`}
                            additionalClass={classNames(styles.ttsButton, 'reset-btn')}
                            text={this.getSpeakableTextForStep(i + 1, problem)}
                            ariaLabelSuffix={Locales.strings.problem_no.replace('{no}', i + 1)}
                        />
                        {img}
                        <div className={styles.positionButtons}>
                            {moveUpBtn}
                            {moveDownBtn}
                        </div>
                    </td>
                </tr>
            );
        });
        const problemTable = (
            <table>
                <caption>
                    <div className="sROnly">{Locales.strings.current_problems}</div>
                </caption>
                <thead>
                    <tr className={styles.headerRow} key="header-row">
                        <th scope="col">
                            <div className="sROnly">
                                {Locales.strings.number}
                            </div>
                        </th>
                        <th scope="col">
                            {Locales.strings.equation}
                        </th>
                        <th className={styles.titleCell} scope="col">
                            {Locales.strings.prompt}
                        </th>
                        <th className={styles.tableControlHeader} scope="col">
                            <div className="sROnly">
                                {Locales.strings.problem_row_controls}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>{problems}</tbody>
            </table>
        );
        const header = this.props.editing ? null
            : (
                <div className={styles.header}>
                    <div>
                        <CommonModalHeader>{this.props.title}</CommonModalHeader>
                    </div>
                </div>
            );
        let doneButton = this.props.newProblemSet
            ? (
                <Button
                    id="saveButton"
                    className="btn"
                    additionalStyles={['withRightMargin', 'default', 'right']}
                    icon="save"
                    content={Locales.strings.save}
                    onClick={this.save}

                />
            )
            : (
                <Button
                    id="doneButton"
                    className="btn"
                    additionalStyles={['withRightMargin', 'default', 'right']}
                    icon="check"
                    content={this.props.editing ? Locales.strings.close : Locales.strings.done}
                    onClick={this.props.deactivateModal}
                />
            );
        doneButton = (this.props.newProblemSet) ? null : doneButton;
        const cancelButton = this.props.newProblemSet
            ? (
                <Button
                    id="bottom"
                    className="btn"
                    additionalStyles={['withRightMargin', 'default', 'right']}
                    content={
                        this.props.newProblemSet ? Locales.strings.close : Locales.strings.cancel
                    }
                    icon="times-circle"
                    onClick={this.props.deactivateModal}
                />
            ) : null;

        const lastMathEquation = this.props.editing ? this.props.problemToEdit.text : '';
        const scratchpadContent = this.props.editing ? this.props.problemToEdit.scratchpad : null;
        return (
            <CommonModal
                deactivateModal={this.props.deactivateModal}
                focusOnExit="#problem-new > button"
            >
                <div className={styles.container} id="container">
                    {header}
                    {problemTable}
                    <MyWork
                        key="editor"
                        allowedPalettes={this.props.allowedPalettes}
                        activateMathField={this.props.activateMathField}
                        theActiveMathField={this.props.theActiveMathField}
                        textAreaChanged={this.textAreaChanged}
                        textAreaValue={this.props.textAreaValue}
                        addStepCallback={this.addProblem}
                        editing={false}
                        history={[]}
                        solution={this.props.solution}
                        addingProblem={this.props.addingProblem}
                        editingProblem={this.props.editing}
                        lastMathEquation={lastMathEquation}
                        updateCallback={this.update}
                        scratchpadContent={scratchpadContent}
                        bindDisplayFunction={f => this.setState({ displayScratchpad: f })}
                    />
                    <div id="myWorkFooter" className={styles.footer}>
                        {doneButton}
                        {cancelButton}
                    </div>
                </div>
            </CommonModal>
        );
    }
}
