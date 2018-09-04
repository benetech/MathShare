import React, { Component } from "react";
import AriaModal from "react-aria-modal";
import Locales from '../../../../strings';
import styles from './styles.css';
import MyWork from '../../../Editor/components/MyWork';
import FontAwesome from "react-fontawesome";
import showImage from "../../../../scripts/showImage";
import Button from "../../../../components/Button";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { arrayMove } from 'react-sortable-hoc';

const mathLive = DEBUG_MODE ? require('../../../../../mathlive/src/mathlive.js')
    : require('../../../../lib/mathlivedist/mathlive.js');

export default class NewProblemsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: [],
            textAreaValue: "",
        };

        this.save = this.save.bind(this);
        this.textAreaChanged = this.textAreaChanged.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({ problems: newProps.problems });
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

    save() {
        this.props.saveCallback(this.state.problems);
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
                    {problem.title}
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

        return (
            <AriaModal
                id="modal"
                titleText="demo one"
                onExit={this.props.deactivateModal}
                getApplicationNode={this.getApplicationNode}
                underlayStyle={{ paddingTop: '2em' }}
            >
                <div className={styles.container} id="container">
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
                    {problems}
                    <MyWork
                        key={"editor"}
                        allowedPalettes={this.props.allowedPalettes}
                        activateMathField={this.props.activateMathField}
                        theActiveMathField={this.props.theActiveMathField}
                        textAreaChanged={this.textAreaChanged}
                        textAreaValue={this.state.textAreaValue}
                        addStepCallback={this.props.addProblemCallback}
                        editing={false}
                        history={[]}
                        solution={this.props.solution}
                        addingProblem />
                    <div ref={el => { this.el = el; }} className={styles.footer}>

                        <Button
                            className={bootstrap.btn}
                            additionalStyles={['withRightMargin', 'default', 'right']}
                            icon="save"
                            content={Locales.strings.save}
                            onClick={this.save}
                        />
                        <Button
                            className={bootstrap.btn}
                            additionalStyles={['withRightMargin', 'default', 'right']}
                            content={Locales.strings.cancel}
                            icon="times-circle"
                            onClick={this.props.cancelCallback}
                        />
                    </div>
                </div>
            </AriaModal>
        );
    }
}