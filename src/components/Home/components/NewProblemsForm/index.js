import React, { Component } from "react";
import AriaModal from "react-aria-modal";
import Locales from '../../../../strings';
import styles from './styles.css';
import MyWork from '../../../Editor/components/MyWork';
import FontAwesome from "react-fontawesome";
import showImage from "../../../../scripts/showImage";
import Button from "../../../../components/Button";
import { arrayMove } from 'react-sortable-hoc';
import parseMathLive from '../../../../scripts/parseMathLive.js';

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class NewProblemsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: [],
            textAreaValue: "",
            displayScratchpad: null
        };

        this.save = this.save.bind(this);
        this.update = this.update.bind(this);
        this.addStep = this.addStep.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.problems.length != this.state.problems.length) {
            this.scrollToBottom();
        }
    }

    componentWillReceiveProps(newProps) {
        var text = newProps.editing ? newProps.problemToEdit.title : "";
        this.setState({ 
            textAreaValue: text,
            problems: newProps.problems
         });
    }

    getApplicationNode() {
        return document.getElementById('root');
    };

    onImgClick(img) {
        showImage(img);
    }

    reorder(oldIndex, newIndex) {
        var problems = this.state.problems;
        problems[oldIndex].position = newIndex;
        problems[newIndex].position = oldIndex;
        problems = arrayMove(problems, oldIndex, newIndex);
        this.setState({ problems });
        mathLive.renderMathInDocument();
    }

    textAreaChanged(text) {
        this.setState({ textAreaValue: text });
    }

    scrollToBottom() {
        try {
            document.querySelector("#container").scrollTo(0, document.querySelector("#container").scrollHeight);
        } catch(e) {
            console.log("scrollTo method not supported");
        }
    }

    save() {
        this.props.saveCallback(this.state.problems);
    }

    update(imageData, text) {
        this.props.editProblemCallback(imageData, text);
    }

    addStep(imageData, text) {
        this.props.addProblemCallback(imageData, text, this.state.problems.length, this.state.displayScratchpad);
    }

    render() {
        let problems = this.state.problems.map((problem, i) => {
            const img = problem.scratchpad ?
                <FontAwesome
                    size="2x"
                    className={styles.img}
                    name="image"
                    onClick={() => this.onImgClick(problem.scratchpad)}
                /> : null;

            const moveUpBtn =
                <FontAwesome
                    size="lg"
                    className={i == 0 ? styles.disabled : null}
                    name="caret-up"
                    onClick={i == 0 ? null : () => this.reorder(problem.position, problem.position - 1)}
                />
            const moveDownBtn =

                <FontAwesome
                    size="lg"
                    className={i == this.state.problems.length - 1 ? styles.disabled : null}
                    name="caret-down"
                    onClick={i == this.state.problems.length - 1 ? null : () => this.reorder(problem.position, problem.position + 1)}
                />

            return <div className={styles.row} key={i}>
                <div className={styles.ordinal}>
                    {i + 1}.
                </div>
                <div className={styles.cell}>
                    {'$$' + problem.text + '$$'}
                </div>
                <div className={styles.cell}>
                    {'$$' + parseMathLive(problem.title) + '}$$'}
                </div>
                <div className={styles.rowControl}>
                    {img}
                    <div className={styles.positionButtons}>
                        {moveUpBtn}
                        {moveDownBtn}
                    </div>
                </div>
            </div>
        });
        var header = this.props.editing ? null :
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
                <div className={styles.rowControl}>
                </div>
            </div>
        var saveButton = this.props.editing ? null :
            <Button
                className={'btn'}
                additionalStyles={['withRightMargin', 'default', 'right']}
                icon="save"
                content={Locales.strings.save}
                onClick={this.save}
            />

        var lastMathEquation = this.props.editing ? this.props.problemToEdit.text : "";
        var scratchpadContent = this.props.editing ? this.props.problemToEdit.scratchpad : null;
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
                        key={"editor"}
                        allowedPalettes={this.props.allowedPalettes}
                        activateMathField={this.props.activateMathField}
                        theActiveMathField={this.props.theActiveMathField}
                        textAreaChanged={this.textAreaChanged}
                        textAreaValue={this.state.textAreaValue}
                        addStepCallback={this.addStep}
                        editing={false}
                        history={[]}
                        solution={this.props.solution}
                        addingProblem={this.props.addingProblem}
                        editingProblem={this.props.editing}
                        title={this.props.title}
                        lastMathEquation={lastMathEquation}
                        updateCallback={this.update}
                        scratchpadContent={scratchpadContent}
                        bindDisplayFunction={(f) => this.setState({ displayScratchpad: f })} />
                    <div className={styles.footer}>
                        {saveButton}
                        <Button
                            id='bottom'
                            className={'btn'}
                            additionalStyles={['withRightMargin', 'default', 'right']}
                            content={Locales.strings.cancel}
                            icon="times-circle"
                            onClick={this.props.cancelCallback}
                        />
                    </div>
                    <div className={styles.footer}/>
                </div>
            </AriaModal>
        );
    }
}