import React, { Component } from 'react';
import AriaModal from 'react-aria-modal';
import FontAwesome from 'react-fontawesome';
import { arrayMove } from 'react-sortable-hoc';
import * as dayjs from 'dayjs';
import Locales from '../../../../strings';
import styles from './styles.scss';
import MyWork from '../../../Editor/components/MyWork';
import showImage from '../../../../scripts/showImage';
import Button from '../../../Button';
import parseMathLive from '../../../../scripts/parseMathLive';
import scrollTo from '../../../../scripts/scrollTo';
import googleAnalytics from '../../../../scripts/googleAnalytics';

const mathLive = process.env.MATHLIVE_DEBUG_MODE ? require('../../../../../../mathlive/src/mathlive.js').default
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class NewProblemsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: [],
            textAreaValue: '',
            displayScratchpad: null,
            title: `New Problem Set ${dayjs().format('MM-DD-YYYY')}`,
        };

        this.save = this.save.bind(this);
        this.update = this.update.bind(this);
        this.addProblem = this.addProblem.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);

        setImmediate(() => {
            mathLive.renderMathInDocument();
        }, 0);
    }

    componentWillReceiveProps(newProps) {
        const text = newProps.editing ? newProps.problemToEdit.title : '';
        this.setState({
            textAreaValue: text,
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
        }
    }

    onImgClick = (img) => {
        showImage(img);
    }

    getApplicationNode = () => document.getElementById('root');

    scrollToBottom = () => {
        scrollTo('container', 'myWorkFooter');
    }

    textAreaChanged(text) {
        this.setState({ textAreaValue: text });
    }

    reorder(oldIndex, newIndex) {
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

    update(imageData, title) {
        this.props.editProblemCallback(imageData, title);
    }

    addProblem(imageData, text) {
        return this.props.addProblemCallback(imageData, text, this.state.problems.length,
            this.props.newProblemSet);
    }

    save() {
        this.props.saveCallback(this.state.problems, this.state.title);
    }

    render() {
        const problems = this.state.problems.map((problem, i) => {
            const img = problem.scratchpad
                ? (
                    <FontAwesome
                        size="2x"
                        className={styles.img}
                        name="image"
                        onClick={() => this.onImgClick(problem.scratchpad)}
                    />
                ) : null;

            const moveUpBtn = (
                <FontAwesome
                    size="lg"
                    className={i === 0 ? styles.disabled : null}
                    name="caret-up"
                    onClick={i === 0 ? null : () => this.reorder(problem.position,
                        problem.position - 1)}
                />
            );
            const moveDownBtn = (
                <FontAwesome
                    size="lg"
                    className={i === this.state.problems.length - 1 ? styles.disabled : null}
                    name="caret-down"
                    onClick={i === this.state.problems.length - 1 ? null
                        : () => this.reorder(problem.position, problem.position + 1)}
                />
            );

            return (
                <div className={styles.row} key={i}>
                    <div className={styles.ordinal}>
                        {i + 1}
                        .
                    </div>
                    <div className={styles.cell}>
                        {`$$${problem.text}$$`}
                    </div>
                    <div className={styles.cell}>
                        {`$$${parseMathLive(problem.title)}}$$`}
                    </div>
                    <div className={styles.rowControl}>
                        {img}
                        <div className={styles.positionButtons}>
                            {moveUpBtn}
                            {moveDownBtn}
                        </div>
                    </div>
                </div>
            );
        });
        const header = this.props.editing ? null
            : (
                <div className={styles.header}>
                    <h5 className={styles.ordinal}>
                        {Locales.strings.hash}
                    </h5>
                    <h5 className={styles.cell}>
                        {Locales.strings.equation}
                    </h5>
                    <h5 className={styles.cell}>
                        {Locales.strings.title}
                    </h5>
                    <div className={styles.rowControl} />
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
                    content={Locales.strings.done}
                    onClick={this.props.deactivateModal}
                />
            );
        doneButton = (this.props.editing || this.props.newProblemSet) ? null : doneButton;
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
            <AriaModal
                id="modal"
                titleText="demo one"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div className={styles.container} id="container">
                    {header}
                    {problems}
                    <MyWork
                        key="editor"
                        allowedPalettes={this.props.allowedPalettes}
                        activateMathField={this.props.activateMathField}
                        theActiveMathField={this.props.theActiveMathField}
                        textAreaChanged={this.textAreaChanged}
                        textAreaValue={this.state.textAreaValue}
                        addStepCallback={this.addProblem}
                        editing={false}
                        history={[]}
                        solution={this.props.solution}
                        addingProblem={this.props.addingProblem}
                        editingProblem={this.props.editing}
                        title={this.props.title}
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
            </AriaModal>
        );
    }
}
